/* Fanusum 🫧 — bir beta balığı için küçük, tatlı bir uygulama */
(() => {
'use strict';

/* ---------- yardımcılar ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const KEY = 'fanusum-v1';
const HOUR = 36e5, DAY = 864e5;
const pad = n => String(n).padStart(2, '0');
const dk = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const dayStart = (t = Date.now()) => { const d = new Date(t); return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime(); };
const parseDk = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d).getTime(); };
const daysBetween = (a, b) => Math.round((dayStart(b) - dayStart(a)) / DAY);
const rand = (a, b) => a + Math.random() * (b - a);
const pick = a => a[Math.floor(Math.random() * a.length)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const today = () => dk();
const AYLAR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
const fmtDate = s => { const d = new Date(parseDk(s)); return `${d.getDate()} ${AYLAR[d.getMonth()]} ${d.getFullYear()}`; };

const NOTES = Array.isArray(window.SECRET_NOTES) ? window.SECRET_NOTES : [];
const GIFTS = (Array.isArray(window.GIFTS) ? window.GIFTS : []).slice().sort((a, b) => a.day - b.day);
const FROM_TEXT = window.FROM_TEXT || '';
const NOTE_SIGN = window.NOTE_SIGN || '';

/* ---------- sabitler ---------- */
const COLORS = [
  ['Kırmızı', '#d7263d'], ['Kraliyet mavisi', '#2448c9'], ['Mor', '#7b2fbf'], ['Turkuaz', '#13a6a6'],
  ['Pembe', '#ff6fa8'], ['Turuncu', '#ff7b25'], ['Sarı', '#f4c430'], ['Beyaz', '#f3efe6'],
  ['Siyah', '#2b2b36'], ['Yeşil', '#2e9e5b'], ['Lacivert', '#1b2a6b'], ['Bordo', '#7d1830']
];
const TAILS = [['halfmoon', 'Yarım ay'], ['veil', 'Duvak'], ['crowntail', 'Taç'], ['plakat', 'Kısa']];
const THEMES = {
  okyanus: { n: 'Okyanus', water: ['#d2f0f6', '#5aaed0'], bg: '#f7f2ec' },
  pembe:   { n: 'Pembe',   water: ['#fde6ee', '#e79ab6'], bg: '#fbf1f1' },
  mercan:  { n: 'Mercan',  water: ['#e3f5ef', '#6cc2b8'], bg: '#fbf2ea' },
  gece:    { n: 'Gece',    water: ['#4d6fae', '#1a2b5c'], bg: '#141a2b' }
};
const MOODS = [['😊', 'Neşeli'], ['😴', 'Tembel'], ['🫧', 'Köpük yuvası'], ['🍽️', 'İştahlı'], ['🤩', 'Süslü'], ['🥺', 'Durgun']];
const SHOP = [
  { id: 'tas',     e: '🪨', n: 'Taş',          c: 15,  x: -0.48, s: 0.22 },
  { id: 'marimo',  e: '',   n: 'Yosun topu',   c: 25,  x: 0.47,  s: 0.15 },
  { id: 'kabuk',   e: '🐚', n: 'Deniz kabuğu', c: 30,  x: -0.14, s: 0.17 },
  { id: 'bitki',   e: '🌿', n: 'Su bitkisi',   c: 40,  x: -0.62, s: 0.42 },
  { id: 'yildiz',  e: '⭐', n: 'Deniz yıldızı', c: 45, x: 0.2,   s: 0.15 },
  { id: 'mercan',  e: '🪸', n: 'Mercan',       c: 60,  x: 0.62,  s: 0.34 },
  { id: 'nilufer', e: '🪷', n: 'Nilüfer',      c: 70,  x: 0.28,  s: 0.2, float: true },
  { id: 'ananas',  e: '🍍', n: 'Ananas ev',    c: 90,  x: -0.36, s: 0.36 },
  { id: 'kale',    e: '🏰', n: 'Kale',         c: 120, x: 0.36,  s: 0.4 },
  { id: 'hazine',  e: '💎', n: 'Hazine',       c: 150, x: 0.02,  s: 0.17 }
];
const MILESTONES = [1, 7, 14, 30, 50, 100, 150, 200, 250, 300, 365, 500, 730, 1000];

const DAILY = [
  'Günaydın! Bugün de seninle olmak çok güzel 🫧',
  'Bugün çok güzel görünüyorsun, camdan bile belli 💗',
  'Blub blub… bu balıkça "seni seviyorum" demek 🐟',
  'Sana bakınca yüzgeçlerim kendiliğinden açılıyor ✨',
  'Bugün sana bir köpük yuvası yapsam mı? 🫧',
  'Sen gelince fanus aydınlanıyor ☀️',
  'En sevdiğim insan sensin, bunu bil 🥹',
  'Su güzel, yem güzel, sen daha da güzelsin 💕',
  'Seninle aynı odada yüzmek bir ayrıcalık 👑',
  'Bugün harika bir gün olacak, hissediyorum 🌈',
  'Biraz yüzdüm, biraz düşündüm… hep seni düşündüm 💭',
  'Yüzgeçlerimi senin için taradım 💅',
  'Beni bu kadar güzel baktığın için teşekkür ederim 🤍',
  'Bugün de benim kahramanımsın 🦸‍♀️'
];
// dokunma — {ad}, {gun}, {seri} yer tutucuları doldurulur
const TAP = [
  'Blub! 🫧', 'Hı? Beni mi çağırdın? 👀', 'Merhaba güzellik 💗', 'Yüzgeç selamı 👋', 'Bugün kendimi çok süslü hissediyorum ✨',
  'Seni gördüm, mutlu oldum 💙', 'Fotoğrafımı çekecek misin? 📸', 'Ben buradayım, merak etme 🐟', 'Pıt pıt pıt 🫧',
  'Sen en iyisisin 🏆', 'Camın öbür tarafında en sevdiğim yüz 🥹', 'Bana bakınca kalbim pıt pıt ediyor 💓',
  'Şşş, bir sır vereyim: seni çok seviyorum 🤫', 'Az önce bir kabarcığı kovaladım, kazandım 💪', 'Bugün çok mu güzelsin yoksa bana mı öyle geliyor? 😳',
  'Yüzgeçlerim yeni yıkandı, bak ne parlak ✨', 'Ben {ad}! Fanusun en yakışıklısı 😎', '{ad} rapor veriyor: her şey yolunda 🫡',
  'Seninle {gun}. günümüz, iyi ki varsın 💙', 'Biliyor musun, betalar sahiplerini tanır. Ben seni tanıdım 👀',
  'Bir dans edelim mi? 💃', 'Bugünkü planım: yüzmek, yemek, sana bakmak 📋', 'Hey, sana bir kabarcık üfledim 🫧',
  'Parmağın çok sıcak görünüyor ☀️', 'Kuyruğuma bak, senin için açtım 🌸', 'Biraz ilgi iyi geldi, teşekkürler 🥰',
  'Dünyanın en şanslı balığı benim 🍀', 'Ben küçüğüm ama sevgim kocaman 💞'
];
const TAP_MORNING = ['Günaydın ☀️ Kahvaltı ne zaman?', 'Sabah sabah sen, ne güzel başlangıç 🌤️', 'Uykumu aldım, enerjim tavan ⚡'];
const TAP_EVENING = ['Akşam oldu, bugün nasıldı? 🌆', 'Günün yorgunluğunu bana anlat 🫶', 'Akşam yemeği saati yaklaşıyor mu? 👀'];
const TAP_NIGHT = ['Psst… uyumamız lazım 🌙', 'Gece gece beni mi özledin? 🥹', 'Işıklar kapalı ama ben buradayım 💫'];
const TAP_HUNGRY = ['Dokunmak yerine yem versen? 👀', 'Bu dokunuşlar güzel ama karnım aç 🥺', 'İpucu: aşağıda "Yem ver" diye bir düğme var 🍤'];
const TAP_STREAK = ['{seri} gündür hiç aç kalmadım, sen bir harikasın 💙', '{seri} günlük seri! Gururluyum 🔥'];
// art arda dokunma: seviye seviye artar
const TAP_SPAM = [
  ['Gıdıklanıyorum 😆', 'Hihi, dur 🙈', 'Gıdık gıdık! 😂'],
  ['Tamam tamam, buradayım 😅', 'Bu kadar sevgi fazla 🥵', 'Başım dönüyor 😵‍💫'],
  ['Yeter ama! 😤', 'Bir mola, lütfen 🙏', 'Ben de yorulurum ama 😮‍💨'],
  ['Saklanıyorum, beni bulamazsın 🙈', 'Görmedin say 🫣', 'Bir süre yokum 🌚']
];
// fazla yem denemesi: her denemede daha komik
const FULL = [
  ['Doydum, teşekkürler 😊', 'Bugünlük bu kadar yeter 🙂'],
  ['Göbek yaptım bak 🫃', 'Gerçekten doydum 🙈'],
  ['Diyetteyim, ciddiyim 🥗', 'Bir lokma daha yersem patlarım 😵'],
  ['Bunu Emre\'ye söyleyeceğim 😤', 'Beni şişman balık yapmaya mı çalışıyorsun? 🐡'],
  ['Pes etmiyorsun ama ben de etmiyorum 😑', 'Yarın, söz. Bugün kapalıyız 🚫'],
  ['Mutfak kapandı 🔒', 'Şef izinde 🧑‍🍳💤', 'Sistem: Balık dolu. Lütfen yarın tekrar deneyin 🤖']
];
const HUNGRY = ['Acıktım 🥺', 'Karnım zil çalıyor 🔔', 'Yem? Yem? Yem? 👀', 'Beni unutmadın değil mi? 🥺', 'Midem gurulduyor, duydun mu? 🫠'];
const EAT = ['Mmm! 😋', 'Çok lezzetliydi 💕', 'Teşekkürler 🥰', 'Nefis! 🍤', 'Tam kıvamında 👌', 'Ellerine sağlık 💙'];
const SHAKE = ['Deprem mi oldu?! 😱', 'Hey! Başım döndü 😵‍💫', 'Sakin oool 🌊', 'Dalga yaptın! 🏄', 'Ben balığım, sörfçü değil 🏄‍♂️'];
const NIGHT = ['Zzz… uyuyordum 😴', 'Gece gece ne oldu? 🌙', 'Uykum var ama seni gördüm 💤'];
const MIRROR = [['Bu yakışıklı da kim?! 😤', 'Hey sen! Burası benim fanusum 😠', 'Yüzgeçlerime bak, korktun mu? 💪'], ['Aa… benmişim 😳', 'Tamam, ben gerçekten yakışıklıyım 😌', 'Kendime aşık oldum galiba 🥰']];

/* aynı cümleyi sık tekrarlamayan seçici */
const recentLines = [];
function fill(s) { return s.replace(/\{ad\}/g, S.fish ? S.fish.name : '').replace(/\{gun\}/g, dayCount()).replace(/\{seri\}/g, streak()); }
function fresh(list) {
  const pool = list.filter(l => !recentLines.includes(l));
  const l = pick(pool.length ? pool : list);
  recentLines.push(l); if (recentLines.length > 14) recentLines.shift();
  return fill(l);
}
function tapLine() {
  const h = new Date().getHours(), pool = [...TAP];
  if (h >= 6 && h < 11) pool.push(...TAP_MORNING, ...TAP_MORNING);
  if (h >= 18 && h < 23) pool.push(...TAP_EVENING, ...TAP_EVENING);
  if (h >= 23 || h < 6) pool.push(...TAP_NIGHT, ...TAP_NIGHT, ...TAP_NIGHT);
  if (isHungry()) pool.push(...TAP_HUNGRY, ...TAP_HUNGRY);
  if (streak() >= 3) pool.push(...TAP_STREAK);
  return fresh(pool);
}

/* ---------- durum ---------- */
const defaults = () => ({
  v: 1, fish: null, startDate: null, feeds: [], waters: [], points: 0,
  owned: [], placed: [], moods: {}, notesOpened: [], giftsOpened: [],
  lastBubbleDay: null, lastGreetDay: null, confettiDay: null,
  waterInterval: 4, theme: 'okyanus', motion: null, earned: {},
  // yeni
  sound: true, badges: {}, bestStreak: 0, mirrorUses: 0, photoCount: 0, nightOpen: false,
  birthday: window.HER_BIRTHDAY || '', deviceKey: null, lastMsgId: 0, inbox: [],
  notif: { on: false, feed: ['10:00', '19:00'], water: '12:00', bubble: '09:00', feedOn: true, waterOn: true, bubbleOn: true }
});
let S = load();
function load() {
  try { const r = JSON.parse(localStorage.getItem(KEY)); if (r && r.v) return Object.assign(defaults(), r); } catch (e) {}
  return defaults();
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { toast('Kaydedilemedi 😢'); }
}
function earned() { // günlük puan sınırları
  if (!S.earned || S.earned.d !== today()) S.earned = { d: today(), mood: false, photo: 0, bubble: false, overfeed: 0 };
  return S.earned;
}

const feedDays = () => new Set(S.feeds.map(t => dk(new Date(t))));
const feedsToday = () => S.feeds.filter(t => dk(new Date(t)) === today()).length;
const lastFeed = () => S.feeds.length ? S.feeds[S.feeds.length - 1] : 0;
const lastWater = () => S.waters.length ? S.waters[S.waters.length - 1] : (S.startDate ? parseDk(S.startDate) : Date.now());
const dayCount = () => S.startDate ? Math.max(1, daysBetween(parseDk(S.startDate), Date.now()) + 1) : 1;
const isMilestone = () => { const d = dayCount(); return MILESTONES.includes(d) || (d > 365 && d % 365 === 0); };
function streak() {
  const set = feedDays(); const d = new Date(dayStart()); let n = 0;
  if (!set.has(dk(d))) d.setDate(d.getDate() - 1);
  while (set.has(dk(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
function waterInfo() {
  const since = daysBetween(lastWater(), Date.now());
  return { since, left: S.waterInterval - since };
}
let wakeUntil = 0;
const isNight = () => { const h = new Date().getHours(); return (h >= 23 || h < 7) && Date.now() > wakeUntil; };
const isHungry = () => feedsToday() === 0 && new Date().getHours() >= 9;
function ago(t) {
  if (!t) return 'henüz yok';
  const m = Math.floor((Date.now() - t) / 6e4);
  if (m < 1) return 'az önce';
  if (m < 60) return `${m} dk önce`;
  const h = Math.floor(m / 60);
  if (h < 24 && dk(new Date(t)) === today()) return `${h} saat önce`;
  const d = daysBetween(t, Date.now());
  return d <= 1 ? 'dün' : `${d} gün önce`;
}

/* =========================================================
   FANUS SAHNESİ
   ========================================================= */
const cv = $('#bowl'), ctx = cv.getContext('2d');
let W = 0, H = 0, DPR = 1, G = null, gravelLayer = null;
const F = { x: 0, y: 0, vx: 0, vy: 0, facing: 1, tf: 1, t: 0, z: 1, zt: 1, mode: 'wander', target: null, idle: 0, modeUntil: 0, blushUntil: 0, flare: 0, anim: null };
let foods = [], bubbles = [], parts = [], big = null, speech = null, ripple = 0, cloudFade = 0;
let mirror = null, msgBub = null, tapTimes = [], seasonT = 0;

/* tepki animasyonları: zıpla, takla, kafa salla, şiş */
function react(type, dur = 0.9) { F.anim = { type, t: 0, dur }; }
function animState() {
  const a = F.anim; if (!a) return { dy: 0, rot: 0, puff: 0 };
  const p = clamp(a.t / a.dur, 0, 1), s = Math.sin(Math.PI * p);
  if (a.type === 'jump') return { dy: -s * G.fs * 0.35, rot: -s * 0.35, puff: 0 };
  if (a.type === 'spin') return { dy: -s * G.fs * 0.15, rot: p * Math.PI * 2, puff: 0 };
  if (a.type === 'shake') return { dy: 0, rot: Math.sin(p * Math.PI * 8) * 0.22 * (1 - p), puff: 0 };
  if (a.type === 'puff') return { dy: 0, rot: 0, puff: s };
  return { dy: 0, rot: 0, puff: 0 };
}
/* özel günler */
function season() {
  const d = new Date(), m = d.getMonth() + 1, day = d.getDate(), md = `${pad(m)}-${pad(day)}`;
  if (S.birthday && md === S.birthday) return 'birthday';
  if (md === '12-31' || md === '01-01') return 'newyear';
  if (md === '02-14') return 'valentine';
  if ((m === 12 && day >= 15) || m === 1 || m === 2) return 'winter';
  return null;
}
function hatFor() {
  const se = season();
  if (se === 'birthday') return 'crown';
  if (isMilestone()) return 'party';
  if (se === 'newyear') return 'santa';
  if (se === 'winter') return 'bere';
  return null;
}
const EMOJI_FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
const UI_FONT = 'Nunito,ui-rounded,-apple-system,system-ui,sans-serif';

function resize() {
  const wrap = cv.parentElement;
  const w0 = wrap.clientWidth, h0 = wrap.clientHeight;
  if (!w0 || !h0) return;
  W = w0; H = Math.max(220, h0);
  DPR = Math.min(3, window.devicePixelRatio || 1);
  cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
  cv.style.width = W + 'px'; cv.style.height = H + 'px';
  const R = Math.min(W * 0.47, H * 0.44);
  const cx = W / 2, cy = Math.max(H * 0.54, H - R * 1.1);
  G = { cx, cy, R, waterTop: cy - R * 0.6, rimY: cy - R * 0.8, fs: R * 0.66 };
  G.gravel = x => cy + R * 0.56 + Math.pow((x - cx) / R, 2) * R * 0.1;
  buildGravel();
  if (!F.x || !inWater(F.x, F.y, 0)) { F.x = cx; F.y = cy; }
}

// çakıl katmanı bir kez çizilir (performans için)
function buildGravel() {
  const { cx, cy, R } = G;
  const L = document.createElement('canvas'); L.width = Math.round(W * DPR); L.height = Math.round(H * DPR);
  const c = L.getContext('2d'); c.setTransform(DPR, 0, 0, DPR, 0, 0);
  c.save(); c.beginPath(); c.arc(cx, cy, R - 1, 0, Math.PI * 2); c.clip();
  const top = G.gravel(cx);
  c.beginPath(); c.moveTo(cx - R, G.gravel(cx - R));
  for (let x = cx - R; x <= cx + R; x += 5) c.lineTo(x, G.gravel(x));
  c.lineTo(cx + R, cy + R); c.lineTo(cx - R, cy + R); c.closePath();
  let g = c.createLinearGradient(0, top, 0, cy + R);
  g.addColorStop(0, '#d9c7b0'); g.addColorStop(0.35, '#e9dac6'); g.addColorStop(1, '#c9b294');
  c.fillStyle = g; c.fill();
  c.clip();
  const cols = ['#f1e4d3', '#e2cfb8', '#f7eee3', '#d4bfa5', '#f4dfe6', '#dcebef', '#ead8c6', '#c8b49c'];
  const peb = [];
  for (let i = 0; i < 420; i++) {
    const x = rand(cx - R, cx + R), y = rand(G.gravel(x) - R * 0.01, cy + R);
    const depth = clamp((y - top) / (cy + R - top), 0, 1);
    peb.push({ x, y, r: R * rand(0.018, 0.036) * (0.65 + depth * 0.6), c: pick(cols), a: rand(-0.6, 0.6) });
  }
  peb.sort((a, b) => a.y - b.y);
  for (const p of peb) {
    c.fillStyle = 'rgba(80,55,30,.16)';
    c.beginPath(); c.ellipse(p.x + p.r * 0.15, p.y + p.r * 0.45, p.r * 1.05, p.r * 0.55, p.a, 0, Math.PI * 2); c.fill();
    g = c.createRadialGradient(p.x - p.r * 0.35, p.y - p.r * 0.35, p.r * 0.1, p.x, p.y, p.r * 1.1);
    g.addColorStop(0, '#fffaf3'); g.addColorStop(0.35, p.c); g.addColorStop(1, tint(p.c.length === 7 ? p.c : '#d4bfa5', -0.22));
    c.fillStyle = g; c.beginPath(); c.ellipse(p.x, p.y, p.r, p.r * 0.74, p.a, 0, Math.PI * 2); c.fill();
  }
  // arka kenarda hafif sis (derinlik)
  g = c.createLinearGradient(0, top - R * 0.05, 0, top + R * 0.16);
  g.addColorStop(0, 'rgba(120,170,200,.35)'); g.addColorStop(1, 'rgba(120,170,200,0)');
  c.fillStyle = g; c.fillRect(cx - R, top - R * 0.1, R * 2, R * 0.3);
  c.restore();
  gravelLayer = L;
}
function inWater(x, y, m) {
  const { cx, cy, R } = G;
  return Math.hypot(x - cx, y - cy) < R - m && y > G.waterTop + m && y < G.gravel(x) - m * 0.5;
}
function randTarget() {
  for (let i = 0; i < 40; i++) {
    const x = rand(G.cx - G.R, G.cx + G.R), y = rand(G.waterTop, G.cy + G.R);
    if (inWater(x, y, G.fs * 0.42)) return { x, y };
  }
  return { x: G.cx, y: G.cy };
}
function say(text, ms = 3500) { speech = { text, until: Date.now() + ms }; }
function addPart(p) { parts.push(Object.assign({ vx: 0, vy: 0, life: 0, max: 1.5, size: 16 }, p)); }
function burst(n, fn) { for (let i = 0; i < n; i++) addPart(fn(i)); }
function wake(ms = 45000) { if (isNight()) say(pick(NIGHT), 3000); wakeUntil = Date.now() + ms; }

function dropFood(n) {
  for (let i = 0; i < n; i++) {
    foods.push({ x: G.cx + rand(-G.R * 0.35, G.R * 0.35), y: G.rimY - rand(10, 50), age: 0, ph: rand(0, 6), eaten: false });
  }
}
function confetti(n = 120) {
  const cols = ['#ff5fa2', '#ffcf3f', '#4fc3f7', '#7ed957', '#b388ff', '#ff8a50'];
  burst(n, () => ({ kind: 'conf', x: rand(0, W), y: rand(-H * 0.6, 0), vx: rand(-20, 20), vy: rand(60, 140), max: rand(3, 5.5), c: pick(cols), size: rand(5, 9), rot: rand(0, 6), vr: rand(-6, 6) }));
}
function sparkle() {
  burst(26, () => { const p = randTarget(); return { kind: 'txt', txt: '✨', x: p.x, y: p.y, vy: rand(-20, -6), max: rand(1.2, 2.4), size: rand(12, 22) }; });
}
function hearts(x, y) {
  burst(6, () => ({ kind: 'txt', txt: pick(['💗', '💕', '🫧', '💙']), x: x + rand(-20, 20), y: y - rand(0, 20), vx: rand(-15, 15), vy: rand(-60, -30), max: rand(1, 1.8), size: rand(14, 22) }));
}
function shake() {
  ripple = 1;
  F.mode = 'startled'; F.target = randTarget(); F.modeUntil = Date.now() + 900;
  for (let i = 0; i < 14; i++) bubbles.push({ x: G.cx + rand(-G.R * 0.6, G.R * 0.6), y: G.gravel(G.cx) - rand(0, G.R * 0.3), r: rand(2, 6), vy: rand(40, 90), ph: rand(0, 6) });
  say(pick(SHAKE), 2500);
}
function pendingGift() {
  const d = dayCount();
  return GIFTS.find(g => g.day <= d && !S.giftsOpened.some(o => o.day === g.day)) || null;
}

/* --- güncelle --- */
function update(dt) {
  F.t += dt;
  const now = Date.now(), s = G.fs;
  const night = isNight();
  if (['startled', 'tap', 'hide', 'shy'].includes(F.mode) && now > F.modeUntil) {
    if (F.mode === 'hide') say(pick(['Buldun beni 🙈', 'Tamam, geri döndüm 😌', 'Özledin mi? 🥹']), 2500);
    F.mode = 'wander'; F.target = null;
  }
  if (F.anim) { F.anim.t += dt; if (F.anim.t > F.anim.dur) F.anim = null; }
  if (mirror && now > mirror.until) { mirror = null; say(pick(['Ayna nereye gitti? 🥺', 'Rakibim kaçtı 😏', 'Kazandım! 🏆']), 2500); }

  let tgt = null, maxSp = s * 0.55, flareT = 0;
  const active = foods.filter(f => !f.eaten && f.y > G.waterTop - 2);
  const dir = Math.sign(F.facing) || 1;
  const mouth = { x: F.x + dir * s * 0.26, y: F.y };

  if (F.mode === 'startled') { tgt = F.target; maxSp = s * 3.2; }
  else if (F.mode === 'hide') {
    // en yakın dekorun arkasına ya da köşeye saklan
    const d = S.placed.map(id => SHOP.find(i => i.id === id)).filter(i => i && !i.float).sort((a, b) => b.s - a.s)[0];
    const hx = d ? G.cx + d.x * G.R : G.cx - G.R * 0.55;
    tgt = { x: hx + (hx > G.cx ? s * 0.15 : -s * 0.15), y: G.gravel(hx) - s * 0.2 }; maxSp = s * 2.4; F.zt = 0.82;
  }
  else if (F.mode === 'shy') { tgt = F.target; maxSp = s * 2; }
  else if (mirror && !active.length) {
    tgt = { x: mirror.x - s * 0.42, y: mirror.y + Math.sin(F.t * 2) * s * 0.05 }; maxSp = s * 1.4; F.tf = 1;
    if (Math.hypot(tgt.x - F.x, tgt.y - F.y) < s * 0.4) {
      flareT = 1;
      if (!mirror.said1) { mirror.said1 = true; say(pick(MIRROR[0]), 3000); }
      else if (!mirror.said2 && now > mirror.start + 5200) { mirror.said2 = true; say(pick(MIRROR[1]), 3000); }
    }
  }
  else if (active.length) {
    let best = null, bd = 1e9;
    for (const f of active) { const d = Math.hypot(f.x - mouth.x, f.y - mouth.y); if (d < bd) { bd = d; best = f; } }
    const side = Math.sign(best.x - F.x) || dir;
    tgt = { x: best.x - side * s * 0.25, y: best.y }; maxSp = s * 1.5;
    if (bd < s * 0.14 || Math.hypot(best.x - F.x, best.y - F.y) < s * 0.12) {
      best.eaten = true;
      bubbles.push({ x: mouth.x, y: mouth.y - 4, r: 3, vy: 50, ph: 0 });
      Sfx.gulp();
      if (!foods.some(f => !f.eaten)) { F.blushUntil = now + 2500; if (Math.random() < 0.7) say(fresh(EAT), 2200); if (Math.random() < 0.4) react('spin', 1); }
    }
  }
  else if (F.mode === 'tap') { tgt = F.target; maxSp = s * 1.7; }
  else if (night) { const nx = G.cx - G.R * 0.3; tgt = { x: nx, y: G.gravel(nx) - s * 0.28 }; maxSp = s * 0.25; }
  else if (isHungry()) {
    tgt = { x: G.cx + Math.sin(F.t * 0.7) * G.R * 0.3, y: G.cy - G.R * 0.08 }; maxSp = s * 0.5;
    if ((!speech || now > speech.until) && Math.random() < dt * 0.25) say(pick(HUNGRY), 3000);
  }
  else {
    if (!F.target) F.target = randTarget();
    const d = Math.hypot(F.target.x - F.x, F.target.y - F.y);
    if (d < s * 0.15) { if (!F.idle) F.idle = now + rand(700, 3200); if (now > F.idle) { F.target = randTarget(); F.idle = 0; F.zt = rand(0.82, 1.08); } }
    else tgt = F.target;
  }

  let dvx = 0, dvy = 0;
  if (tgt) {
    const dx = tgt.x - F.x, dy = tgt.y - F.y, d = Math.hypot(dx, dy) || 1;
    const sp = maxSp * Math.min(1, d / (s * 0.45));
    dvx = dx / d * sp; dvy = dy / d * sp * 0.85;
  }
  const k = Math.min(1, dt * (F.mode === 'startled' ? 7 : 2.4));
  F.vx += (dvx - F.vx) * k; F.vy += (dvy - F.vy) * k;
  F.x += F.vx * dt; F.y += F.vy * dt;
  // sınırlar
  const { cx, cy, R } = G;
  const m = s * 0.38, dx = F.x - cx, dy = F.y - cy, dd = Math.hypot(dx, dy);
  if (dd > R - m) { F.x = cx + dx / dd * (R - m); F.y = cy + dy / dd * (R - m); }
  F.y = clamp(F.y, G.waterTop + s * 0.2, G.gravel(F.x) - s * 0.22);
  if (Math.abs(F.vx) > s * 0.12 && !(mirror && flareT)) F.tf = Math.sign(F.vx);
  F.facing += (F.tf - F.facing) * Math.min(1, dt * 3.6);
  if (F.mode !== 'wander' && F.mode !== 'hide' || foods.length) F.zt = 1.04; // yeme/çağrılınca öne gelir
  F.z += (F.zt - F.z) * Math.min(1, dt * 0.6);
  F.flare += (flareT - F.flare) * Math.min(1, dt * (flareT ? 2.5 : 1.5));

  // özel gün efektleri
  seasonT += dt;
  const se = season();
  if (se === 'winter' && Math.random() < dt * 6) addPart({ kind: 'snow', x: rand(0, W), y: -6, vx: rand(-8, 8), vy: rand(18, 34), max: H / 22, size: rand(1.5, 3.4) });
  if (se === 'valentine' && Math.random() < dt * 1.2) { const x = G.cx + rand(-G.R * 0.6, G.R * 0.6); addPart({ kind: 'txt', txt: pick(['💗', '💕', '❤️']), x, y: G.gravel(x) - 6, vx: rand(-6, 6), vy: rand(-30, -18), max: 4, size: rand(10, 16), inWater: true }); }
  if ((se === 'newyear' || se === 'birthday') && seasonT > 1.6) {
    seasonT = 0;
    const fx = rand(W * 0.15, W * 0.85), fy = rand(H * 0.05, G.rimY - 10), col = pick(['#ffcf3f', '#ff6fa8', '#7fd1f7', '#b388ff', '#7ed957']);
    burst(26, i => { const a = i / 26 * Math.PI * 2, v = rand(50, 80); return { kind: 'spark', x: fx, y: fy, vx: Math.cos(a) * v, vy: Math.sin(a) * v, max: rand(0.9, 1.3), c: col, size: 2.2 }; });
  }

  // Emre'den gelen mesaj kabarcığı (altın)
  const unread = S.inbox.find(m => !m.read);
  if (unread && !msgBub) msgBub = { id: unread.id, ph: rand(0, 6), r: G.R * 0.15, x: G.cx, y: G.cy };
  if (!unread) msgBub = null;
  if (msgBub) { msgBub.ph += dt; msgBub.x = G.cx - Math.sin(msgBub.ph * 0.3) * G.R * 0.4; msgBub.y = G.cy - G.R * 0.2 + Math.cos(msgBub.ph * 0.5) * G.R * 0.15; }

  // yemler
  for (const f of foods) {
    if (f.eaten) continue;
    f.age += dt;
    const gy = G.gravel(f.x) - 3;
    if (f.y < G.waterTop) f.y += s * 1.6 * dt;
    else if (f.y < gy) { f.y += s * 0.13 * dt; f.x += Math.sin(f.age * 2 + f.ph) * s * 0.04 * dt; }
    if (f.age > 45) f.eaten = true;
  }
  foods = foods.filter(f => !f.eaten);

  // kabarcıklar
  if (Math.random() < dt * 0.9) { const x = G.cx + rand(-R * 0.55, R * 0.55); bubbles.push({ x, y: G.gravel(x) - 4, r: rand(1.5, 4), vy: rand(25, 50), ph: rand(0, 6) }); }
  if (!night && Math.random() < dt * 0.15) bubbles.push({ x: mouth.x, y: mouth.y - 3, r: rand(1.5, 3), vy: 35, ph: 0 });
  for (const b of bubbles) { b.y -= b.vy * dt; b.ph += dt * 3; b.x += Math.sin(b.ph) * 8 * dt; }
  bubbles = bubbles.filter(b => b.y > G.waterTop + 2);

  // büyük not kabarcığı
  if (!big && S.fish && S.lastBubbleDay !== today()) big = { ph: rand(0, 6), r: R * 0.13, x: cx, y: cy, pop: 0 };
  if (big) { big.ph += dt; big.x = cx + Math.sin(big.ph * 0.35) * R * 0.42; big.y = cy - R * 0.12 + Math.sin(big.ph * 0.6) * R * 0.18; }

  // uyku zzz
  if (night && Math.random() < dt * 0.7) addPart({ kind: 'txt', txt: 'z', x: F.x + dir * s * 0.2, y: F.y - s * 0.12, vx: rand(4, 12), vy: -18, max: 2.2, size: rand(11, 17), color: true });

  // parçacıklar
  for (const p of parts) {
    p.life += dt; p.x += p.vx * dt; p.y += p.vy * dt;
    if (p.kind === 'conf') { p.rot += p.vr * dt; p.vx += Math.sin(p.life * 3) * 10 * dt; }
    if (p.kind === 'ring') p.size += 80 * dt;
    if (p.kind === 'snow') p.vx += Math.sin(p.life * 1.5 + p.size) * 6 * dt;
    if (p.kind === 'spark') { p.vy += 40 * dt; p.vx *= 1 - dt * 1.2; }
    if (p.inWater && p.y < G.waterTop + 4) p.life = p.max;
  }
  parts = parts.filter(p => p.life < p.max && p.y < H + 10);

  ripple *= Math.max(0, 1 - dt * 1.6);
  if (cloudFade > 0) cloudFade = Math.max(0, cloudFade - dt * 0.5);
  if (speech && now > speech.until) speech = null;
}

/* --- çiz --- */
function emoji(c, e, x, y, size, base = 'alphabetic') {
  c.font = `${size}px ${EMOJI_FONT}`; c.textAlign = 'center'; c.textBaseline = base; c.fillText(e, x, y);
}
function softShadow(c, x, y, rx, ry, a) {
  const g = c.createRadialGradient(x, y, 0, x, y, rx);
  g.addColorStop(0, `rgba(40,60,80,${a})`); g.addColorStop(1, 'rgba(40,60,80,0)');
  c.fillStyle = g; c.save(); c.translate(x, y); c.scale(1, ry / rx); c.translate(-x, -y);
  c.beginPath(); c.arc(x, y, rx, 0, Math.PI * 2); c.fill(); c.restore();
}

function draw() {
  const c = ctx, { cx, cy, R } = G, t = F.t;
  const th = THEMES[S.theme] || THEMES.okyanus;
  c.setTransform(DPR, 0, 0, DPR, 0, 0);
  c.clearRect(0, 0, W, H);
  const night = isNight();
  const halfW = y => Math.sqrt(Math.max(0, R * R - (y - cy) * (y - cy)));

  // masaya düşen gölge + renkli ışık
  softShadow(c, cx, cy + R * 0.985, R * 0.78, R * 0.09, 0.22);
  let g = c.createRadialGradient(cx, cy + R * 0.98, 0, cx, cy + R * 0.98, R * 0.5);
  g.addColorStop(0, rgba(th.water[1], 0.22)); g.addColorStop(1, rgba(th.water[1], 0));
  c.fillStyle = g; c.save(); c.translate(cx, cy + R * 0.98); c.scale(1, 0.12); c.beginPath(); c.arc(0, 0, R * 0.5, 0, Math.PI * 2); c.restore(); c.fill();

  c.save();
  c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.clip();

  // boş cam (su üstü)
  g = c.createLinearGradient(0, G.rimY, 0, G.waterTop);
  g.addColorStop(0, 'rgba(255,255,255,.18)'); g.addColorStop(1, 'rgba(255,255,255,.32)');
  c.fillStyle = g; c.fillRect(cx - R, G.rimY, R * 2, G.waterTop - G.rimY + 2);

  // su gövdesi
  const amp = R * 0.008 + ripple * R * 0.05;
  const wy = x => G.waterTop + Math.sin(x * 0.05 + t * 2) * amp + Math.sin(x * 0.13 - t * 3.1) * amp * 0.5;
  c.beginPath(); c.moveTo(cx - R, wy(cx - R));
  for (let x = cx - R; x <= cx + R + 4; x += 4) c.lineTo(x, wy(x));
  c.lineTo(cx + R, cy + R); c.lineTo(cx - R, cy + R); c.closePath();
  g = c.createRadialGradient(cx - R * 0.15, cy - R * 0.15, R * 0.1, cx, cy, R * 1.05);
  g.addColorStop(0, th.water[0]); g.addColorStop(0.75, th.water[1]); g.addColorStop(1, tint(th.water[1], -0.25));
  c.fillStyle = g; c.fill();
  c.save(); c.clip();

  // ışık huzmeleri
  for (let i = 0; i < 4; i++) {
    const x0 = cx - R * 0.75 + i * R * 0.45 + Math.sin(t * 0.25 + i * 1.7) * R * 0.1;
    g = c.createLinearGradient(0, G.waterTop, 0, cy + R * 0.7);
    g.addColorStop(0, 'rgba(255,255,255,.16)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = g;
    c.beginPath(); c.moveTo(x0, G.waterTop); c.lineTo(x0 + R * 0.1, G.waterTop); c.lineTo(x0 + R * 0.42, cy + R); c.lineTo(x0 + R * 0.16, cy + R); c.closePath(); c.fill();
  }

  // çakıl
  if (gravelLayer) c.drawImage(gravelLayer, 0, 0, W, H);
  // kostik ışık desenleri
  c.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 9; i++) {
    const px = cx + Math.sin(t * 0.4 + i * 2.3) * R * 0.62, py = G.gravel(px) + R * (0.05 + (i % 3) * 0.08);
    const rr = R * (0.06 + 0.03 * Math.sin(t * 1.3 + i));
    g = c.createRadialGradient(px, py, 0, px, py, rr);
    g.addColorStop(0, 'rgba(255,255,240,.13)'); g.addColorStop(1, 'rgba(255,255,240,0)');
    c.fillStyle = g; c.fillRect(px - rr, py - rr, rr * 2, rr * 2);
  }
  c.globalCompositeOperation = 'source-over';

  // balığın gölgesi
  if (S.fish) {
    const gy = G.gravel(F.x) + R * 0.05, hgt = clamp((gy - F.y) / R, 0, 1);
    softShadow(c, F.x, gy, G.fs * F.z * (0.42 + hgt * 0.15), G.fs * 0.05, 0.28 * (1 - hgt * 0.7));
  }

  // dekor
  for (const id of S.placed) {
    const d = SHOP.find(i => i.id === id); if (!d || d.float) continue;
    const x = cx + d.x * R, y = G.gravel(x) + R * 0.05, sz = d.s * R;
    softShadow(c, x, y - sz * 0.02, sz * 0.45, sz * 0.08, 0.3);
    if (id === 'marimo') {
      const mg = c.createRadialGradient(x - sz * 0.15, y - sz * 0.68, sz * 0.04, x, y - sz * 0.5, sz * 0.55);
      mg.addColorStop(0, '#a5e07c'); mg.addColorStop(0.65, '#2f7d32'); mg.addColorStop(1, '#1b4f20');
      c.fillStyle = mg; c.beginPath(); c.arc(x, y - sz * 0.5, sz * 0.5, 0, Math.PI * 2); c.fill();
    } else emoji(c, d.e, x, y, sz);
  }

  // hediye
  const gift = pendingGift();
  if (gift && S.fish) {
    const gx = cx + R * 0.1, bounce = Math.abs(Math.sin(t * 2.5)) * R * 0.04, gy = G.gravel(gx) + R * 0.03;
    softShadow(c, gx, gy, R * (0.09 - bounce / R), R * 0.018, 0.35);
    emoji(c, '🎁', gx, gy - bounce, R * 0.2);
    G.gift = { x: gx, y: gy - bounce - R * 0.1, r: R * 0.15 };
  } else G.gift = null;

  // yemler
  for (const f of foods) {
    const fr = Math.max(2.2, R * 0.015);
    g = c.createRadialGradient(f.x - fr * 0.3, f.y - fr * 0.3, 0, f.x, f.y, fr);
    g.addColorStop(0, '#e0995c'); g.addColorStop(1, '#8a4718');
    c.fillStyle = g; c.beginPath(); c.arc(f.x, f.y, fr, 0, Math.PI * 2); c.fill();
  }

  // doğum günü pastası
  if (season() === 'birthday') {
    const kx = cx - R * 0.2, ky = G.gravel(kx) + R * 0.04;
    softShadow(c, kx, ky, R * 0.1, R * 0.02, 0.3); emoji(c, '🎂', kx, ky, R * 0.2);
  }

  // balık
  if (S.fish) {
    const an = animState();
    drawFishAny(c, {
      x: F.x, y: F.y + Math.sin(F.t * 1.6) * G.fs * 0.02 + an.dy, s: G.fs * F.z, t: F.t, facing: F.facing,
      body: S.fish.body, fin: S.fish.fin || S.fish.body, tail: S.fish.tail,
      sleep: night && F.mode === 'wander' && !foods.length, hat: hatFor(), flare: F.flare, puff: an.puff,
      blush: Date.now() < F.blushUntil || season() === 'valentine', speed: 0.8 + Math.min(1.6, Math.hypot(F.vx, F.vy) / G.fs),
      tilt: clamp(F.vy / (G.fs * 3), -0.3, 0.3) * Math.sign(F.facing || 1) + an.rot
    });
    // uzaktayken suyun rengi balığı hafifçe örter (derinlik)
    if (F.z < 0.98) {
      c.globalAlpha = clamp((1 - F.z) * 1.6, 0, 0.3);
      c.fillStyle = th.water[1]; c.beginPath(); c.ellipse(F.x - Math.sign(F.facing || 1) * G.fs * 0.1, F.y, G.fs * 0.62, G.fs * 0.34, 0, 0, Math.PI * 2); c.fill();
      c.globalAlpha = 1;
    }
  }

  // kabarcıklar
  for (const b of bubbles) {
    g = c.createRadialGradient(b.x - b.r * 0.35, b.y - b.r * 0.35, 0, b.x, b.y, b.r);
    g.addColorStop(0, 'rgba(255,255,255,.9)'); g.addColorStop(0.5, 'rgba(255,255,255,.12)'); g.addColorStop(1, 'rgba(255,255,255,.55)');
    c.fillStyle = g; c.beginPath(); c.arc(b.x, b.y, b.r, 0, Math.PI * 2); c.fill();
  }

  // büyük not kabarcığı
  if (big) {
    const br = big.r * (1 + Math.sin(t * 2.2) * 0.03);
    g = c.createRadialGradient(big.x - br * 0.35, big.y - br * 0.4, br * 0.05, big.x, big.y, br);
    g.addColorStop(0, 'rgba(255,255,255,.95)'); g.addColorStop(0.45, 'rgba(255,235,248,.25)'); g.addColorStop(0.85, 'rgba(190,225,255,.35)'); g.addColorStop(1, 'rgba(255,255,255,.85)');
    c.fillStyle = g; c.beginPath(); c.arc(big.x, big.y, br, 0, Math.PI * 2); c.fill();
    // gökkuşağı yansıması
    c.strokeStyle = 'rgba(255,170,220,.45)'; c.lineWidth = br * 0.06;
    c.beginPath(); c.arc(big.x, big.y, br * 0.86, 0.2, 1.3); c.stroke();
    c.strokeStyle = 'rgba(140,220,255,.45)';
    c.beginPath(); c.arc(big.x, big.y, br * 0.86, 1.4, 2.2); c.stroke();
    c.fillStyle = 'rgba(255,255,255,.9)'; c.beginPath(); c.ellipse(big.x - br * 0.38, big.y - br * 0.42, br * 0.18, br * 0.1, -0.7, 0, Math.PI * 2); c.fill();
    c.globalAlpha = 0.92; emoji(c, '💌', big.x, big.y + br * 0.05, br * 0.85, 'middle'); c.globalAlpha = 1;
  }
  // Emre'den mesaj: altın kabarcık
  if (msgBub) {
    const br = msgBub.r * (1 + Math.sin(t * 3) * 0.05);
    g = c.createRadialGradient(msgBub.x - br * 0.35, msgBub.y - br * 0.4, br * 0.05, msgBub.x, msgBub.y, br * 1.6);
    g.addColorStop(0, 'rgba(255,236,170,.55)'); g.addColorStop(1, 'rgba(255,214,120,0)');
    c.fillStyle = g; c.beginPath(); c.arc(msgBub.x, msgBub.y, br * 1.6, 0, Math.PI * 2); c.fill();
    g = c.createRadialGradient(msgBub.x - br * 0.35, msgBub.y - br * 0.4, br * 0.05, msgBub.x, msgBub.y, br);
    g.addColorStop(0, 'rgba(255,255,255,.95)'); g.addColorStop(0.5, 'rgba(255,230,160,.35)'); g.addColorStop(1, 'rgba(240,190,80,.85)');
    c.fillStyle = g; c.beginPath(); c.arc(msgBub.x, msgBub.y, br, 0, Math.PI * 2); c.fill();
    c.fillStyle = 'rgba(255,255,255,.9)'; c.beginPath(); c.ellipse(msgBub.x - br * 0.38, msgBub.y - br * 0.42, br * 0.18, br * 0.1, -0.7, 0, Math.PI * 2); c.fill();
    emoji(c, '💛', msgBub.x, msgBub.y + br * 0.05, br * 0.8, 'middle');
  }

  // bulanık su
  const wi = waterInfo();
  const cloud = Math.max(clamp((-wi.left + 1) * 0.07, 0, 0.32), cloudFade * 0.3);
  if (S.fish && cloud > 0.01) { c.fillStyle = `rgba(150,160,105,${cloud})`; c.fillRect(cx - R, G.waterTop - 10, R * 2, R * 2); }

  c.restore(); // su klibi

  // su yüzeyi (perspektifli elips)
  const sw = halfW(G.waterTop), sry = sw * 0.11;
  c.save();
  c.beginPath();
  for (let i = 0; i <= 48; i++) {
    const a = i / 48 * Math.PI * 2, x = cx + Math.cos(a) * sw;
    const y = G.waterTop + Math.sin(a) * sry + Math.sin(x * 0.06 + t * 2.2) * amp * 0.8;
    i ? c.lineTo(x, y) : c.moveTo(x, y);
  }
  c.closePath();
  g = c.createLinearGradient(0, G.waterTop - sry, 0, G.waterTop + sry);
  g.addColorStop(0, rgba(th.water[0], 0.55)); g.addColorStop(1, 'rgba(255,255,255,.35)');
  c.fillStyle = g; c.fill();
  c.strokeStyle = 'rgba(255,255,255,.75)'; c.lineWidth = 1.4; c.stroke();
  c.restore();

  // köpük yuvası (günlükte seçildiyse)
  if (S.moods[today()] === '🫧') {
    if (!G.nest) { G.nest = []; for (let i = 0; i < 46; i++) { const a = rand(0, Math.PI * 2), r = Math.sqrt(Math.random()); G.nest.push({ dx: Math.cos(a) * r * sw * 0.32, dy: Math.sin(a) * r * sry * 0.9, r: rand(1.6, 4.2) }); } }
    const nx = cx - sw * 0.38;
    for (const b of G.nest) {
      const bx = nx + b.dx, by = G.waterTop + b.dy - b.r * 0.4;
      g = c.createRadialGradient(bx - b.r * 0.3, by - b.r * 0.3, 0, bx, by, b.r);
      g.addColorStop(0, 'rgba(255,255,255,.95)'); g.addColorStop(0.6, 'rgba(255,255,255,.25)'); g.addColorStop(1, 'rgba(255,255,255,.7)');
      c.fillStyle = g; c.beginPath(); c.arc(bx, by, b.r, 0, Math.PI * 2); c.fill();
    }
  }

  // nilüfer
  if (S.placed.includes('nilufer')) {
    const d = SHOP.find(i => i.id === 'nilufer'), x = cx + d.x * R + Math.sin(t * 0.5) * R * 0.04, y = G.waterTop + Math.sin(t * 1.2) * 1.5;
    c.fillStyle = '#5aa64a'; c.beginPath(); c.ellipse(x - R * 0.06, y + 2, R * 0.14, R * 0.03, 0, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#7cc46a'; c.beginPath(); c.ellipse(x - R * 0.06, y + 1, R * 0.12, R * 0.022, 0, 0, Math.PI * 2); c.fill();
    emoji(c, '🪷', x, y + R * 0.035, d.s * R);
  }

  if (night) {
    g = c.createRadialGradient(cx, cy - R * 0.2, R * 0.2, cx, cy, R);
    g.addColorStop(0, 'rgba(15,25,70,.28)'); g.addColorStop(1, 'rgba(8,14,45,.5)');
    c.fillStyle = g; c.fillRect(cx - R, cy - R, R * 2, R * 2);
  }
  c.restore(); // fanus klibi

  // --- cam ---
  // camın kalınlığı (kenarda kırılma)
  c.save(); c.beginPath(); c.rect(0, G.rimY, W, H); c.clip();
  g = c.createRadialGradient(cx, cy, R * 0.86, cx, cy, R);
  g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.75, 'rgba(255,255,255,.12)'); g.addColorStop(0.94, 'rgba(255,255,255,.38)'); g.addColorStop(1, 'rgba(140,185,215,.55)');
  c.fillStyle = g; c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.arc(cx, cy, R * 0.86, 0, Math.PI * 2, true); c.fill('evenodd');
  c.restore();
  const a0 = -Math.asin(0.8), a1 = Math.PI + Math.asin(0.8);
  c.lineCap = 'round';
  c.strokeStyle = 'rgba(110,160,195,.5)'; c.lineWidth = 1.5;
  c.beginPath(); c.arc(cx, cy, R, a0, a1); c.stroke();
  // ağız kenarı (kalın cam dudak)
  const rx = halfW(G.rimY), rry = rx * 0.12;
  c.lineWidth = 5; c.strokeStyle = 'rgba(150,195,220,.45)';
  c.beginPath(); c.ellipse(cx, G.rimY, rx, rry, 0, 0, Math.PI * 2); c.stroke();
  c.lineWidth = 2; c.strokeStyle = 'rgba(255,255,255,.95)';
  c.beginPath(); c.ellipse(cx, G.rimY, rx, rry, 0, 0, Math.PI); c.stroke();
  c.strokeStyle = 'rgba(255,255,255,.55)';
  c.beginPath(); c.ellipse(cx, G.rimY, rx, rry, 0, Math.PI, Math.PI * 2); c.stroke();
  // yansımalar
  g = c.createLinearGradient(cx - R, cy - R * 0.5, cx - R * 0.6, cy + R * 0.3);
  g.addColorStop(0, 'rgba(255,255,255,.75)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  c.strokeStyle = g; c.lineWidth = R * 0.055;
  c.beginPath(); c.arc(cx, cy, R * 0.85, Math.PI * 0.9, Math.PI * 1.18); c.stroke();
  c.lineWidth = R * 0.022; c.strokeStyle = 'rgba(255,255,255,.65)';
  c.beginPath(); c.arc(cx, cy, R * 0.85, Math.PI * 1.22, Math.PI * 1.26); c.stroke();
  c.strokeStyle = 'rgba(255,255,255,.22)'; c.lineWidth = R * 0.09;
  c.beginPath(); c.arc(cx, cy, R * 0.8, -Math.PI * 0.3, -Math.PI * 0.12); c.stroke();
  c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = R * 0.025;
  c.beginPath(); c.arc(cx, cy, R * 0.9, Math.PI * 0.15, Math.PI * 0.32); c.stroke();
  if (night) emoji(c, '🌙', cx + R * 0.88, cy - R * 0.86, R * 0.15, 'middle');

  // ayna
  if (mirror) {
    const now = Date.now(), inn = clamp((now - mirror.start) / 450, 0, 1), out = clamp((mirror.until - now) / 450, 0, 1);
    const k = Math.min(inn, out), e = 1 - Math.pow(1 - k, 3);
    const mw = mirror.w, mh = mirror.h, mx = mirror.x, my = mirror.y - mh / 2;
    c.save(); c.globalAlpha = e; c.translate(0, (1 - e) * R * 0.3);
    // sap
    g = c.createLinearGradient(mx + mw / 2 - 6, 0, mx + mw / 2 + 6, 0); g.addColorStop(0, '#e9b9a0'); g.addColorStop(0.5, '#fbe3d2'); g.addColorStop(1, '#c98d76');
    c.fillStyle = g; c.beginPath(); c.roundRect ? c.roundRect(mx + mw / 2 - 6, my + mh - 4, 12, mh * 0.42, 6) : c.rect(mx + mw / 2 - 6, my + mh - 4, 12, mh * 0.42); c.fill();
    // cam
    c.save(); c.beginPath(); c.ellipse(mx + mw / 2, my + mh / 2, mw / 2, mh / 2, 0, 0, Math.PI * 2); c.clip();
    g = c.createLinearGradient(mx, my, mx + mw, my + mh); g.addColorStop(0, '#eef6fb'); g.addColorStop(0.5, '#b9cfdd'); g.addColorStop(1, '#e3eef5');
    c.fillStyle = g; c.fillRect(mx, my, mw, mh);
    if (S.fish) {
      c.globalAlpha = e * 0.85;
      drawFish(c, { x: 2 * mx - F.x + mw * 0.1, y: F.y, s: G.fs * F.z * 0.92, t: F.t + 0.3, facing: -1, body: S.fish.body, fin: S.fish.fin || S.fish.body, tail: S.fish.tail, flare: F.flare, speed: 1, hat: hatFor() });
      c.globalAlpha = e;
    }
    c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.moveTo(mx, my + mh * 0.2); c.lineTo(mx + mw * 0.5, my); c.lineTo(mx + mw * 0.7, my); c.lineTo(mx, my + mh * 0.5); c.closePath(); c.fill();
    c.restore();
    // çerçeve
    g = c.createLinearGradient(mx, my, mx + mw, my + mh); g.addColorStop(0, '#f6d2bf'); g.addColorStop(0.5, '#d99a80'); g.addColorStop(1, '#f3c9b4');
    c.strokeStyle = g; c.lineWidth = 6; c.beginPath(); c.ellipse(mx + mw / 2, my + mh / 2, mw / 2, mh / 2, 0, 0, Math.PI * 2); c.stroke();
    c.restore();
  }

  // parçacıklar
  for (const p of parts) {
    const a = 1 - p.life / p.max;
    c.globalAlpha = clamp(a * 1.5, 0, 1);
    if (p.kind === 'conf') { c.save(); c.translate(p.x, p.y); c.rotate(p.rot); c.fillStyle = p.c; c.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2); c.restore(); }
    else if (p.kind === 'ring') { c.strokeStyle = 'rgba(255,255,255,.9)'; c.lineWidth = 2; c.beginPath(); c.arc(p.x, p.y, p.size, 0, Math.PI * 2); c.stroke(); }
    else if (p.kind === 'snow') { c.globalAlpha = 0.85; c.fillStyle = S.theme === 'gece' ? '#fff' : '#c9dce8'; c.beginPath(); c.arc(p.x, p.y, p.size, 0, Math.PI * 2); c.fill(); }
    else if (p.kind === 'spark') { c.fillStyle = p.c; c.beginPath(); c.arc(p.x, p.y, p.size, 0, Math.PI * 2); c.fill(); }
    else if (p.color) {
      c.font = `800 ${p.size}px ${UI_FONT}`; c.fillStyle = S.theme === 'gece' ? '#cfe0ff' : '#6d8db0';
      c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(p.txt, p.x, p.y);
    } else emoji(c, p.txt, p.x, p.y, p.size, 'middle');
  }
  c.globalAlpha = 1;

  if (speech && S.fish) drawSpeech(speech.text, F.x, F.y - G.fs * 0.34);
}

function drawSpeech(text, x, y) {
  const c = ctx, fs = clamp(W * 0.038, 13.5, 16), maxW = Math.min(W * 0.66, 260);
  c.font = `700 ${fs}px ${UI_FONT}`;
  const words = text.split(' '), lines = []; let cur = '';
  for (const w of words) { const tt = cur ? cur + ' ' + w : w; if (c.measureText(tt).width > maxW && cur) { lines.push(cur); cur = w; } else cur = tt; }
  if (cur) lines.push(cur);
  const age = speech ? clamp((speech.until - Date.now()) / 250, 0, 1) : 1;
  const lh = fs * 1.32, pw = 14, ph = 10;
  const bw = Math.max(...lines.map(l => c.measureText(l).width)) + pw * 2, bh = lines.length * lh + ph * 2;
  const bx = clamp(x - bw / 2, 6, W - bw - 6), by = clamp(y - bh - 12, 4, H - bh - 4);
  c.save();
  c.globalAlpha = age;
  c.shadowColor = 'rgba(40,50,70,.14)'; c.shadowBlur = 14; c.shadowOffsetY = 4;
  c.fillStyle = 'rgba(255,253,250,.97)';
  c.beginPath(); c.roundRect ? c.roundRect(bx, by, bw, bh, 18) : c.rect(bx, by, bw, bh); c.fill();
  const tx = clamp(x, bx + 20, bx + bw - 20);
  if (by + bh < y) { c.beginPath(); c.moveTo(tx - 7, by + bh - 1); c.quadraticCurveTo(tx, by + bh + 2, tx + 2, by + bh + 10); c.quadraticCurveTo(tx + 3, by + bh + 2, tx + 9, by + bh - 1); c.closePath(); c.fill(); }
  c.shadowColor = 'transparent';
  c.fillStyle = '#3a3440'; c.textAlign = 'center'; c.textBaseline = 'middle';
  lines.forEach((l, i) => c.fillText(l, bx + bw / 2, by + ph + lh * (i + 0.5)));
  c.restore();
}

/* --- döngü --- */
let lastT = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - lastT) / 1000); lastT = now;
  if (G && curPage === 'fanus' && !document.hidden) { update(dt); draw(); }
  requestAnimationFrame(frame);
}

/* --- dokunma --- */
cv.addEventListener('pointerdown', e => {
  if (!G || !S.fish) return;
  askMotion(true); Sfx.unlock();
  const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
  if (isNight()) { wake(); }
  if (msgBub && Math.hypot(x - msgBub.x, y - msgBub.y) < msgBub.r * 1.5) return openMessage(msgBub);
  if (big && Math.hypot(x - big.x, y - big.y) < big.r * 1.4) return popBig();
  if (G.gift && Math.hypot(x - G.gift.x, y - G.gift.y) < G.gift.r) return openGift();
  if (Math.hypot(x - F.x, y - F.y) < G.fs * 0.34) return tapFish();
  if (Math.hypot(x - G.cx, y - G.cy) < G.R) {
    Sfx.tap();
    addPart({ kind: 'ring', x, y, size: 4, max: 0.6 });
    const tx = clamp(x, G.cx - G.R, G.cx + G.R);
    F.mode = 'tap'; F.target = { x: tx, y: clamp(y, G.waterTop + G.fs * 0.2, G.gravel(tx) - G.fs * 0.22) }; F.modeUntil = Date.now() + 2600;
  }
});

/* --- sallama --- */
let lastShake = 0, motionOn = false;
function onMotion(e) {
  const a = e.acceleration;
  let m = 0;
  if (a && a.x != null) m = Math.hypot(a.x, a.y, a.z);
  else if (e.accelerationIncludingGravity) { const g = e.accelerationIncludingGravity; m = Math.abs(Math.hypot(g.x, g.y, g.z) - 9.8); }
  if (m > 13 && Date.now() - lastShake > 1500 && curPage === 'fanus' && S.fish) { lastShake = Date.now(); shake(); }
}
function enableMotion() { if (!motionOn) { window.addEventListener('devicemotion', onMotion); motionOn = true; } }
async function askMotion(silent) {
  if (typeof DeviceMotionEvent === 'undefined') return false;
  if (motionOn) return true;
  if (typeof DeviceMotionEvent.requestPermission === 'function') {
    if (silent && S.motion !== 'granted') return false;
    try { const r = await DeviceMotionEvent.requestPermission(); S.motion = r; save(); if (r === 'granted') { enableMotion(); return true; } } catch (e) {}
    return false;
  }
  enableMotion(); S.motion = 'granted'; return true;
}

/* =========================================================
   EYLEMLER
   ========================================================= */
function addPoints(n, label) { S.points += n; save(); toast(`+${n} kabarcık${label ? ' · ' + label : ''}`); updateHeader(); }

/* balığa dokunma: art arda dokunuldukça tepki büyür */
function tapFish() {
  const now = Date.now();
  tapTimes = tapTimes.filter(t => now - t < 3500); tapTimes.push(now);
  const n = tapTimes.length;
  hearts(F.x, F.y - G.fs * 0.1);
  if (n < 3) {
    Sfx.bloop(); say(tapLine(), 2600); F.blushUntil = now + 2000;
    if (Math.random() < 0.35) react(pick(['jump', 'spin', 'puff']), 0.9);
    return;
  }
  const lvl = Math.min(TAP_SPAM.length - 1, Math.floor((n - 3) / 2));
  say(fresh(TAP_SPAM[lvl]), 2600); Sfx.bloop(1 + lvl * 0.15);
  if (lvl === 0) { react('spin', 0.8); F.blushUntil = now + 2500; }
  else if (lvl === 1) { react('shake', 0.9); }
  else if (lvl === 2) { react('puff', 1.1); F.mode = 'shy'; F.target = randTarget(); F.modeUntil = now + 1800; }
  else { F.mode = 'hide'; F.modeUntil = now + 6000; tapTimes = []; }
}

function feed() {
  if (!S.fish) return;
  Sfx.unlock();
  if (isNight()) wake();
  const n = feedsToday();
  if (n >= 2) {
    const e = earned(); e.overfeed = (e.overfeed || 0) + 1; save();
    const lvl = Math.min(FULL.length - 1, e.overfeed - 1);
    say(fresh(FULL[lvl]), 3200); Sfx.nope();
    react(lvl < 2 ? 'shake' : lvl < 4 ? 'puff' : 'shake', 1);
    F.mode = 'shy'; F.target = { x: G.cx + (F.x < G.cx ? G.R * 0.45 : -G.R * 0.45), y: G.cy + G.R * 0.1 }; F.modeUntil = Date.now() + 1600;
    if (e.overfeed === 5) checkBadges();
    return;
  }
  S.feeds.push(Date.now());
  dropFood(4); Sfx.plop();
  save();
  addPoints(5, n === 0 ? 'günün ilk öğünü' : 'afiyet olsun');
  const st = streak();
  if (st > (S.bestStreak || 0)) { S.bestStreak = st; save(); }
  if (n === 0 && [3, 7, 14, 30, 60, 100].includes(st)) setTimeout(() => { toast(`${st} günlük seri!`); confetti(60); }, 1500);
  updateUI(); checkBadges(); syncSoon();
}

/* ayna oyunu */
function openMirror() {
  if (!S.fish || !G) return;
  Sfx.unlock();
  if (mirror) { mirror.until = Math.min(mirror.until, Date.now() + 450); return; }
  if (isNight()) wake();
  const R = G.R;
  mirror = { x: G.cx + R * 0.42, y: G.cy - R * 0.05, w: R * 0.5, h: R * 0.66, start: Date.now(), until: Date.now() + 11000 };
  S.mirrorUses = (S.mirrorUses || 0) + 1; save(); Sfx.chime(); setTimeout(checkBadges, 11800);
}

function waterChange() {
  if (!S.fish) return;
  const since = S.waters.length ? daysBetween(lastWater(), Date.now()) : 99;
  modal(`
    <div class="bigE">💧</div><h2>Suyu değiştirdin mi?</h2>
    <p class="muted center">Bir sonraki su değişimi için sayaç sıfırlanacak.</p>
    <div class="btns"><button class="btn ghost" data-close>Vazgeç</button><button class="btn" id="wYes">Evet, değiştirdim</button></div>`);
  $('#wYes').onclick = () => {
    S.waters.push(Date.now()); save(); closeModal();
    cloudFade = 1; sparkle(); ripple = 0.5; Sfx.splash();
    if (since >= 2) addPoints(20, 'pırıl pırıl su'); else toast('Su tertemiz ✨');
    setTimeout(() => { say(pick(['Ohh, tertemiz! ✨', 'Yepyeni su, yepyeni ben 💙', 'Teşekkürler, nefes aldım 🫧', 'Spa günü gibi oldu 🧖']), 3000); react('jump', 0.9); }, 600);
    updateUI(); checkBadges(); syncSoon();
  };
}

/* premium mektup kartı */
function letter(text, sign, extra = '') {
  return `<div class="letter"><div class="seal"></div><div class="ltext">${esc(text)}</div>${sign ? `<div class="lsign">${esc(sign)}</div>` : ''}${extra}</div>`;
}

function nextNote() {
  const t = today(), opened = new Set(S.notesOpened.filter(n => n.i != null).map(n => n.i));
  for (let i = 0; i < NOTES.length; i++) { const n = NOTES[i]; if (n && typeof n === 'object' && n.date && n.date <= t && !opened.has(i)) return { i, text: n.text }; }
  for (let i = 0; i < NOTES.length; i++) { const n = NOTES[i]; if (typeof n === 'string' && !opened.has(i)) return { i, text: n }; }
  return null;
}
function popBig() {
  burst(14, () => ({ kind: 'txt', txt: pick(['🫧', '✨', '💗']), x: big.x + rand(-10, 10), y: big.y + rand(-10, 10), vx: rand(-90, 90), vy: rand(-90, 60), max: rand(0.6, 1.1), size: rand(12, 20) }));
  big = null; S.lastBubbleDay = today(); Sfx.pop();
  const n = nextNote();
  if (n) S.notesOpened.push({ i: n.i, d: today(), text: n.text });
  else S.notesOpened.push({ i: null, d: today(), text: pick(DAILY), fish: true });
  save();
  const e = earned(); if (!e.bubble) { e.bubble = true; S.points += 5; save(); updateHeader(); }
  const text = n ? n.text : S.notesOpened[S.notesOpened.length - 1].text;
  setTimeout(() => modal(`
    <div class="eyebrow">${n ? 'Kabarcıktan bir not çıktı' : 'Balığından bir mesaj'}</div>
    ${n ? letter(text, NOTE_SIGN) : `<div class="msg">${esc(text)}</div>`}
    <p class="muted center" style="margin-top:14px">+5 kabarcık · yarın yenisi çıkacak</p>
    <div class="btns"><button class="btn" data-close>Kapat</button></div>`), 350);
  checkBadges(); syncSoon();
}
function openGift() {
  const g = pendingGift(); if (!g) return;
  S.giftsOpened.push({ day: g.day, d: today(), title: g.title, text: g.text, image: g.image || null });
  if (g.points) S.points += g.points;
  save(); updateHeader(); confetti(90); Sfx.chime();
  modal(`
    <div class="eyebrow">Hediye</div>
    <h2>${esc(g.title || 'Bir hediye!')}</h2>
    ${letter(g.text || '', NOTE_SIGN, g.image ? `<img class="full" src="${esc(g.image)}" alt="" style="margin-top:14px">` : '')}
    ${g.points ? `<p class="muted center" style="margin-top:14px">+${g.points} kabarcık hesabına eklendi</p>` : ''}
    <div class="btns"><button class="btn" data-close>Yaşasın!</button></div>`);
}
/* Emre'den gelen anlık mesaj */
function openMessage(b) {
  const m = S.inbox.find(x => x.id === b.id); if (!m) return;
  burst(18, () => ({ kind: 'txt', txt: pick(['💛', '✨', '💗']), x: b.x + rand(-10, 10), y: b.y + rand(-10, 10), vx: rand(-90, 90), vy: rand(-90, 60), max: rand(0.6, 1.2), size: rand(12, 20) }));
  m.read = true; msgBub = null; save(); Sfx.chime();
  setTimeout(() => modal(`
    <div class="eyebrow">Az önce geldi</div>
    ${letter(m.text, NOTE_SIGN)}
    <div class="btns"><button class="btn" data-close>Kapat</button></div>`), 300);
  checkBadges();
}

/* =========================================================
   ROZETLER
   ========================================================= */
const BADGES = [
  { id: 'ilk', e: '🍤', n: 'İlk öğün', d: 'Balığını ilk kez besle', ok: () => S.feeds.length >= 1 },
  { id: 'hafta', e: '🌱', n: 'İlk hafta', d: '7 gün birlikte', ok: () => dayCount() >= 7 },
  { id: 'ay', e: '🌙', n: 'Bir ay', d: '30 gün birlikte', ok: () => dayCount() >= 30 },
  { id: 'yuz', e: '💯', n: '100 gün', d: '100 gün birlikte', ok: () => dayCount() >= 100 },
  { id: 'seri7', e: '🔥', n: 'Hiç aksatmadı', d: '7 gün üst üste besle', ok: () => Math.max(S.bestStreak || 0, streak()) >= 7 },
  { id: 'seri30', e: '🏆', n: 'Efsane bakıcı', d: '30 gün üst üste besle', ok: () => Math.max(S.bestStreak || 0, streak()) >= 30 },
  { id: 'su', e: '💧', n: 'Pırıl pırıl', d: '5 kez su değiştir', ok: () => S.waters.length >= 5 },
  { id: 'dekor', e: '🏰', n: 'İç mimar', d: '3 dekor al', ok: () => S.owned.length >= 3 },
  { id: 'hepsi', e: '👑', n: 'Saray fanusu', d: 'Bütün dekorları topla', ok: () => S.owned.length >= SHOP.length },
  { id: 'foto', e: '📸', n: 'Fotoğrafçı', d: '5 fotoğraf ekle', ok: () => (S.photoCount || 0) >= 5 },
  { id: 'not', e: '💌', n: 'Kabarcık avcısı', d: '10 kabarcık patlat', ok: () => S.notesOpened.length >= 10 },
  { id: 'gunluk', e: '📔', n: 'Günlük yazarı', d: '7 gün ruh hâli seç', ok: () => Object.keys(S.moods).length >= 7 },
  { id: 'ayna', e: '🪞', n: 'Ayna ayna', d: 'Ayna oyununu oyna', ok: () => (S.mirrorUses || 0) >= 1 },
  { id: 'mesaj', e: '💛', n: 'Altın kabarcık', d: 'Emre\'den bir mesaj aç', ok: () => S.inbox.some(m => m.read) },
  { id: 'inat', e: '🐡', n: 'İnatçı', d: 'Doymuş balığa 5 kez yem vermeye çalış', ok: () => (earned().overfeed || 0) >= 5 },
  { id: 'gece', e: '🦉', n: 'Gece kuşu', d: 'Fanusa gece yarısından sonra uğra', ok: () => !!S.nightOpen }
];
function checkBadges() {
  if (!S.fish) return;
  const got = BADGES.filter(b => !S.badges[b.id] && b.ok());
  if (!got.length) return;
  got.forEach(b => { S.badges[b.id] = today(); });
  save();
  const b = got[0];
  setTimeout(() => {
    if (!$('#modal').classList.contains('hidden')) { toast(`Yeni rozet: ${b.n}`); return; }
    confetti(70); Sfx.chime();
    modal(`<div class="eyebrow">Yeni rozet</div><div class="medal big">${b.e}</div><h2>${esc(b.n)}</h2><p class="muted center">${esc(b.d)}</p>
      ${got.length > 1 ? `<p class="muted center">+${got.length - 1} rozet daha kazandın</p>` : ''}
      <div class="btns"><button class="btn" data-close>Harika</button></div>`);
  }, 1200);
}

/* =========================================================
   SUNUCU — bildirimler ve Emre'den gelen mesajlar
   ========================================================= */
const CFG = window.FANUS_CONFIG || {};
const pushSupported = () => 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
function devKey() {
  if (!S.deviceKey) { S.deviceKey = (crypto.randomUUID ? crypto.randomUUID() : 'd' + Date.now().toString(36) + Math.random().toString(36).slice(2)); save(); }
  return S.deviceKey;
}
function b64uToU8(s) { s = s.replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '='; return Uint8Array.from(atob(s), c => c.charCodeAt(0)); }
async function api(action, body = {}) {
  if (!CFG.fn) throw new Error('Sunucu ayarlanmamış');
  const ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const tm = ctl && setTimeout(() => ctl.abort(), 12000);
  try {
    const r = await fetch(CFG.fn, {
      method: 'POST', signal: ctl && ctl.signal,
      headers: { 'Content-Type': 'application/json', apikey: CFG.key || '' },
      body: JSON.stringify(Object.assign({ action, device_key: devKey() }, body))
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error || 'Sunucu hatası (' + r.status + ')');
    return j;
  } finally { if (tm) clearTimeout(tm); }
}
function pushState() {
  const wd = new Date(dayStart(lastWater())); wd.setDate(wd.getDate() + S.waterInterval);
  return {
    name: S.fish ? S.fish.name : null, body: S.fish ? S.fish.body : null,
    feedDay: lastFeed() ? dk(new Date(lastFeed())) : null, feedsToday: feedsToday(), lastFeed: lastFeed() || null,
    waterDue: dk(wd), lastWater: S.waters.length ? lastWater() : null, bubbleDay: S.lastBubbleDay,
    mood: S.moods[today()] || null, streak: streak(), day: dayCount(), points: S.points,
    birthday: S.birthday || null, badges: Object.keys(S.badges).length
  };
}
async function currentSub() {
  if (!pushSupported() || Notification.permission !== 'granted' || !S.notif.on) return null;
  try { const reg = await navigator.serviceWorker.ready; const sub = await reg.pushManager.getSubscription(); return sub ? sub.toJSON() : null; } catch (e) { return null; }
}
let syncT = 0, syncing = false;
function syncSoon(ms = 1500) { clearTimeout(syncT); syncT = setTimeout(sync, ms); }
async function sync() {
  if (!CFG.fn || !S.fish || syncing) return;
  syncing = true;
  try {
    const sub = await currentSub();
    const j = await api('sync', { state: pushState(), prefs: S.notif, sub, since: S.lastMsgId || 0, tz: 'Europe/Istanbul' });
    receive(j.messages || []);
  } catch (e) { /* çevrimdışı olabilir, sessizce geç */ }
  finally { syncing = false; }
}
function receive(list) {
  let got = 0;
  for (const m of list) {
    if (S.inbox.some(x => x.id === m.id)) continue;
    S.inbox.push({ id: m.id, text: m.text, at: m.created_at, read: false }); got++;
    S.lastMsgId = Math.max(S.lastMsgId || 0, m.id);
  }
  if (got) { save(); toast(got > 1 ? `${got} yeni mesajın var 💛` : 'Yeni bir mesajın var 💛'); if (curPage === 'notlar') renderNotes(); }
}
async function enableNotifications() {
  if (!pushSupported()) { toast(isIOS && !standalone ? 'Önce ana ekrana ekle, oradan aç' : 'Bu cihaz bildirim desteklemiyor'); return false; }
  try {
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') { toast('Bildirim izni verilmedi'); return false; }
    const reg = await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();
    if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64uToU8(CFG.vapid) });
    S.notif.on = true; save();
    await api('sync', { state: pushState(), prefs: S.notif, sub: sub.toJSON(), since: S.lastMsgId || 0, tz: 'Europe/Istanbul' });
    return true;
  } catch (e) { toast('Bildirim açılamadı: ' + e.message); return false; }
}
async function disableNotifications() {
  S.notif.on = false; save();
  try { const reg = await navigator.serviceWorker.ready; const sub = await reg.pushManager.getSubscription(); if (sub) await sub.unsubscribe(); } catch (e) { }
  try { await api('sync', { state: pushState(), prefs: S.notif, sub: null, unsubscribe: true }); } catch (e) { }
}
if ('serviceWorker' in navigator) navigator.serviceWorker.addEventListener('message', e => { if (e.data && e.data.type === 'push') syncSoon(300); });

/* =========================================================
   ARAYÜZ
   ========================================================= */
let curPage = 'fanus';
function showPage(p) {
  curPage = p;
  const pageEl = $('#p-' + p);
  $$('.page').forEach(el => el.classList.toggle('active', el === pageEl));
  pageEl.classList.remove('quiet');
  clearTimeout(pageEl._q); pageEl._q = setTimeout(() => pageEl.classList.add('quiet'), 900);
  const btns = $$('.tabs button'), idx = btns.findIndex(b => b.dataset.p === p);
  btns.forEach(b => b.classList.toggle('on', b.dataset.p === p));
  $('#tabInd').style.transform = `translateX(${idx * 100}%)`;
  if (p === 'fanus') { requestAnimationFrame(resize); updateUI(); }
  if (p === 'gunluk') renderJournal();
  if (p === 'dekor') renderShop();
  if (p === 'notlar') renderNotes();
  if (p === 'ayar') renderSettings();
}
$$('.tabs button').forEach(b => b.onclick = () => showPage(b.dataset.p));

function updateHeader() {
  if (!S.fish) return;
  $('#hName').textContent = S.fish.name;
  const d = dayCount();
  $('#hSub').textContent = `Birlikte ${d}. gün${isMilestone() ? ' · kutlama günü' : ''}`;
  setChip('#hStreak', streak());
  setChip('#hPoints', S.points);
}
function setChip(sel, v) {
  const el = $(sel), s = String(v);
  if (el.textContent === s) return;
  const first = el.textContent === '' || el.textContent === '0' && !el._set;
  el.textContent = s; el._set = true;
  if (first) return;
  const chip = el.parentElement; chip.classList.add('pop'); setTimeout(() => chip.classList.remove('pop'), 350);
}
function updateUI() {
  updateHeader();
  if (!S.fish) return;
  const n = feedsToday(), wi = waterInfo();
  let w;
  if (wi.left > 1) w = `Su değişimine <b>${wi.left} gün</b> var`;
  else if (wi.left === 1) w = `Yarın <b>su değişim günü</b>`;
  else if (wi.left === 0) w = `Bugün <b>su değişim günü!</b>`;
  else w = `Su değişimi <b>${-wi.left} gün gecikti</b>`;
  $('#status').innerHTML = `Bugün <b>${n}/2</b> öğün · son yem ${ago(lastFeed())}<br>${w}`;
  document.documentElement.dataset.theme = S.theme;
  const meta = $('meta[name=theme-color]'); if (meta) meta.content = (THEMES[S.theme] || THEMES.okyanus).bg;
}

let toastT;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2200); }
let modalT;
function modal(html) {
  clearTimeout(modalT);
  const m = $('#modal'), sh = $('#sheet');
  m.classList.remove('closing'); m.classList.add('hidden'); void m.offsetWidth; // animasyonu yeniden başlat
  sh.innerHTML = html; m.classList.remove('hidden');
  $$('[data-close]', sh).forEach(b => b.onclick = closeModal);
}
function closeModal() {
  const m = $('#modal'); if (m.classList.contains('hidden')) return;
  m.classList.add('closing');
  modalT = setTimeout(() => { m.classList.add('hidden'); m.classList.remove('closing'); $('#sheet').innerHTML = ''; }, 270);
}
$('#modal').addEventListener('click', e => { if (e.target.id === 'modal') closeModal(); });

$('#btnFeed').onclick = feed;
$('#btnWater').onclick = waterChange;

/* ---------- günlük ---------- */
async function renderJournal() {
  const el = $('#p-gunluk'), t = today(), cur = S.moods[t];
  const now = new Date(), y = now.getFullYear(), m = now.getMonth();
  const first = new Date(y, m, 1), days = new Date(y, m + 1, 0).getDate();
  const off = (first.getDay() + 6) % 7, fd = feedDays();
  let cal = ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz'].map(d => `<div class="h">${d}</div>`).join('');
  for (let i = 0; i < off; i++) cal += '<div class="x"></div>';
  const counts = {};
  for (let d = 1; d <= days; d++) {
    const k = `${y}-${pad(m + 1)}-${pad(d)}`, e = S.moods[k];
    if (e) counts[e] = (counts[e] || 0) + 1;
    cal += `<div class="${k === t ? 't' : ''} ${fd.has(k) ? 'f' : ''}">${e || `<span class="n">${d}</span>`}</div>`;
  }
  const sum = Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([e, n]) => `<span>${e} ${n}</span>`).join('');
  el.innerHTML = `
    <h2>Günlük</h2>
    <p class="lead">Her gün küçük bir not: nasıl hissetti, ne yaptı.</p>
    <div class="card">
      <h3>Bugün ${esc(S.fish.name)} nasıl?</h3>
      <div class="moods">${MOODS.map(([e, n]) => `<button class="mood ${cur === e ? 'on' : ''}" data-m="${e}"><b>${e}</b>${n}</button>`).join('')}</div>
    </div>
    <div class="card">
      <h3>${AYLAR[m]} ${y}</h3>
      <div class="cal">${cal}</div>
      ${sum ? `<div class="sum">${sum}</div>` : '<p class="muted">Her gün bir ruh hâli seç, takvim emojilerle dolsun.</p>'}
      <p class="muted" style="margin:12px 0 0">Köşedeki turuncu nokta: o gün beslendi</p>
    </div>
    <div class="card">
      <div class="cardHead"><h3>Albüm</h3><button class="btn" id="addPh" style="padding:9px 15px">Fotoğraf ekle</button></div>
      <div class="album" id="album"></div>
    </div>
    <div class="card">
      <div class="cardHead"><h3>Rozetler</h3><span class="muted" style="font-weight:800">${Object.keys(S.badges).length}/${BADGES.length}</span></div>
      <div class="badges">${BADGES.map(b => `<button class="badge ${S.badges[b.id] ? 'on' : ''}" data-b="${b.id}"><span class="medal">${S.badges[b.id] ? b.e : '?'}</span><small>${esc(b.n)}</small></button>`).join('')}</div>
    </div>
    <div class="card"><h3>${esc(S.fish.name)} ile birlikte</h3>
      <div class="stats">
        <div><b>${dayCount()}</b><small>gün</small></div>
        <div><b>${S.feeds.length}</b><small>öğün</small></div>
        <div><b>${S.waters.length}</b><small>su değişimi</small></div>
      </div>
    </div>`;
  $$('.badge', el).forEach(btn => btn.onclick = () => {
    const b = BADGES.find(x => x.id === btn.dataset.b), got = S.badges[b.id];
    modal(`<div class="eyebrow">${got ? 'Kazanıldı · ' + fmtDate(got) : 'Henüz kilitli'}</div><div class="medal big ${got ? '' : 'off'}">${got ? b.e : '?'}</div><h2>${esc(b.n)}</h2><p class="muted center">${esc(b.d)}</p><div class="btns"><button class="btn" data-close>Tamam</button></div>`);
  });
  $$('.mood', el).forEach(b => b.onclick = () => {
    S.moods[t] = b.dataset.m; const e = earned();
    if (!e.mood) { e.mood = true; S.points += 3; toast('+3 kabarcık · günlüğe yazıldı'); }
    if (b.dataset.m === '🫧') toast('Fanusun yüzeyinde köpük yuvası belirdi 🫧');
    save(); updateHeader(); Sfx.bloop(); checkBadges(); syncSoon();
    $$('.mood', el).forEach(x => x.classList.toggle('on', x === b));
    const cell = $('.cal .t', el); if (cell) cell.innerHTML = b.dataset.m;
  });
  $('#addPh').onclick = () => $('#filePhoto').click();
  try {
    const photos = (await DB.all()).sort((a, b) => b.t - a.t);
    const al = $('#album');
    if (!al) return;
    al.innerHTML = photos.length ? photos.map(p => `<button data-id="${p.id}"><img src="${p.src}" alt=""></button>`).join('')
      : `<p class="muted" style="grid-column:1/-1;margin:0">Henüz fotoğraf yok. İlk anıyı sen ekle.</p>`;
    $$('button', al).forEach(b => b.onclick = () => viewPhoto(photos.find(p => p.id === b.dataset.id)));
  } catch (e) { }
}

$('#filePhoto').addEventListener('change', async e => {
  const f = e.target.files[0]; e.target.value = '';
  if (!f) return;
  try {
    const src = await resizeImage(f, 1280);
    modal(`<img class="full" src="${src}" alt=""><div class="field"><label>Bir not yaz (isteğe bağlı)</label><input type="text" id="phCap" maxlength="80" placeholder="Örn. İlk gün 🫧"></div>
      <div class="btns"><button class="btn ghost" data-close>Vazgeç</button><button class="btn" id="phSave">Kaydet</button></div>`);
    $('#phSave').onclick = async () => {
      const cap = $('#phCap').value.trim();
      await DB.put({ id: 'p' + Date.now(), t: Date.now(), d: today(), cap, src });
      S.photoCount = (S.photoCount || 0) + 1; save();
      const ea = earned(); if (ea.photo < 2) { ea.photo++; S.points += 5; save(); toast('+5 kabarcık · anı kaydedildi'); updateHeader(); }
      closeModal(); $('#p-gunluk').classList.add('quiet'); renderJournal(); checkBadges();
    };
  } catch (err) { toast('Fotoğraf açılamadı 😢'); }
});
function viewPhoto(p) {
  if (!p) return;
  modal(`<img class="full" src="${p.src}" alt="">
    <div class="note" style="box-shadow:none;padding:12px 2px 0;margin:0"><div class="d">${fmtDate(p.d)}</div>${p.cap ? `<div class="t">${esc(p.cap)}</div>` : ''}</div>
    <div class="btns"><button class="btn ghost" id="phDel">Sil</button><button class="btn" data-close>Kapat</button></div>`);
  $('#phDel').onclick = () => {
    $('#phDel').textContent = 'Emin misin?'; $('#phDel').classList.add('danger');
    $('#phDel').onclick = async () => { await DB.del(p.id); closeModal(); renderJournal(); };
  };
}
function resizeImage(file, max) {
  return new Promise((res, rej) => {
    const url = URL.createObjectURL(file), img = new Image();
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url); res(c.toDataURL('image/jpeg', 0.82));
    };
    img.onerror = rej; img.src = url;
  });
}

/* ---------- dekor ---------- */
function renderShop() {
  const el = $('#p-dekor');
  el.innerHTML = `
    <h2>Dekor</h2>
    <p class="lead">Besledikçe, suyu değiştirdikçe ve günlük tuttukça kabarcık kazanırsın. Onlarla fanusu süsle.</p>
    <div class="card wallet"><span class="muted" style="font-weight:800">Kabarcıkların</span><b><svg class="ic"><use href="#i-bubble"/></svg>${S.points}</b></div>
    <div class="shop">${SHOP.map(i => {
      const own = S.owned.includes(i.id), on = S.placed.includes(i.id);
      const icon = i.id === 'marimo' ? '<div class="marimo-i"></div>' : i.e;
      let btn;
      if (!own) btn = `<button class="btn" data-buy="${i.id}" ${S.points < i.c ? 'disabled' : ''}><svg class="ic"><use href="#i-bubble"/></svg>${i.c}</button>`;
      else btn = `<button class="btn ${on ? 'ghost' : ''}" data-tog="${i.id}">${on ? 'Fanustan çıkar' : 'Fanusa koy'}</button>`;
      return `<div class="item"><div class="e">${icon}</div><div class="n">${i.n}</div><div class="c">${own ? (on ? 'Fanusta' : 'Sende') : 'Satın al'}</div>${btn}</div>`;
    }).join('')}</div>`;
  $$('[data-buy]', el).forEach(b => b.onclick = () => {
    const i = SHOP.find(x => x.id === b.dataset.buy);
    if (S.points < i.c) return;
    S.points -= i.c; S.owned.push(i.id); S.placed.push(i.id); save(); updateHeader();
    toast(`${i.n} fanusa kondu ✨`); el.classList.add('quiet'); renderShop();
  });
  $$('[data-tog]', el).forEach(b => b.onclick = () => {
    const id = b.dataset.tog;
    S.placed = S.placed.includes(id) ? S.placed.filter(x => x !== id) : [...S.placed, id];
    save(); el.classList.add('quiet'); renderShop();
  });
}

/* ---------- notlar ---------- */
function renderNotes() {
  const el = $('#p-notlar');
  const sig = NOTE_SIGN ? `<div class="lsign">${esc(NOTE_SIGN)}</div>` : '';
  const items = [
    ...S.notesOpened.map(n => ({ d: n.d, k: 1, fish: n.fish, html: n.fish ? `<div class="t">${esc(n.text)}</div>` : `<div class="ltext">${esc(n.text)}</div>${sig}`, tag: n.fish ? 'Balığından' : 'Kabarcık notu' })),
    ...S.inbox.filter(m => m.read).map(m => ({ d: m.at ? dk(new Date(m.at)) : today(), k: 2, html: `<div class="ltext">${esc(m.text)}</div>${sig}`, tag: 'Anlık mesaj', gold: true })),
    ...S.giftsOpened.map(g => ({ d: g.d, k: 0, html: `<h3 style="margin:2px 0 8px">${esc(g.title || '')}</h3><div class="ltext">${esc(g.text || '')}</div>${g.image ? `<img src="${esc(g.image)}" alt="">` : ''}${sig}`, tag: 'Hediye' }))
  ].sort((a, b) => b.d.localeCompare(a.d) || b.k - a.k);
  const left = NOTES.filter((n, i) => !S.notesOpened.some(o => o.i === i)).length;
  const unread = S.inbox.filter(m => !m.read).length;
  el.innerHTML = `
    <h2>Kabarcık kutusu</h2>
    <p class="lead">Her gün fanusta büyük bir kabarcık belirir. Patlatınca içinden çıkan not burada saklanır.${left ? ` Daha <b>${left}</b> gizli not seni bekliyor.` : ''}</p>
    ${unread ? `<div class="card goldHint"><b>${unread} yeni mesaj</b> fanusta altın bir kabarcığın içinde seni bekliyor.</div>` : ''}
    ${items.length ? items.map(n => `<div class="note ${n.fish ? '' : 'paper'} ${n.gold ? 'gold' : ''}"><div class="d">${n.tag.toLocaleUpperCase("tr-TR")} · ${fmtDate(n.d)}</div>${n.html}</div>`).join('')
      : `<div class="empty"><div style="font-size:46px;margin-bottom:8px">💌</div>Henüz kabarcık patlatmadın.<br>Fanustaki büyük kabarcığa dokun.</div>`}`;
}

/* ---------- ayarlar ---------- */
function renderSettings() {
  const el = $('#p-ayar');
  const motionTxt = typeof DeviceMotionEvent === 'undefined' ? 'Yok' : (S.motion === 'granted' ? 'Açık' : 'Aç');
  el.innerHTML = `
    <h2>Ayarlar</h2>
    <div class="card">
      <div class="row"><div class="l">${esc(S.fish.name)}<small>İsim, renk ve kuyruk</small></div><button class="btn ghost" id="sEdit">Düzenle</button></div>
      <div class="row"><div class="l">Eve geliş günü<small>Gün sayacı buradan başlar</small></div><input type="date" id="sStart" value="${S.startDate}" max="${today()}"></div>
      <div class="row"><div class="l">Su değişim aralığı<small>Fanusta 3–5 gün idealdir</small></div>
        <select id="sWater">${[2, 3, 4, 5, 6, 7, 10, 14].map(n => `<option value="${n}" ${S.waterInterval === n ? 'selected' : ''}>${n} gün</option>`).join('')}</select></div>
      <div class="row"><div class="l">Tema</div>
        <select id="sTheme">${Object.entries(THEMES).map(([k, v]) => `<option value="${k}" ${S.theme === k ? 'selected' : ''}>${v.n}</option>`).join('')}</select></div>
      <div class="row"><div class="l">Sallama oyunu<small>Telefonu sallayınca su dalgalanır</small></div><button class="btn ghost" id="sMotion">${motionTxt}</button></div>
      <div class="row"><div class="l">Sesler<small>Yem, kabarcık ve dokunma sesleri</small></div><button class="tgl ${S.sound ? 'on' : ''}" id="sSound" aria-label="Sesler"><i></i></button></div>
      <div class="row"><div class="l">Senin doğum günün<small>O gün fanusta sürpriz var</small></div><input type="date" id="sBday" value="${S.birthday ? '2000-' + S.birthday : ''}"></div>
    </div>
    <div class="card" id="notifCard"></div>
    <div class="card">
      <h3>Yedek</h3>
      <p class="muted" style="margin-top:-6px">Her şey bu telefonda saklanıyor. Telefon değiştirirsen yedeği alıp yeni telefonda geri yükleyebilirsin.</p>
      <div class="btns" style="display:flex;gap:8px"><button class="btn ghost" id="sExp" style="flex:1">Yedeği kaydet</button><button class="btn ghost" id="sImp" style="flex:1">Geri yükle</button></div>
    </div>
    <div class="card">
      <div class="row"><div class="l">Her şeyi sıfırla<small>Balık, puanlar, fotoğraflar silinir</small></div><button class="btn danger" id="sReset">Sıfırla</button></div>
    </div>
    <p class="center signoff">Fanusum · sevgiyle yapıldı</p>`;
  renderNotifCard();
  $('#sSound').onclick = e => { S.sound = !S.sound; Sfx.on = S.sound; save(); e.currentTarget.classList.toggle('on', S.sound); if (S.sound) Sfx.bloop(); };
  $('#sBday').onchange = e => { S.birthday = e.target.value ? e.target.value.slice(5) : ''; save(); toast('Kaydedildi'); syncSoon(); };
  $('#sEdit').onclick = () => openEditor(true);
  $('#sStart').onchange = e => { if (e.target.value) { S.startDate = e.target.value; save(); updateHeader(); toast('Tarih güncellendi'); } };
  $('#sWater').onchange = e => { S.waterInterval = +e.target.value; save(); toast('Kaydedildi'); };
  $('#sTheme').onchange = e => { S.theme = e.target.value; save(); updateUI(); };
  $('#sMotion').onclick = async () => { const ok = await askMotion(false); toast(ok ? 'Sallama açık! Fanusa git ve salla 🌊' : 'İzin verilmedi'); renderSettings(); };
  $('#sExp').onclick = exportBackup;
  $('#sImp').onclick = () => $('#fileBackup').click();
  $('#sReset').onclick = () => modal(`
    <div class="bigE">🥺</div><h2>Emin misin?</h2><p class="muted center">${esc(S.fish.name)}, tüm notlar, puanlar ve fotoğraflar silinecek. Geri alınamaz.</p>
    <div class="btns"><button class="btn ghost" data-close>Vazgeç</button><button class="btn danger" id="rYes">Evet, sıfırla</button></div>`) || ($('#rYes').onclick = async () => {
      try { await DB.clear(); } catch (e) { }
      localStorage.removeItem(KEY); location.reload();
    });
}

function renderNotifCard() {
  const box = $('#notifCard'); if (!box) return;
  const N = S.notif, perm = pushSupported() ? Notification.permission : 'yok';
  const needInstall = isIOS && !standalone;
  const timeSel = (id, v) => `<input type="time" id="${id}" value="${v}" step="900">`;
  if (!N.on || perm !== 'granted') {
    box.innerHTML = `<h3>Bildirimler</h3>
      <p class="muted" style="margin-top:-6px">Yemek saati, su günü, yeni kabarcık ve Emre'den gelen mesajlar telefonuna bildirim olarak gelsin.</p>
      ${needInstall ? `<p class="muted"><b>Önce ana ekrana ekle:</b> Safari'de Paylaş → Ana Ekrana Ekle, sonra uygulamayı oradan aç.</p>` : ''}
      ${perm === 'denied' ? `<p class="muted"><b>İzin kapalı.</b> iPhone Ayarlar → Bildirimler → Fanusum'dan açabilirsin.</p>` : ''}
      <button class="btn wide" id="nOn" ${needInstall || perm === 'denied' || perm === 'yok' && !needInstall ? 'disabled' : ''}>Bildirimleri aç</button>`;
    const b = $('#nOn'); if (b) b.onclick = async () => { b.disabled = true; b.textContent = 'Açılıyor…'; const ok = await enableNotifications(); if (ok) { toast('Bildirimler açık 🔔'); Sfx.chime(); } renderNotifCard(); };
    return;
  }
  box.innerHTML = `<div class="cardHead"><h3>Bildirimler</h3><button class="tgl on" id="nOff" aria-label="Bildirimleri kapat"><i></i></button></div>
    <div class="row"><div class="l">Yemek hatırlatması<small>O öğün verildiyse gelmez</small></div><button class="tgl ${N.feedOn ? 'on' : ''}" data-k="feedOn"><i></i></button></div>
    <div class="row"><div class="l">Sabah öğünü</div>${timeSel('nF1', N.feed[0])}</div>
    <div class="row"><div class="l">Akşam öğünü</div>${timeSel('nF2', N.feed[1])}</div>
    <div class="row"><div class="l">Su günü<small>Değişim günü geldiğinde</small></div><div style="display:flex;gap:8px;align-items:center">${timeSel('nW', N.water)}<button class="tgl ${N.waterOn ? 'on' : ''}" data-k="waterOn"><i></i></button></div></div>
    <div class="row"><div class="l">Yeni kabarcık<small>Günün notu hazır olunca</small></div><div style="display:flex;gap:8px;align-items:center">${timeSel('nB', N.bubble)}<button class="tgl ${N.bubbleOn ? 'on' : ''}" data-k="bubbleOn"><i></i></button></div></div>
    <button class="btn ghost wide" id="nTest" style="margin-top:12px">Deneme bildirimi gönder</button>`;
  $('#nOff').onclick = async () => { await disableNotifications(); toast('Bildirimler kapatıldı'); renderNotifCard(); };
  $$('[data-k]', box).forEach(b => b.onclick = () => { N[b.dataset.k] = !N[b.dataset.k]; b.classList.toggle('on', N[b.dataset.k]); save(); syncSoon(400); });
  const bind = (id, fn) => { $('#' + id).onchange = e => { if (e.target.value) { fn(e.target.value); save(); syncSoon(400); toast('Saat kaydedildi'); } }; };
  bind('nF1', v => N.feed[0] = v); bind('nF2', v => N.feed[1] = v); bind('nW', v => N.water = v); bind('nB', v => N.bubble = v);
  $('#nTest').onclick = async e => {
    const b = e.currentTarget; b.disabled = true; b.textContent = 'Gönderiliyor…';
    try { await sync(); const j = await api('test'); toast(j.sent ? 'Gönderildi, birkaç saniye içinde gelir' : 'Gönderilemedi'); }
    catch (err) { toast('Sunucuya ulaşılamadı'); }
    b.disabled = false; b.textContent = 'Deneme bildirimi gönder';
  };
}

async function exportBackup() {
  try {
    const photos = await DB.all();
    const blob = new Blob([JSON.stringify({ app: 'fanusum', state: S, photos })], { type: 'application/json' });
    const name = `fanusum-yedek-${today()}.json`;
    const file = new File([blob], name, { type: 'application/json' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: 'Fanusum yedeği' }); return; }
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  } catch (e) { if (e && e.name !== 'AbortError') toast('Yedek alınamadı'); }
}
$('#fileBackup').addEventListener('change', async e => {
  const f = e.target.files[0]; e.target.value = '';
  if (!f) return;
  try {
    const data = JSON.parse(await f.text());
    if (data.app !== 'fanusum' || !data.state || !data.state.v) throw 0;
    modal(`<div class="bigE">💾</div><h2>Yedek geri yüklensin mi?</h2><p class="muted center">Şu anki veriler yedektekilerle değişecek.</p>
      <div class="btns"><button class="btn ghost" data-close>Vazgeç</button><button class="btn" id="iYes">Geri yükle</button></div>`);
    $('#iYes').onclick = async () => {
      S = Object.assign(defaults(), data.state); save();
      try { await DB.clear(); for (const p of data.photos || []) await DB.put(p); } catch (er) { }
      location.reload();
    };
  } catch (err) { toast('Bu dosya bir Fanusum yedeği değil'); }
});

/* ---------- fotoğraf veritabanı ---------- */
const DB = (() => {
  let p;
  const open = () => p || (p = new Promise((res, rej) => {
    const r = indexedDB.open('fanusum', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('photos', { keyPath: 'id' });
    r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
  }));
  const run = async (mode, fn) => {
    const db = await open();
    return new Promise((res, rej) => {
      const tx = db.transaction('photos', mode), req = fn(tx.objectStore('photos'));
      tx.oncomplete = () => res(req && req.result); tx.onerror = () => rej(tx.error);
    });
  };
  return {
    all: () => run('readonly', s => s.getAll()).then(r => r || []),
    put: o => run('readwrite', s => s.put(o)),
    del: id => run('readwrite', s => s.delete(id)),
    clear: () => run('readwrite', s => s.clear())
  };
})();

/* =========================================================
   KURULUM / DÜZENLEME
   ========================================================= */
const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const standalone = navigator.standalone === true || matchMedia('(display-mode: standalone)').matches;
const ov = $('#overlay');
let edLoop = 0;

/* küçük fanus (açılış ve önizleme için) */
function drawMiniBowl(c, w, h, fish, t) {
  const th = THEMES[S.theme] || THEMES.okyanus;
  const cx = w / 2, cy = h * 0.5, R = Math.min(w * 0.46, h * 0.45), wt = cy - R * 0.55;
  c.clearRect(0, 0, w, h);
  softShadow(c, cx, cy + R * 0.98, R * 0.75, R * 0.08, 0.2);
  c.save(); c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.clip();
  c.fillStyle = 'rgba(255,255,255,.3)'; c.fillRect(cx - R, cy - R, R * 2, R * 2);
  let g = c.createRadialGradient(cx - R * 0.15, cy - R * 0.15, R * 0.1, cx, cy, R * 1.05);
  g.addColorStop(0, th.water[0]); g.addColorStop(0.75, th.water[1]); g.addColorStop(1, tint(th.water[1], -0.25));
  c.fillStyle = g; c.fillRect(cx - R, wt, R * 2, R * 2);
  g = c.createLinearGradient(0, cy + R * 0.58, 0, cy + R); g.addColorStop(0, '#eadcc8'); g.addColorStop(1, '#c6ae90');
  c.fillStyle = g; c.beginPath(); c.ellipse(cx, cy + R * 1.0, R * 1.1, R * 0.42, 0, 0, Math.PI * 2); c.fill();
  if (fish) {
    const fx = cx + Math.sin(t * 0.55) * R * 0.3, fy = cy + R * 0.05 + Math.sin(t * 1.4) * R * 0.03;
    softShadow(c, fx, cy + R * 0.66, R * 0.3, R * 0.04, 0.22);
    const dir = Math.cos(t * 0.55);
    drawFishAny(c, Object.assign({ x: fx, y: fy, s: R * 0.78, t, facing: clamp(dir * 3, -1, 1), speed: 1 }, fish));
  }
  c.restore();
  const sw = Math.sqrt(R * R - (wt - cy) * (wt - cy));
  c.beginPath(); c.ellipse(cx, wt, sw, sw * 0.11, 0, 0, Math.PI * 2);
  c.fillStyle = 'rgba(255,255,255,.28)'; c.fill(); c.strokeStyle = 'rgba(255,255,255,.8)'; c.lineWidth = 1.2; c.stroke();
  g = c.createRadialGradient(cx, cy, R * 0.86, cx, cy, R);
  g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.9, 'rgba(255,255,255,.35)'); g.addColorStop(1, 'rgba(140,185,215,.55)');
  c.save(); c.beginPath(); c.rect(0, cy - R * 0.8, w, h); c.clip();
  c.fillStyle = g; c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.arc(cx, cy, R * 0.86, 0, Math.PI * 2, true); c.fill('evenodd'); c.restore();
  const rx = Math.sqrt(R * R - (R * 0.8) ** 2);
  c.lineWidth = 2; c.strokeStyle = 'rgba(255,255,255,.95)';
  c.beginPath(); c.ellipse(cx, cy - R * 0.8, rx, rx * 0.12, 0, 0, Math.PI * 2); c.stroke();
  c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineWidth = R * 0.05;
  c.beginPath(); c.arc(cx, cy, R * 0.85, Math.PI * 0.92, Math.PI * 1.16); c.stroke();
}
function runMini(canvas, w, h, getFish) {
  const dpr = Math.min(3, devicePixelRatio || 1), c = canvas.getContext('2d');
  canvas.width = w * dpr; canvas.height = h * dpr; canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
  cancelAnimationFrame(edLoop);
  const t0 = performance.now();
  const loop = now => {
    if (!document.body.contains(canvas)) return;
    const t = Math.max(0, (now - t0) / 1000);
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawMiniBowl(c, w, h, getFish(t), t);
    edLoop = requestAnimationFrame(loop);
  };
  edLoop = requestAnimationFrame(loop);
}

function showInstall() {
  ov.innerHTML = `<div class="ob">
    <canvas class="hero" id="hero"></canvas>
    <h1>Önce ana ekrana ekle</h1>
    <p>Balığın ve bütün anıların telefonunda saklansın diye uygulamayı ana ekrana ekleyip oradan açmalısın.</p>
    <div class="steps">
      <div><b>1</b><span>Safari'de alttaki <strong>Paylaş</strong> düğmesine dokun</span></div>
      <div><b>2</b><span><strong>Ana Ekrana Ekle</strong>'yi seç</span></div>
      <div><b>3</b><span>Ana ekrandaki <strong>Fanusum</strong> simgesinden aç</span></div>
    </div>
    <button class="link" id="skipInst">Yine de tarayıcıda devam et</button>
  </div>`;
  ov.classList.add('show');
  runMini($('#hero'), 170, 170, t => ({ body: '#2448c9', fin: '#7b2fbf', tail: 'halfmoon' }));
  $('#skipInst').onclick = () => { try { sessionStorage.setItem('skipInst', '1'); } catch (e) { } showWelcome(); };
}
function showWelcome() {
  ov.innerHTML = `<div class="ob center">
    <canvas class="hero" id="hero"></canvas>
    ${FROM_TEXT ? `<div class="fromLine">${esc(FROM_TEXT)}</div>` : ''}
    <h1>Merhaba!</h1>
    <p>Ben senin yeni balığınım. Bu fanus bizim küçük evimiz olacak.<br>Önce bana bir isim koyup rengimi seçer misin?</p>
    <button class="btn wide cta" id="go" style="margin-top:28px">Başlayalım</button>
  </div>`;
  ov.classList.add('show');
  // renk değiştiren balık: "hangi renk olacağım?"
  const cols = COLORS.map(c => c[1]);
  runMini($('#hero'), 230, 230, t => {
    const k = t / 1.8, i = Math.floor(k) % cols.length, f = k - Math.floor(k), e = f < 0.7 ? 0 : (f - 0.7) / 0.3;
    const col = mixHex(cols[i], cols[(i + 1) % cols.length], e * e * (3 - 2 * e));
    return { body: col, fin: col, tail: TAILS[Math.floor(k / 3) % TAILS.length][0] };
  });
  $('#go').onclick = () => openEditor(false);
}

function openEditor(edit) {
  const f = edit ? { ...S.fish } : { name: '', body: '#d7263d', fin: null, tail: 'halfmoon' };
  const start = edit ? S.startDate : today();
  ov.innerHTML = `<div class="ob">
    <h1>${edit ? 'Balığını düzenle' : 'Balığını tanıt'}</h1>
    <p>Gerçek balığına benzet</p>
    <canvas class="preview" id="pv"></canvas>
    <div class="field"><label>Adı</label><input type="text" id="eName" maxlength="20" placeholder="Örn. Bulut, Lokum, Mavi…" value="${esc(f.name)}"></div>
    <button class="photoPick" id="pickPhoto"><svg class="ic"><use href="#i-camera"/></svg><span><b>Fotoğraftan renk seç</b><small>Balığının fotoğrafını çek, üstüne dokun</small></span></button>
    <div class="field"><label>Gövde rengi</label><div class="sw" id="swB"></div></div>
    <div class="field"><label>Yüzgeç rengi</label><div class="sw" id="swF"></div></div>
    <div class="field"><label>Kuyruk tipi</label><div class="tails" id="tl"></div></div>
    ${edit ? '' : `<div class="field"><label>Eve geliş günü</label><input type="date" id="eStart" value="${start}" max="${today()}"></div>`}
    <button class="btn wide cta" id="eSave">${edit ? 'Kaydet' : 'Fanusa koy'}</button>
    ${edit ? '<button class="link" id="eCancel">Vazgeç</button>' : ''}
  </div>`;
  ov.classList.add('show'); ov.scrollTop = 0;

  const swatches = (box, key, allowSame) => {
    const cur = f[key];
    let h = allowSame ? `<button class="same ${!cur ? 'on' : ''}" data-c="">Aynı</button>` : '';
    h += COLORS.map(([n, c]) => `<button title="${n}" data-c="${c}" style="background:${c}" class="${cur === c ? 'on' : ''}"></button>`).join('');
    const custom = cur && !COLORS.some(x => x[1] === cur);
    h += `<label title="Özel renk" class="${custom ? 'on' : ''}"><input type="color" value="${cur || '#d7263d'}"></label>`;
    box.innerHTML = h;
    $$('button', box).forEach(b => b.onclick = () => { f[key] = b.dataset.c || null; swatches(box, key, allowSame); drawTails(); });
    const inp = $('input', box);
    inp.oninput = () => { f[key] = inp.value; $$('.on', box).forEach(x => x.classList.remove('on')); inp.parentElement.classList.add('on'); drawTails(); };
  };
  const tl = $('#tl');
  tl.innerHTML = TAILS.map(([id, n]) => `<button data-t="${id}" class="${f.tail === id ? 'on' : ''}"><canvas width="140" height="100"></canvas>${n}</button>`).join('');
  $$('button', tl).forEach(b => b.onclick = () => { f.tail = b.dataset.t; $$('button', tl).forEach(x => x.classList.toggle('on', x === b)); });
  function drawTails() {
    $$('button', tl).forEach(b => {
      const c = $('canvas', b).getContext('2d'); c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, 140, 100);
      drawFish(c, { x: 84, y: 44, s: 66, t: 0.6, facing: 1, body: f.body, fin: f.fin || f.body, tail: b.dataset.t, speed: 1 });
    });
  }
  swatches($('#swB'), 'body', false);
  swatches($('#swF'), 'fin', true);
  drawTails();
  $('#pickPhoto').onclick = () => pickFromPhoto((body, fin) => {
    f.body = body; f.fin = fin && fin !== body ? fin : null;
    swatches($('#swB'), 'body', false); swatches($('#swF'), 'fin', true); drawTails();
    toast('Renkler fotoğraftan alındı ✨');
  });

  // canlı önizleme
  const ps = Math.min(ov.clientWidth - 44, 260);
  runMini($('#pv'), ps, ps, () => ({ body: f.body, fin: f.fin || f.body, tail: f.tail }));

  if (edit) $('#eCancel').onclick = closeOverlay;
  $('#eSave').onclick = () => {
    const name = $('#eName').value.trim();
    if (!name) { $('#eName').focus(); toast('Önce bir isim koy 🥺'); return; }
    f.name = name;
    S.fish = { name: f.name, body: f.body, fin: f.fin || null, tail: f.tail };
    if (!edit) {
      S.startDate = ($('#eStart') && $('#eStart').value) || today();
      if (S.startDate > today()) S.startDate = today();
      askMotion(false); // iOS hareket izni (kullanıcı dokunuşu içinde)
    }
    save(); closeOverlay();
    if (!edit) {
      setTimeout(() => { say(`Merhaba! Ben ${S.fish.name} 🫧 Bana iyi bak olur mu?`, 5000); confetti(100); }, 400);
      S.lastGreetDay = today(); S.confettiDay = today(); save();
    } else toast('Kaydedildi 💙');
    showPage('fanus');
  };
}
/* fotoğraftan renk seçme */
function vivid(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b); let h = 0, s = 0, l = (mx + mn) / 2;
  if (mx !== mn) {
    const d = mx - mn; s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
    h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h /= 6;
  }
  s = Math.min(1, s * 1.2 + 0.04); l = clamp(l, 0.25, 0.72);
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
  const f = t => { t = (t + 1) % 1; return t < 1 / 6 ? p + (q - p) * 6 * t : t < 1 / 2 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p; };
  return '#' + [f(h + 1 / 3), f(h), f(h - 1 / 3)].map(v => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
}
function pickFromPhoto(done, testSrc) {
  const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'image/*';
  inp.onchange = async () => {
    const file = inp.files[0]; if (!file && !testSrc) return;
    let src = testSrc; if (!src) { try { src = await resizeImage(file, 1000); } catch (e) { toast('Fotoğraf açılamadı'); return; } }
    const img = new Image();
    img.onload = () => {
      let step = 'body', body = null;
      modal(`<div class="eyebrow" id="ppStep">1 / 2 · Gövde</div>
        <h2 id="ppTitle">Balığın gövdesine dokun</h2>
        <div class="picker"><canvas id="ppCv"></canvas><span class="loupe" id="ppLoupe"></span></div>
        <div class="ppRow"><span class="ppSw" id="ppB"></span><span class="ppSw" id="ppF"></span><span class="muted" id="ppHint">Renk en iyi, ışığın iyi aldığı yerden alınır.</span></div>
        <div class="btns"><button class="btn ghost" data-close>Vazgeç</button><button class="btn" id="ppNext" disabled>Devam</button></div>`);
      const cvs = $('#ppCv'), c = cvs.getContext('2d', { willReadFrequently: true });
      const wMax = Math.min($('#sheet').clientWidth - 44, 420), k = wMax / img.width;
      cvs.width = img.width; cvs.height = img.height; cvs.style.width = wMax + 'px'; cvs.style.height = img.height * k + 'px';
      c.drawImage(img, 0, 0);
      let cur = null;
      cvs.addEventListener('pointerdown', e => {
        const r = cvs.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * img.width, y = (e.clientY - r.top) / r.height * img.height;
        const R = Math.max(3, Math.round(img.width / 90));
        const d = c.getImageData(clamp(Math.round(x - R), 0, Math.max(0, img.width - R * 2)), clamp(Math.round(y - R), 0, Math.max(0, img.height - R * 2)), R * 2, R * 2).data;
        let rr = 0, gg = 0, bb = 0, n = 0; for (let i = 0; i < d.length; i += 4) { rr += d[i]; gg += d[i + 1]; bb += d[i + 2]; n++; }
        cur = vivid(rr / n, gg / n, bb / n);
        const lp = $('#ppLoupe'); lp.style.left = (e.clientX - r.left) + 'px'; lp.style.top = (e.clientY - r.top) + 'px'; lp.style.background = cur; lp.classList.add('show');
        $(step === 'body' ? '#ppB' : '#ppF').style.background = cur;
        $('#ppNext').disabled = false; Sfx.tap();
      });
      $('#ppNext').onclick = () => {
        if (step === 'body') {
          body = cur; step = 'fin'; cur = null;
          $('#ppStep').textContent = '2 / 2 · Yüzgeç'; $('#ppTitle').textContent = 'Şimdi kuyruğuna ya da yüzgecine dokun';
          $('#ppHint').textContent = 'Yüzgeç aynı renkse "Aynı" de.'; $('#ppLoupe').classList.remove('show');
          const nx = $('#ppNext'); nx.textContent = 'Aynı'; nx.disabled = false;
          cvs.addEventListener('pointerdown', () => { nx.textContent = 'Bitir'; }, { once: true });
          return;
        }
        closeModal(); done(body, cur || body);
      };
    };
    img.src = src;
  };
  if (testSrc) inp.onchange(); else inp.click();
}
function closeOverlay() {
  ov.classList.remove('show');
  setTimeout(() => { if (!ov.classList.contains('show')) { ov.innerHTML = ''; cancelAnimationFrame(edLoop); } }, 480);
}

/* =========================================================
   BAŞLAT
   ========================================================= */
function dailyCheck() {
  if (!S.fish) return;
  updateUI();
  if (S.lastGreetDay !== today()) {
    S.lastGreetDay = today(); save();
    setTimeout(() => say(isNight() ? 'İyi geceler… 🌙 Yarın görüşürüz' : pick(DAILY), 6000), 900);
  }
  const se = season();
  if (S.confettiDay !== today() && (isMilestone() || se === 'birthday' || se === 'newyear' || se === 'valentine')) {
    S.confettiDay = today(); save();
    const line = se === 'birthday' ? 'İyi ki doğdun! 🎂 Bugün senin günün' : se === 'newyear' ? 'Mutlu yıllar! 🎆 Yeni yılda da hep birlikte' :
      se === 'valentine' ? 'Sevgililer Günün kutlu olsun 💘' : `Bugün ${dayCount()}. günümüz! 🎉`;
    setTimeout(() => { confetti(130); Sfx.chime(); say(line, 5500); react('spin', 1.1); }, 1500);
  }
  const h = new Date().getHours();
  if (h < 5 && !S.nightOpen) { S.nightOpen = true; save(); }
  checkBadges();
  syncSoon(600);
}

window.addEventListener('resize', () => { if (curPage === 'fanus') resize(); });
document.addEventListener('visibilitychange', () => { if (!document.hidden) { lastT = performance.now(); dailyCheck(); if (curPage === 'fanus') resize(); } });
setInterval(() => { if (S.fish && curPage === 'fanus') updateUI(); }, 60000);
setInterval(() => { if (S.fish && !document.hidden) sync(); }, 90000);
$('#btnMirror').onclick = openMirror;
Sfx.on = S.sound !== false;

document.documentElement.dataset.theme = S.theme;
if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => { });
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => { });

if (!S.fish) {
  let skip = false; try { skip = sessionStorage.getItem('skipInst') === '1'; } catch (e) { }
  if (isIOS && !standalone && !skip) showInstall(); else showWelcome();
} else {
  if (S.motion === 'granted' && typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission !== 'function') enableMotion();
  dailyCheck();
}
resize();
requestAnimationFrame(frame);

// test için konsoldan erişim
window.__fanus = { get S() { return S; }, shake, confetti, feed, wake, F, openMirror, tapFish, react, receive, checkBadges, pickFromPhoto, big: () => big, msgBub: () => msgBub };
})();
