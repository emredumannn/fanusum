// Fanusum · bildirim + mesaj sunucusu (Supabase Edge Function)
// Supabase > Edge Functions > Deploy a new function > Via Editor
// Fonksiyon adı: fanus   ·   "Verify JWT" / "Enforce JWT verification": KAPALI
// Güvenlik: cihaz anahtarı (uygulama), admin anahtarı (Emre sayfası), cron anahtarı (zamanlayıcı)
import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });

// ------------------------------------------------------------------ Web Push (RFC 8291 + 8292)
const enc = new TextEncoder();
const b64uEnc = (buf: ArrayBuffer | Uint8Array) => {
  const b = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = ''; for (const x of b) s += String.fromCharCode(x);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};
const b64uDec = (str: string) => {
  let s = str.replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '=';
  return Uint8Array.from(atob(s), c => c.charCodeAt(0));
};
const concat = (...parts: Uint8Array[]) => {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let o = 0; for (const p of parts) { out.set(p, o); o += p.length; }
  return out;
};
async function hkdf(salt: Uint8Array, ikm: Uint8Array, info: Uint8Array, len: number) {
  const key = await crypto.subtle.importKey('raw', ikm, 'HKDF', false, ['deriveBits']);
  return new Uint8Array(await crypto.subtle.deriveBits({ name: 'HKDF', hash: 'SHA-256', salt, info }, key, len * 8));
}
type Cfg = { vapid_public: string; vapid_private: string; vapid_subject: string; admin_secret: string; cron_secret: string; site_url: string; sender_name: string };
type Dev = { id: string; device_key: string; endpoint: string | null; p256dh: string | null; auth: string | null; prefs: any; state: any };

async function vapidHeader(endpoint: string, cfg: Cfg) {
  const head = b64uEnc(enc.encode(JSON.stringify({ typ: 'JWT', alg: 'ES256' })));
  const body = b64uEnc(enc.encode(JSON.stringify({ aud: new URL(endpoint).origin, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: cfg.vapid_subject })));
  const pub = b64uDec(cfg.vapid_public);
  const key = await crypto.subtle.importKey('jwk', {
    kty: 'EC', crv: 'P-256', d: cfg.vapid_private, x: b64uEnc(pub.slice(1, 33)), y: b64uEnc(pub.slice(33, 65)), ext: true,
  }, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, key, enc.encode(`${head}.${body}`));
  return `vapid t=${head}.${body}.${b64uEnc(sig)}, k=${cfg.vapid_public}`;
}
async function encrypt(p256dh: string, auth: string, text: string) {
  const uaPub = b64uDec(p256dh), authSecret = b64uDec(auth);
  const local = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']) as CryptoKeyPair;
  const asPub = new Uint8Array(await crypto.subtle.exportKey('raw', local.publicKey));
  const uaKey = await crypto.subtle.importKey('raw', uaPub, { name: 'ECDH', namedCurve: 'P-256' }, false, []);
  const shared = new Uint8Array(await crypto.subtle.deriveBits({ name: 'ECDH', public: uaKey }, local.privateKey, 256));
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const ikm = await hkdf(authSecret, shared, concat(enc.encode('WebPush: info'), new Uint8Array([0]), uaPub, asPub), 32);
  const cek = await hkdf(salt, ikm, concat(enc.encode('Content-Encoding: aes128gcm'), new Uint8Array([0])), 16);
  const nonce = await hkdf(salt, ikm, concat(enc.encode('Content-Encoding: nonce'), new Uint8Array([0])), 12);
  const aes = await crypto.subtle.importKey('raw', cek, 'AES-GCM', false, ['encrypt']);
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce }, aes, concat(enc.encode(text), new Uint8Array([2]))));
  return concat(salt, new Uint8Array([0, 0, 16, 0]), new Uint8Array([asPub.length]), asPub, ct);
}
async function send(dev: Dev, cfg: Cfg, msg: { title: string; body: string; tag: string }) {
  if (!dev.endpoint || !dev.p256dh || !dev.auth) return { skipped: 'no subscription' };
  try {
    const res = await fetch(dev.endpoint, {
      method: 'POST',
      headers: { 'Content-Encoding': 'aes128gcm', 'Content-Type': 'application/octet-stream', TTL: '43200', Urgency: 'high', Authorization: await vapidHeader(dev.endpoint, cfg) },
      body: await encrypt(dev.p256dh, dev.auth, JSON.stringify({ ...msg, url: cfg.site_url })),
    });
    if (res.status === 404 || res.status === 410) await db.from('fanus_devices').update({ endpoint: null, p256dh: null, auth: null }).eq('id', dev.id);
    return { status: res.status, text: res.ok ? '' : (await res.text()).slice(0, 160) };
  } catch (e) { return { error: String(e) }; }
}

// ------------------------------------------------------------------ zaman (Türkiye, UTC+3)
function trNow() {
  const d = new Date(Date.now() + 3 * 3600e3);
  const day = d.toISOString().slice(0, 10), mins = d.getUTCHours() * 60 + d.getUTCMinutes();
  const md = day.slice(5);
  return { day, mins, md };
}
const toMin = (hhmm: string) => { const [h, m] = String(hhmm || '').split(':').map(Number); return (h || 0) * 60 + (m || 0); };
const pickOne = <T>(a: T[]) => a[Math.floor(Math.random() * a.length)];

// hatırlatma metinleri (balığın ağzından)
const FEED1 = ['Günaydın! Karnım zil çalıyor 🥺', 'Kahvaltı saati geldi, ben hazırım 🍤', 'Psst… yem saati 👀', 'Midem guruldadı, duydun mu? 🫠'];
const FEED2 = ['Akşam yemeği saati 🌆', 'Bugünün son öğünü beni bekliyor 🍤', 'Akşam oldu, biraz yem? 🥺', 'Gece olmadan bir lokma? 🌙'];
const WATER = ['Bugün su değişim günü 💧', 'Suyum biraz bulanıklaştı, temizlik zamanı 🫧', 'Bugün spa günüm, su değişsin mi? 🧖'];
const BUBBLE = ['Fanusta yeni bir kabarcık var 💌', 'Bugünün kabarcığı hazır, içinde bir not var 💌', 'Bir kabarcık seni bekliyor 🫧'];

// ------------------------------------------------------------------ istek
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'content-type, apikey, authorization, x-client-info', 'Access-Control-Allow-Methods': 'POST, OPTIONS' };
const json = (o: unknown, status = 200) => new Response(JSON.stringify(o), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'method' }, 405);
  const { data: cfg } = await db.from('fanus_config').select('*').eq('id', 1).maybeSingle() as { data: Cfg | null };
  if (!cfg) return json({ error: 'Sunucu kurulmamış' }, 500);
  let b: any = {};
  try { b = await req.json(); } catch { return json({ error: 'json' }, 400); }
  const action = String(b.action || '');

  // ---------- uygulama (cihaz anahtarı ile)
  if (['sync', 'test'].includes(action)) {
    const key = String(b.device_key || '');
    if (key.length < 16 || key.length > 80) return json({ error: 'cihaz' }, 400);

    if (action === 'sync') {
      const row: Record<string, unknown> = { device_key: key, updated_at: new Date().toISOString() };
      if (b.state && typeof b.state === 'object') row.state = b.state;
      if (b.prefs && typeof b.prefs === 'object') row.prefs = b.prefs;
      if (b.sub && b.sub.endpoint && b.sub.keys) { row.endpoint = String(b.sub.endpoint); row.p256dh = String(b.sub.keys.p256dh); row.auth = String(b.sub.keys.auth); }
      if (b.unsubscribe) { row.endpoint = null; row.p256dh = null; row.auth = null; }
      const { data: saved, error } = await db.from('fanus_devices').upsert(row, { onConflict: 'device_key' }).select('id, approved').single();
      if (error) return json({ error: error.message }, 500);
      // mesajlar sadece onaylı telefona gider; hiç onaylı telefon yoksa ilk gelen onaylanır
      let approved = saved.approved;
      if (!approved) {
        const { count } = await db.from('fanus_devices').select('id', { count: 'exact', head: true }).eq('approved', true);
        if (!count) { await db.from('fanus_devices').update({ approved: true }).eq('id', saved.id); approved = true; }
      }
      if (!approved) return json({ ok: true, messages: [], approved: false });
      const since = Number(b.since) || 0;
      const { data: messages } = await db.from('fanus_messages').select('id, text, created_at').gt('id', since).order('id').limit(50);
      return json({ ok: true, messages: messages ?? [] });
    }
    // test
    const { data: dev } = await db.from('fanus_devices').select('*').eq('device_key', key).maybeSingle();
    if (!dev) return json({ error: 'cihaz bulunamadı' }, 404);
    const r = await send(dev as Dev, cfg, { title: (dev.state?.name || 'Balığın') + ' 🫧', body: 'Bildirimler çalışıyor! Artık seni haber vererek çağıracağım 💙', tag: 'test' });
    return json({ sent: 'status' in r && (r.status as number) < 300, r });
  }

  // ---------- Emre'nin sayfası (admin anahtarı ile)
  if (['admin_status', 'admin_send', 'admin_delete', 'admin_device'].includes(action)) {
    if (!cfg.admin_secret || b.secret !== cfg.admin_secret) return json({ error: 'Anahtar yanlış' }, 403);
    if (action === 'admin_send') {
      const text = String(b.text || '').trim().slice(0, 300);
      if (!text) return json({ error: 'Mesaj boş' }, 400);
      const { data: m, error } = await db.from('fanus_messages').insert({ text }).select('id, text, created_at').single();
      if (error) return json({ error: error.message }, 500);
      const { data: devs } = await db.from('fanus_devices').select('*').eq('approved', true).not('endpoint', 'is', null);
      const results = await Promise.all((devs ?? []).filter((d: Dev) => d.prefs?.on !== false).map((d: Dev) =>
        send(d, cfg, { title: `${cfg.sender_name || 'Emre'}'den bir kabarcık 💛`, body: text.length > 120 ? text.slice(0, 119) + '…' : text, tag: 'msg-' + m.id })));
      return json({ ok: true, message: m, pushed: results.filter((r: any) => r.status && r.status < 300).length });
    }
    if (action === 'admin_delete') {
      await db.from('fanus_messages').delete().eq('id', Number(b.id));
      return json({ ok: true });
    }
    if (action === 'admin_device') {
      if (b.remove) await db.from('fanus_devices').delete().eq('id', String(b.id));
      else await db.from('fanus_devices').update({ approved: !!b.approved }).eq('id', String(b.id));
      return json({ ok: true });
    }
    const { data: devs } = await db.from('fanus_devices').select('id, approved, state, prefs, endpoint, updated_at').order('updated_at', { ascending: false });
    const { data: msgs } = await db.from('fanus_messages').select('id, text, created_at').order('id', { ascending: false }).limit(30);
    return json({ devices: (devs ?? []).map((d: any) => ({ id: d.id, approved: d.approved, state: d.state, notif: !!d.endpoint && d.prefs?.on !== false, updated_at: d.updated_at })), messages: msgs ?? [] });
  }

  // ---------- zamanlayıcı (her 5 dakikada bir pg_cron çağırır)
  if (action === 'tick') {
    if (!cfg.cron_secret || b.secret !== cfg.cron_secret) return json({ error: 'forbidden' }, 403);
    const { day, mins, md } = trNow();
    const { data: devs } = await db.from('fanus_devices').select('*').not('endpoint', 'is', null);
    const out: unknown[] = [];
    for (const d of (devs ?? []) as Dev[]) {
      const p = d.prefs || {}, s = d.state || {};
      if (p.on === false) continue;
      const due: { kind: string; title: string; body: string }[] = [];
      const inWin = (t: string) => { const m = toMin(t); return mins >= m && mins < m + 30; };
      const name = s.name || 'Balığın';
      const feeds = s.feedDay === day ? Number(s.feedsToday) || 0 : 0;
      const feedTimes: string[] = Array.isArray(p.feed) ? p.feed : ['10:00', '19:00'];
      if (p.feedOn !== false) feedTimes.forEach((t, i) => { if (inWin(t) && feeds <= i) due.push({ kind: 'feed' + i, title: name, body: pickOne(i ? FEED2 : FEED1) }); });
      if (p.waterOn !== false && s.waterDue && s.waterDue <= day && inWin(p.water || '12:00')) due.push({ kind: 'water', title: name, body: pickOne(WATER) });
      if (p.bubbleOn !== false && s.bubbleDay !== day && inWin(p.bubble || '09:00')) due.push({ kind: 'bubble', title: name, body: pickOne(BUBBLE) });
      if (s.birthday && s.birthday === md && inWin('09:30')) due.push({ kind: 'bday', title: 'İyi ki doğdun! 🎂', body: `${name} senin için fanusu süsledi, gel bak 🎉` });
      for (const m of due) {
        // aynı gün aynı tür bir kez
        const { error } = await db.from('fanus_sent').insert({ device_id: d.id, day, kind: m.kind });
        if (error) continue; // zaten gönderilmiş
        out.push(await send(d, cfg, { title: m.title, body: m.body, tag: m.kind }));
      }
    }
    // eski kayıtları temizle
    await db.from('fanus_sent').delete().lt('day', new Date(Date.now() - 14 * 864e5).toISOString().slice(0, 10));
    return json({ ok: true, sent: out.length });
  }

  return json({ error: 'bilinmeyen işlem' }, 400);
});
