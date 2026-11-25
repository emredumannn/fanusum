/* Fanusum — balık çizimi (yandan + önden görünüş, dönüşte yumuşak geçiş) */
'use strict';

/* ---------- renk yardımcıları ---------- */
function hexRgb(h) { h = String(h || '#888888').replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join(''); const n = parseInt(h, 16) || 0; return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
function rgba(h, a) { const [r, g, b] = hexRgb(h); return `rgba(${r},${g},${b},${a})`; }
function tint(h, a, al = 1) { const [r, g, b] = hexRgb(h); const f = v => Math.round(a < 0 ? v * (1 + a) : v + (255 - v) * a); return `rgba(${f(r)},${f(g)},${f(b)},${al})`; }
function mixHex(a, b, t) { const A = hexRgb(a), B = hexRgb(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); }
const smooth = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

/* ---------- kuyruk ---------- */
function tailShape(type, s) {
  if (type === 'veil') return { a0: Math.PI - 0.42, a1: Math.PI + 1.45, R: s * 0.52, n: 30 };
  if (type === 'crowntail') return { a0: Math.PI - 1.25, a1: Math.PI + 1.25, R: s * 0.47, n: 24, spiky: true };
  if (type === 'plakat') return { a0: Math.PI - 0.8, a1: Math.PI + 0.8, R: s * 0.28, n: 20 };
  return { a0: Math.PI - 1.5, a1: Math.PI + 1.5, R: s * 0.45, n: 32 };
}
function smoothPath(c, pts, spiky) {
  c.lineTo(pts[0][0], pts[0][1]);
  if (spiky) { for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); return; }
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2;
    c.quadraticCurveTo(pts[i][0], pts[i][1], mx, my);
  }
  c.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]);
}
function drawTail(c, type, s, t, col, wave, flare = 0) {
  const sh = tailShape(type, s), n = sh.n, edge = [], rays = [];
  sh.R *= 1 + flare * 0.14;
  const spread = 1 + flare * 0.12;
  for (let i = 0; i <= n; i++) {
    const u = i / n, a = Math.PI + (sh.a0 - Math.PI + (sh.a1 - sh.a0) * u) * spread;
    let r = sh.R * (type === 'veil' ? 0.68 + 0.44 * u : 1);
    if (sh.spiky) r *= (i % 2 ? 1 : 0.8);
    else r *= 1 + 0.04 * Math.sin(i * 1.9);
    const pts = [];
    for (let k = 1; k <= 4; k++) {
      const f = k / 4, rr = r * f;
      const d = Math.sin(t * 3.6 * wave - f * 3.2 + u * 2.4) * s * 0.04 * f * f * (1 - flare * 0.6);
      pts.push([Math.cos(a) * rr - Math.sin(a) * d, Math.sin(a) * rr + Math.cos(a) * d]);
    }
    rays.push(pts); edge.push(pts[3]);
  }
  const g = c.createRadialGradient(0, 0, s * 0.02, 0, 0, sh.R * 1.12);
  g.addColorStop(0, tint(col, -0.3, 0.98)); g.addColorStop(0.45, tint(col, -0.05, 0.94));
  g.addColorStop(0.84, tint(col, 0.08, 0.8)); g.addColorStop(1, tint(col, 0.3, 0.55));
  c.fillStyle = g;
  c.beginPath(); c.moveTo(0, -s * 0.035); smoothPath(c, edge, sh.spiky); c.lineTo(0, s * 0.035); c.closePath(); c.fill();
  c.fillStyle = tint(col, -0.3, 0.22);
  c.beginPath(); c.moveTo(0, -s * 0.02); smoothPath(c, rays.map(p => p[1]), false); c.lineTo(0, s * 0.02); c.closePath(); c.fill();
  c.lineCap = 'round';
  c.strokeStyle = tint(col, -0.45, 0.3); c.lineWidth = Math.max(0.5, s * 0.0055);
  for (let i = 0; i <= n; i += sh.spiky ? 1 : 2) {
    const p = rays[i]; c.beginPath(); c.moveTo(0, 0);
    c.quadraticCurveTo(p[1][0], p[1][1], p[2][0], p[2][1]); c.quadraticCurveTo(p[2][0], p[2][1], p[3][0] * 0.97, p[3][1] * 0.97); c.stroke();
  }
  c.strokeStyle = 'rgba(255,255,255,.16)'; c.lineWidth = s * 0.018;
  const i0 = Math.floor(n * 0.15), i1 = Math.floor(n * 0.55);
  c.beginPath(); c.moveTo(rays[i0][2][0], rays[i0][2][1]);
  for (let i = i0; i < i1; i++) c.lineTo(rays[i][2][0], rays[i][2][1]);
  c.stroke();
  c.strokeStyle = tint(col, 0.55, 0.4); c.lineWidth = Math.max(0.6, s * 0.007);
  c.beginPath(); c.moveTo(edge[0][0], edge[0][1]); smoothPath(c, edge, sh.spiky); c.stroke();
}

function membrane(c, col, path, gx0, gy0, gx1, gy1, a = 0.92) {
  const g = c.createLinearGradient(gx0, gy0, gx1, gy1);
  g.addColorStop(0, tint(col, -0.25, a)); g.addColorStop(0.6, tint(col, 0, a * 0.88)); g.addColorStop(1, tint(col, 0.25, a * 0.6));
  c.fillStyle = g; c.beginPath(); path(); c.fill();
  c.strokeStyle = tint(col, 0.5, 0.35); c.lineWidth = Math.max(0.5, c.lineWidth); c.stroke();
}

/* ---------- şapkalar ---------- */
function drawHat(c, kind, s) {
  if (kind === 'santa' || kind === 'bere') {
    const hw = s * 0.1, hh = s * 0.17;
    let g = c.createLinearGradient(-hw, 0, hw, 0); g.addColorStop(0, '#e2384a'); g.addColorStop(1, '#a8182b');
    c.fillStyle = g;
    c.beginPath(); c.moveTo(-hw, 0); c.quadraticCurveTo(-hw * 0.6, -hh * 0.9, hw * 0.9, -hh * 0.95); c.quadraticCurveTo(hw * 0.5, -hh * 0.4, hw, 0); c.closePath(); c.fill();
    c.fillStyle = '#fff';
    c.beginPath(); c.ellipse(0, 0, hw * 1.12, s * 0.028, 0, 0, Math.PI * 2); c.fill();
    c.beginPath(); c.arc(hw * 0.95, -hh * 0.95, s * 0.032, 0, Math.PI * 2); c.fill();
    return;
  }
  if (kind === 'crown') {
    const hw = s * 0.08, hh = s * 0.09;
    const g = c.createLinearGradient(0, -hh, 0, 0); g.addColorStop(0, '#ffe58a'); g.addColorStop(1, '#d9a21f');
    c.fillStyle = g;
    c.beginPath(); c.moveTo(-hw, 0); c.lineTo(-hw, -hh * 0.6); c.lineTo(-hw * 0.5, -hh * 0.25); c.lineTo(0, -hh); c.lineTo(hw * 0.5, -hh * 0.25); c.lineTo(hw, -hh * 0.6); c.lineTo(hw, 0); c.closePath(); c.fill();
    c.fillStyle = '#ff6fa8'; c.beginPath(); c.arc(0, -hh * 0.35, s * 0.013, 0, Math.PI * 2); c.fill();
    return;
  }
  // parti şapkası
  const hw = s * 0.085, hh = s * 0.2;
  const g = c.createLinearGradient(-hw, 0, hw, 0); g.addColorStop(0, '#ffe07a'); g.addColorStop(1, '#f0a92a');
  c.fillStyle = g; c.beginPath(); c.moveTo(-hw, 0); c.lineTo(hw, 0); c.lineTo(0, -hh); c.closePath(); c.fill();
  c.fillStyle = '#ff6fa8'; [0.3, 0.62].forEach(f => { c.beginPath(); c.arc(0, -hh * f, s * 0.016, 0, Math.PI * 2); c.fill(); });
  c.fillStyle = '#7fd1f7'; c.beginPath(); c.arc(0, -hh, s * 0.026, 0, Math.PI * 2); c.fill();
}

/* ---------- göz ---------- */
function drawEye(c, ex, ey, er, body, sleep, look = 0.12) {
  c.fillStyle = tint(body, -0.55, 0.55); c.beginPath(); c.arc(ex, ey, er * 1.18, 0, Math.PI * 2); c.fill();
  if (sleep) {
    c.fillStyle = tint(body, -0.1); c.beginPath(); c.arc(ex, ey, er, 0, Math.PI * 2); c.fill();
    c.strokeStyle = 'rgba(20,20,30,.75)'; c.lineWidth = er * 0.28;
    c.beginPath(); c.arc(ex, ey + er * 0.05, er * 0.75, 0.25, Math.PI - 0.25); c.stroke();
    return;
  }
  const g = c.createRadialGradient(ex, ey, 0, ex, ey, er);
  g.addColorStop(0, '#f6dc96'); g.addColorStop(0.55, '#b98232'); g.addColorStop(1, '#3a2408');
  c.fillStyle = g; c.beginPath(); c.arc(ex, ey, er, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#0a0a10'; c.beginPath(); c.arc(ex + er * look, ey + er * 0.03, er * 0.6, 0, Math.PI * 2); c.fill();
  c.fillStyle = 'rgba(255,255,255,.95)'; c.beginPath(); c.arc(ex + er * 0.32, ey - er * 0.3, er * 0.24, 0, Math.PI * 2); c.fill();
  c.fillStyle = 'rgba(255,255,255,.6)'; c.beginPath(); c.arc(ex - er * 0.12, ey + er * 0.32, er * 0.1, 0, Math.PI * 2); c.fill();
}

/* ---------- yandan görünüş ---------- */
function drawFish(c, o) {
  const { x, y, s, t, body, fin, tail } = o;
  const fa = o.facing || 1;
  const fl = o.flare || 0;
  const wave = o.sleep ? 0.35 : (o.speed || 1);
  const L = s * 0.5, H = s * 0.15 * (1 + (o.puff || 0) * 0.25), w = Math.sin(t * 4.2 * wave), w2 = Math.sin(t * 4.2 * wave - 1.2);
  const long = tail !== 'plakat';
  c.save(); c.translate(x, y); c.scale(fa, 1);
  if (o.tilt) c.rotate(o.tilt);
  c.lineJoin = 'round'; c.lineCap = 'round';

  // uzak karın yüzgeci
  c.strokeStyle = tint(fin, -0.35, 0.75); c.lineWidth = s * 0.024;
  c.beginPath(); c.moveTo(L * 0.24, H * 0.8); c.quadraticCurveTo(L * 0.26, H + s * 0.1, L * 0.12 + w2 * s * 0.012, H + s * 0.19); c.stroke();

  // kuyruk
  c.save(); c.translate(-L * 0.44, 0); c.rotate(w * 0.1 * (1 - fl * 0.7)); drawTail(c, tail, s, t, fin, wave, fl); c.restore();

  // anal yüzgeç
  const ad = (long ? 0.27 : 0.12) * (1 + fl * 0.35);
  c.lineWidth = s * 0.007;
  membrane(c, fin, () => {
    c.moveTo(L * 0.14, H * 0.7);
    c.bezierCurveTo(L * 0.05, H + s * ad * 0.7, -L * 0.2, H + s * ad + w2 * s * 0.02, -L * 0.46, H + s * ad * 0.8 + w2 * s * 0.02);
    c.quadraticCurveTo(-L * 0.52, H * 0.6, -L * 0.42, H * 0.15); c.closePath();
  }, 0, H * 0.5, 0, H + s * ad);
  c.strokeStyle = tint(fin, -0.4, 0.22); c.lineWidth = Math.max(0.5, s * 0.005);
  for (let i = 1; i < 7; i++) { const f = i / 7; c.beginPath(); c.moveTo(L * (0.12 - 0.54 * f), H * 0.7); c.lineTo(L * (0.05 - 0.55 * f) - f * s * 0.03, H + s * ad * (0.6 + 0.35 * f) + w2 * s * 0.02 * f); c.stroke(); }

  // sırt yüzgeci
  const dd = (long ? 0.21 : 0.09) * (1 + fl * 0.5);
  c.lineWidth = s * 0.007;
  membrane(c, fin, () => {
    c.moveTo(L * 0.04, -H * 0.86);
    c.bezierCurveTo(-L * 0.05, -H - s * dd * 0.8, -L * 0.25, -H - s * dd - w * s * 0.02, -L * 0.48, -H - s * dd * 0.55 - w * s * 0.02);
    c.quadraticCurveTo(-L * 0.52, -H * 0.5, -L * 0.42, -H * 0.2); c.closePath();
  }, 0, -H * 0.6, 0, -H - s * dd);
  c.strokeStyle = tint(fin, -0.4, 0.22); c.lineWidth = Math.max(0.5, s * 0.005);
  for (let i = 1; i < 6; i++) { const f = i / 6; c.beginPath(); c.moveTo(L * (0.02 - 0.44 * f), -H * 0.8); c.lineTo(L * (-0.05 - 0.42 * f), -H - s * dd * (0.75 + 0.2 * f) - w * s * 0.02 * f); c.stroke(); }

  // kabarınca görünen "sakal" (solungaç zarı)
  if (fl > 0.05) {
    c.fillStyle = tint(body, -0.6, 0.85 * fl);
    c.beginPath(); c.moveTo(L * 0.42, H * 0.35);
    for (let i = 0; i <= 8; i++) { const a = Math.PI * 0.15 + i / 8 * Math.PI * 0.7; c.lineTo(L * 0.3 + Math.cos(a) * L * 0.2, H * 0.45 + Math.sin(a) * H * (0.6 + fl * 0.5) * (i % 2 ? 1 : 0.82)); }
    c.closePath(); c.fill();
  }

  // gövde
  const bodyPath = () => {
    c.beginPath(); c.moveTo(L * 0.56, H * 0.1);
    c.bezierCurveTo(L * 0.54, -H * 1.02, -L * 0.15, -H * 1.18, -L * 0.47, -H * 0.36);
    c.quadraticCurveTo(-L * 0.53, 0, -L * 0.47, H * 0.36);
    c.bezierCurveTo(-L * 0.15, H * 1.12, L * 0.5, H * 1.06, L * 0.56, H * 0.1); c.closePath();
  };
  let g = c.createRadialGradient(L * 0.15, -H * 0.5, H * 0.1, 0, 0, L * 0.62);
  g.addColorStop(0, tint(body, 0.32)); g.addColorStop(0.35, tint(body, 0)); g.addColorStop(0.78, tint(body, -0.32)); g.addColorStop(1, tint(body, -0.55));
  bodyPath(); c.fillStyle = g; c.fill();
  c.save(); bodyPath(); c.clip();
  g = c.createLinearGradient(0, -H * 1.1, 0, H * 1.1);
  g.addColorStop(0, 'rgba(0,0,0,.2)'); g.addColorStop(0.45, 'rgba(0,0,0,0)'); g.addColorStop(0.78, 'rgba(255,255,255,.1)'); g.addColorStop(1, 'rgba(255,255,255,.22)');
  c.fillStyle = g; c.fillRect(-L, -H * 1.4, L * 2, H * 2.8);
  if (fl > 0.05) { c.fillStyle = `rgba(0,0,0,${0.15 * fl})`; c.fillRect(-L, -H * 1.4, L * 2, H * 2.8); }
  c.strokeStyle = 'rgba(255,255,255,.13)'; c.lineWidth = Math.max(0.5, s * 0.0045);
  const sc = H * 0.3;
  for (let r = -4; r <= 4; r++) for (let k = -7; k <= 4; k++) {
    const sx = k * sc * 0.82 + (r & 1 ? sc * 0.41 : 0), sy = r * sc * 0.58;
    if (sx > L * 0.2) continue;
    c.beginPath(); c.arc(sx, sy, sc * 0.5, Math.PI * 0.5, Math.PI * 1.5); c.stroke();
  }
  g = c.createLinearGradient(-L * 0.5, -H, L * 0.4, H);
  g.addColorStop(0, 'rgba(90,200,255,0)'); g.addColorStop(0.4 + Math.sin(t * 0.8) * 0.08, 'rgba(110,215,255,.22)');
  g.addColorStop(0.62 + Math.sin(t * 0.8) * 0.08, 'rgba(255,140,225,.16)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  c.globalCompositeOperation = 'screen'; c.fillStyle = g; c.fillRect(-L, -H * 1.4, L * 2, H * 2.8); c.globalCompositeOperation = 'source-over';
  g = c.createRadialGradient(L * 0.5, 0, 0, L * 0.5, 0, L * 0.32);
  g.addColorStop(0, 'rgba(0,0,0,.14)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, -H * 1.4, L, H * 2.8);
  c.strokeStyle = tint(body, -0.55, 0.45); c.lineWidth = s * 0.01;
  c.beginPath(); c.arc(L * (0.31 - fl * 0.03), H * 0.02, H * 0.82, -1.05, 1.05); c.stroke();
  c.strokeStyle = 'rgba(255,255,255,.22)'; c.lineWidth = s * 0.006;
  c.beginPath(); c.arc(L * 0.3, H * 0.02, H * 0.82, -1.0, 0.2); c.stroke();
  g = c.createLinearGradient(0, -H, 0, 0); g.addColorStop(0, 'rgba(255,255,255,.4)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  c.strokeStyle = g; c.lineWidth = s * 0.03; bodyPath(); c.stroke();
  c.restore();
  g = c.createRadialGradient(L * 0.1, -H * 0.52, 0, L * 0.1, -H * 0.52, L * 0.3);
  g.addColorStop(0, 'rgba(255,255,255,.5)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  c.fillStyle = g; c.beginPath(); c.ellipse(L * 0.08, -H * 0.5, L * 0.32, H * 0.3, -0.08, 0, Math.PI * 2); c.fill();

  // yakın karın yüzgeci
  g = c.createLinearGradient(0, H * 0.8, 0, H + s * 0.2);
  g.addColorStop(0, tint(fin, -0.1, 0.95)); g.addColorStop(1, tint(fin, 0.4, 0.6));
  c.strokeStyle = g; c.lineWidth = s * 0.026;
  c.beginPath(); c.moveTo(L * 0.2, H * 0.82); c.quadraticCurveTo(L * 0.18, H + s * 0.1, L * 0.02 + w * s * 0.014, H + s * 0.2); c.stroke();

  // göğüs yüzgeci
  c.save(); c.translate(L * 0.2, H * 0.28); c.rotate(0.5 + Math.sin(t * 8) * 0.35);
  g = c.createLinearGradient(0, 0, -s * 0.1, 0); g.addColorStop(0, tint(fin, 0.2, 0.55)); g.addColorStop(1, tint(fin, 0.6, 0.15));
  c.fillStyle = g; c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(-s * 0.05, -s * 0.04, -s * 0.1, -s * 0.01); c.quadraticCurveTo(-s * 0.06, s * 0.03, 0, 0); c.fill();
  c.restore();

  drawEye(c, L * 0.37, -H * 0.2, s * 0.15 * 0.29, body, o.sleep);
  if (o.blush) {
    g = c.createRadialGradient(L * 0.3, H * 0.32, 0, L * 0.3, H * 0.32, H * 0.3);
    g.addColorStop(0, 'rgba(255,110,150,.6)'); g.addColorStop(1, 'rgba(255,110,150,0)');
    c.fillStyle = g; c.beginPath(); c.arc(L * 0.3, H * 0.32, H * 0.3, 0, Math.PI * 2); c.fill();
  }
  c.strokeStyle = tint(body, -0.6, 0.8); c.lineWidth = s * 0.011;
  c.beginPath(); c.moveTo(L * 0.555, H * 0.02); c.quadraticCurveTo(L * 0.52, H * 0.16, L * 0.45, H * 0.12); c.stroke();

  if (o.hat) { c.save(); c.translate(L * 0.2, -H * 0.95); c.rotate(-0.25); drawHat(c, o.hat, s); c.restore(); }
  c.restore();
}

/* ---------- önden görünüş (dönüşün ortası) ---------- */
function drawFishFront(c, o) {
  const { x, y, s, t, body, fin, tail } = o;
  const fl = o.flare || 0;
  const wave = o.sleep ? 0.35 : (o.speed || 1);
  const H = s * 0.15 * (1 + (o.puff || 0) * 0.25), BW = s * 0.105, w = Math.sin(t * 4.2 * wave);
  const long = tail !== 'plakat';
  c.save(); c.translate(x, y);
  if (o.tilt) c.rotate(o.tilt * 0.5);
  c.lineJoin = 'round'; c.lineCap = 'round';

  // arkada kalan kuyruk yelpazesi
  const tr = { halfmoon: [0.2, 0.44], veil: [0.17, 0.5], crowntail: [0.19, 0.44], plakat: [0.11, 0.25] }[tail] || [0.2, 0.44];
  const rx = s * tr[0] * (1 + fl * 0.3), ry = s * tr[1] * (1 + fl * 0.12), oy = tail === 'veil' ? s * 0.1 : 0;
  let g = c.createRadialGradient(0, oy, s * 0.03, 0, oy, ry);
  g.addColorStop(0, tint(fin, -0.4, 0.95)); g.addColorStop(0.7, tint(fin, -0.15, 0.85)); g.addColorStop(1, tint(fin, 0.2, 0.55));
  c.fillStyle = g; c.beginPath();
  const N = 28;
  for (let i = 0; i <= N; i++) {
    const a = i / N * Math.PI * 2, spike = tail === 'crowntail' ? (i % 2 ? 1 : 0.84) : 1;
    const px = Math.cos(a) * rx * spike + Math.sin(t * 3 * wave + i) * s * 0.008, py = oy + Math.sin(a) * ry * spike;
    i ? c.lineTo(px, py) : c.moveTo(px, py);
  }
  c.closePath(); c.fill();
  c.strokeStyle = tint(fin, -0.5, 0.25); c.lineWidth = Math.max(0.5, s * 0.005);
  for (let i = 0; i < 18; i++) { const a = i / 18 * Math.PI * 2; c.beginPath(); c.moveTo(0, oy); c.lineTo(Math.cos(a) * rx * 0.94, oy + Math.sin(a) * ry * 0.94); c.stroke(); }

  // sırt yüzgeci (yukarı ince)
  const dd = (long ? 0.21 : 0.09) * (1 + fl * 0.5);
  c.lineWidth = s * 0.006;
  membrane(c, fin, () => {
    c.moveTo(-BW * 0.35, -H * 0.8);
    c.quadraticCurveTo(-BW * 0.5 + w * s * 0.01, -H - s * dd * 0.7, w * s * 0.015, -H - s * dd);
    c.quadraticCurveTo(BW * 0.5 + w * s * 0.01, -H - s * dd * 0.7, BW * 0.35, -H * 0.8); c.closePath();
  }, 0, -H, 0, -H - s * dd);
  // anal yüzgeç (aşağı geniş)
  const ad = (long ? 0.27 : 0.12) * (1 + fl * 0.35);
  membrane(c, fin, () => {
    c.moveTo(-BW * 0.55, H * 0.6);
    c.quadraticCurveTo(-BW * 1.1, H + s * ad * 0.8, -w * s * 0.01, H + s * ad);
    c.quadraticCurveTo(BW * 1.1, H + s * ad * 0.8, BW * 0.55, H * 0.6); c.closePath();
  }, 0, H, 0, H + s * ad);
  // karın yüzgeçleri
  c.strokeStyle = tint(fin, 0, 0.9); c.lineWidth = s * 0.022;
  [-1, 1].forEach(k => { c.beginPath(); c.moveTo(k * BW * 0.45, H * 0.8); c.quadraticCurveTo(k * BW * 0.9, H + s * 0.1, k * BW * 1.2 + w * s * 0.01, H + s * 0.19); c.stroke(); });

  // sakal
  if (fl > 0.05) {
    c.fillStyle = tint(body, -0.6, 0.85 * fl);
    c.beginPath(); c.ellipse(0, H * 0.55, BW * (1.2 + fl * 0.5), H * (0.45 + fl * 0.35), 0, 0, Math.PI); c.fill();
  }
  // gövde
  g = c.createRadialGradient(-BW * 0.35, -H * 0.45, H * 0.05, 0, 0, H * 1.25);
  g.addColorStop(0, tint(body, 0.35)); g.addColorStop(0.4, tint(body, 0)); g.addColorStop(0.85, tint(body, -0.35)); g.addColorStop(1, tint(body, -0.55));
  c.fillStyle = g; c.beginPath(); c.ellipse(0, 0, BW, H * 1.05, 0, 0, Math.PI * 2); c.fill();
  if (fl > 0.05) { c.fillStyle = `rgba(0,0,0,${0.15 * fl})`; c.beginPath(); c.ellipse(0, 0, BW, H * 1.05, 0, 0, Math.PI * 2); c.fill(); }
  g = c.createRadialGradient(-BW * 0.3, -H * 0.55, 0, -BW * 0.3, -H * 0.55, BW * 0.7);
  g.addColorStop(0, 'rgba(255,255,255,.55)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  c.fillStyle = g; c.beginPath(); c.ellipse(-BW * 0.25, -H * 0.5, BW * 0.55, H * 0.35, 0, 0, Math.PI * 2); c.fill();

  // göğüs yüzgeçleri (iki yana çırpar)
  [-1, 1].forEach(k => {
    c.save(); c.translate(k * BW * 0.85, H * 0.25); c.rotate(k * (0.9 + Math.sin(t * 8 + k) * 0.35));
    g = c.createLinearGradient(0, 0, 0, s * 0.1); g.addColorStop(0, tint(fin, 0.2, 0.6)); g.addColorStop(1, tint(fin, 0.6, 0.15));
    c.fillStyle = g; c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(-s * 0.035, s * 0.05, 0, s * 0.1); c.quadraticCurveTo(s * 0.035, s * 0.05, 0, 0); c.fill();
    c.restore();
  });

  // gözler (iki yanda)
  const er = s * 0.15 * 0.27;
  drawEye(c, -BW * 0.7, -H * 0.22, er, body, o.sleep, 0.18);
  drawEye(c, BW * 0.7, -H * 0.22, er, body, o.sleep, -0.18);
  if (o.blush) [-1, 1].forEach(k => {
    g = c.createRadialGradient(k * BW * 0.62, H * 0.25, 0, k * BW * 0.62, H * 0.25, H * 0.28);
    g.addColorStop(0, 'rgba(255,110,150,.6)'); g.addColorStop(1, 'rgba(255,110,150,0)');
    c.fillStyle = g; c.beginPath(); c.arc(k * BW * 0.62, H * 0.25, H * 0.28, 0, Math.PI * 2); c.fill();
  });
  // ağız
  c.fillStyle = tint(body, -0.65, 0.9);
  c.beginPath(); c.ellipse(0, H * 0.3, BW * 0.2, H * 0.09, 0, 0, Math.PI * 2); c.fill();
  c.strokeStyle = tint(body, 0.3, 0.6); c.lineWidth = s * 0.006;
  c.beginPath(); c.ellipse(0, H * 0.26, BW * 0.24, H * 0.1, 0, Math.PI * 1.1, Math.PI * 1.9); c.stroke();

  if (o.hat) { c.save(); c.translate(0, -H * 1.02); drawHat(c, o.hat, s); c.restore(); }
  c.restore();
}

/* ---------- dönüşe göre doğru görünüşü seç ---------- */
const _fishOff = document.createElement('canvas');
function drawFishAny(c, o) {
  const a = Math.min(1, Math.abs(o.facing || 0)), sgn = Math.sign(o.facing) || 1;
  if (a >= 0.6) { drawFish(c, Object.assign({}, o, { facing: sgn * (0.55 + (a - 0.6) / 0.4 * 0.45) })); return; }
  const sideA = smooth(0.12, 0.6, a), frontA = 1 - sideA;
  const m = c.getTransform ? c.getTransform() : { a: 1, b: 0 };
  const k = Math.max(1, Math.hypot(m.a, m.b)), box = o.s * 1.9, px = Math.ceil(box * k);
  if (_fishOff.width !== px) { _fishOff.width = px; _fishOff.height = px; }
  const oc = _fishOff.getContext('2d');
  const paint = (fn, opts, alpha) => {
    if (alpha < 0.02) return;
    oc.setTransform(1, 0, 0, 1, 0, 0); oc.clearRect(0, 0, px, px);
    oc.setTransform(k, 0, 0, k, 0, 0);
    fn(oc, Object.assign({}, opts, { x: box / 2, y: box / 2 }));
    c.save(); c.globalAlpha *= alpha; c.drawImage(_fishOff, o.x - box / 2, o.y - box / 2, box, box); c.restore();
  };
  paint(drawFish, Object.assign({}, o, { facing: sgn * (0.3 + a / 0.6 * 0.25) }), sideA);
  paint(drawFishFront, o, frontA);
}
