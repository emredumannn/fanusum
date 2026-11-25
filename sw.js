// Fanusum service worker — çevrimdışı çalışma + bildirimler
const V = 'fanusum-v4';
const FILES = ['./', 'index.html', 'style.css', 'config.js', 'notes.js', 'fish.js', 'sound.js', 'app.js', 'manifest.json',
  'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png'];
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (FONT_HOSTS.includes(url.hostname)) {
    e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(r => {
      const cp = r.clone(); caches.open(V).then(c => c.put(e.request, cp)); return r;
    })));
    return;
  }
  if (url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(r => {
      if (r.ok) { const cp = r.clone(); caches.open(V).then(c => c.put(e.request, cp)); }
      return r;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('index.html')))
  );
});

// --- bildirimler ---
self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (err) { d = { title: 'Fanusum', body: e.data ? e.data.text() : '' }; }
  const scope = self.registration.scope;
  e.waitUntil((async () => {
    await self.registration.showNotification(d.title || 'Fanusum', {
      body: d.body || '', tag: d.tag || 'fanusum', renotify: true,
      icon: scope + 'icons/icon-192.png', badge: scope + 'icons/icon-192.png',
      data: { url: d.url || scope }
    });
    const list = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    list.forEach(c => c.postMessage({ type: 'push', kind: d.tag }));
  })());
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || self.registration.scope;
  e.waitUntil((async () => {
    const list = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of list) { if ('focus' in c) { c.postMessage({ type: 'push' }); return c.focus(); } }
    return self.clients.openWindow(url);
  })());
});
