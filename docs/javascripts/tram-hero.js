// 3D scene on the home page: a DVG NF4 and a Ruhrbahn NF4 drive into a stop,
// wait there, then do a lap of their loop and come back.
//
// The trams are built procedurally with three.js (shell, doors, bogies,
// pantograph, bellows); no model files are loaded. three.js is vendored in
// docs/assets/three (MIT), so nothing is requested from a CDN.
import * as THREE from '../assets/three/three.module.min.js';
import { OrbitControls } from '../assets/three/OrbitControls.js';
import { RoomEnvironment } from '../assets/three/RoomEnvironment.js';
import { mergeGeometries } from '../assets/three/BufferGeometryUtils.js';
import { RoundedBoxGeometry } from '../assets/three/RoundedBoxGeometry.js';

let scene; // created in init(), used by the Tram constructor

const V3 = THREE.Vector3, PI = Math.PI;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const wrapAng = a => { while (a > PI) a -= 2 * PI; while (a < -PI) a += 2 * PI; return a; };
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const smooth = t => t * t * (3 - 2 * t);
function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

// ───────────────────────── data ─────────────────────────
const C = { HW: 1.15, yb: 0.24, yt: 3.28, rt: 0.30, rb: 0.05, J: 0.55, ML: 9.16, midBogie: 6.0, wheelR: 0.30,
  winY: [1.30, 2.48], doorY: [0.28, 2.50], wire: 5.6 };

const MID_LAYOUT = [['win', 0.40, 1.95], ['win', 2.12, 3.62], ['door', 3.88, 5.28], ['win', 5.54, 7.04], ['win', 7.21, 8.76]];
const VARIANTS = {
  dvg: {
    key: 'dvg', name: 'DVG NF4', city: 'Duisburg', operator: 'Duisburger Verkehrsgesellschaft', designation: 'GT8ND-NF4',
    total: 33.32, EL: 11.525, gauge: 1.435, insideFrames: true, driveWB: 1.8, runWB: 1.8, endBogie: 4.1,
    endLayout: [['win', 0.2, 1.30], ['cab', 1.55, 2.25], ['win', 2.75, 4.25], ['win', 4.42, 5.92], ['door', 6.10, 7.50], ['win', 7.70, 9.15], ['door', 9.35, 10.75]],
    midLayout: MID_LAYOUT,
    bands: [[0.64, '#cf1f26'], [1.22, '#f1f1ee'], [2.62, '#16171a'], [2.90, '#f1f1ee'], [99, '#cf1f26']],
    door: '#ecedea', doorGlass: [1.22, 2.30], bellows: '#8e949a', roofKit: '#a3a9af', seat: '#c0141b', pole: '#c5c9ce',
    interior: '#d9dbd8', floor: '#4a4e54', number: '2001', numberColor: '#17181b', logo: 'DVG ///',
    dest: ['901', 'Obermarxloh Schleife'], decals: true, chip: '#d2232a', doorsPerSide: 5,
    built: '2020 – 2025', fleet: '2001–2054', capacity: '64 + 6 seats · 136 standing'
  },
  rb: {
    key: 'rb', name: 'Ruhrbahn NF4', city: 'Essen / Mülheim', operator: 'Ruhrbahn', designation: 'M8D-NF4',
    total: 30.0, EL: 9.87, gauge: 1.0, insideFrames: false, driveWB: 1.8, runWB: 1.6, endBogie: 3.9,
    endLayout: [['win', 0.2, 1.30], ['cab', 1.55, 2.25], ['win', 2.75, 4.25], ['win', 4.42, 5.92], ['door', 6.10, 7.50], ['win', 7.70, 9.40]],
    midLayout: MID_LAYOUT,
    bands: [[1.22, '#ecb400'], [2.60, '#16171a'], [99, '#ecb400']],
    door: '#ecb400', doorGlass: [0.74, 2.32], bellows: '#7c8288', roofKit: '#5c6268', seat: '#34425e', pole: '#ecb400',
    interior: '#d6d8d6', floor: '#3f4349', number: '1058', numberColor: '#ffffff', logo: null,
    dest: ['107', 'Helenenstr.'], decals: false, chip: '#ecb400', doorsPerSide: 3,
    built: '2021 – 2025', fleet: '1051–1082', capacity: '171 passengers'
  }
};

// ───────────────────────── helpers ─────────────────────────
const glow = { value: 0 }; // interior glow (night)
const allMats = [];
function mat(type, p) { const m = new THREE[type](p); allMats.push(m); return m; }
function mesh(geo, m, cast = true, recv = true) { const o = new THREE.Mesh(geo, m); o.castShadow = cast; o.receiveShadow = recv; return o; }
function boxGeo(w, h, d, x = 0, y = 0, z = 0) { return new THREE.BoxGeometry(w, h, d).translate(x, y, z); }
const _up = new V3(0, 1, 0);
function setRod(o, a, b) { const d = new V3().subVectors(b, a); const l = d.length(); o.position.copy(a).addScaledVector(d, 0.5); o.scale.set(1, Math.max(l, 1e-4), 1); o.quaternion.setFromUnitVectors(_up, d.normalize()); }
function rod(r, m, seg = 10) { return mesh(new THREE.CylinderGeometry(r, r, 1, seg), m); }
function canvasTex(w, h, draw, srgb = true) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); draw(g, w, h);
  const t = new THREE.CanvasTexture(c); if (srgb) t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}
const FONT = '"Barlow Condensed", "Arial Narrow", Arial, sans-serif';

// ───────────────────────── body shell ─────────────────────────
function hwAt(y) {
  const { HW, yb, yt, rt, rb } = C;
  if (y > yt - rt) { const d = y - (yt - rt); return HW - rt + Math.sqrt(Math.max(0, rt * rt - d * d)); }
  if (y < yb + rb) { const d = yb + rb - y; return HW - rb + Math.sqrt(Math.max(0, rb * rb - d * d)); }
  return HW;
}
function lerpTab(tab, y) {
  if (y <= tab[0][0]) return tab[0][1];
  for (let i = 1; i < tab.length; i++) if (y <= tab[i][0]) { const [y0, v0] = tab[i - 1], [y1, v1] = tab[i]; return v0 + (v1 - v0) * (y - y0) / (y1 - y0); }
  return tab[tab.length - 1][1];
}
// Side profile of the cab (from the DVG side drawing): set-back of the surface behind the bumper tip at height y.
// The bumper ("small nose") is the front-most part; above it the face steps back, then the windscreen leans back to the roof cap.
const NOSE_TOP = 2.90;
const NOSE_S = [[0.24, 0.06], [0.27, 0.018], [0.31, 0.0], [0.80, 0.0], [0.85, 0.02], [0.89, 0.08], [0.92, 0.19], [0.95, 0.25], [1.05, 0.31], [1.20, 0.39], [1.30, 0.42], [NOSE_TOP, 0.79]];
function noseS(y) { if (y <= NOSE_TOP) return lerpTab(NOSE_S, y); const u = Math.min(1, (y - NOSE_TOP) / (C.yt - NOSE_TOP)); return 0.79 + 0.08 * u + 0.62 * (1 - Math.sqrt(Math.max(0, 1 - u * u))); }
// Plan-view depth of the rounded front
function noseD(y) { if (y < NOSE_TOP) return lerpTab([[0.24, 0.40], [0.92, 0.42], [1.30, 0.44], [NOSE_TOP, 0.48]], y); const u = Math.min(1, (y - NOSE_TOP) / (C.yt - NOSE_TOP)); return 0.48 + 0.36 * u * u; }
// The cab narrows towards the front: half-width factor by distance from the tip
// Body width by distance from the tip: 2.30 m behind the driver's door, 2.20 m at its front edge, 1.90 m at the front face
const TAPER = [[0, 1.90], [0.45, 1.90], [1.55, 2.20], [2.25, 2.30]];
function taperAt(L, x) { const d = L / 2 - x; return d >= 2.25 ? 1 : lerpTab(TAPER, Math.max(0, d)) / 2.30; }
const P_NOSE = 2.6;
function frontX(L, y, z) {
  const hw = hwAt(y), d = noseD(y), x0 = L / 2 - noseS(y) - d;
  let x = L / 2 - noseS(y), tz = taperAt(L, x);
  for (let i = 0; i < 5; i++) {
    const u = Math.min(1, Math.abs(z) / (hw * tz)), sn = Math.pow(u, P_NOSE / 2), cs = Math.sqrt(Math.max(0, 1 - sn * sn));
    x = x0 + d * Math.pow(cs, 2 / P_NOSE); tz = taperAt(L, x);
  }
  return x;
}
function frontFrame(L, y, z) {
  const e = 0.01, P = (yy, zz) => new V3(frontX(L, yy, zz), yy, zz);
  const dy = P(y + e, z).sub(P(y - e, z)), dz = P(y, z + e).sub(P(y, z - e));
  return { p: P(y, z), n: new V3().crossVectors(dy, dz).normalize() };
}
const _zAxis = new V3(0, 0, 1);
function onFront(L, o, y, z, off = 0.005) { const f = frontFrame(L, y, z); o.position.copy(f.p).addScaledVector(f.n, off); o.quaternion.setFromUnitVectors(_zAxis, f.n); return o; }
function frontPt(L, y, z, off) { const f = frontFrame(L, y, z); return f.p.addScaledVector(f.n, off); }

// Front face zones: windscreen (top ~20 % blacked out, with a cut-out for the display), black lamp band, paint
function frontClass(y, phi, z) {
  const a = Math.abs(phi), PW = 1.0;
  if (a < PW + 0.10 && y > 2.57 && y < 2.95) return (a < PW && Math.abs(z) < 0.70 && y > 2.62 && y < 2.84) ? 'glass' : 'trim';
  if (y > 1.24 && y < 2.57 && a < PW) return 'glass';
  if (y > 0.93 && y < 2.95 && a < PW + 0.10) return 'trim';
  if (y > 0.93 && y < 1.24 && a < 1.30) return 'trim';
  return 'paint';
}
function bandIndex(bands, y) { for (let i = 0; i < bands.length; i++) if (y < bands[i][0]) return i; return bands.length - 1; }
function buildRows(bands, extra) {
  const set = [C.yb, C.yb + 0.006, C.yb + 0.018, C.yb + 0.034, C.yb + C.rb, 0.31, 0.36, 0.42, 0.54, 0.66, 0.80, 0.85, 0.89, 0.92, 0.93, 0.95, 1.05, 1.12, 1.20, 1.24, 1.30, 1.60, 1.90, 2.20, 2.48, 2.57, 2.62, 2.75, 2.84, 2.90, 2.96, C.yt - C.rt];
  for (let i = 1; i <= 12; i++) set.push(C.yt - C.rt + C.rt * Math.sin(i / 12 * PI / 2));
  extra.forEach(y => set.push(y));
  bands.forEach(b => { if (b[0] < C.yt) set.push(b[0]); });
  const ys = [...new Set(set.map(v => +v.toFixed(5)))].filter(y => y >= C.yb - 1e-9 && y <= C.yt + 1e-9).sort((a, b) => a - b);
  const rows = [];
  for (const y of ys) {
    const bi = bands.findIndex(b => Math.abs(b[0] - y) < 1e-6);
    if (bi >= 0 && bi < bands.length - 1) { rows.push({ y, band: bi }); rows.push({ y, band: bi + 1 }); }
    else rows.push({ y, band: bandIndex(bands, y) });
  }
  return rows;
}
/** Builds a car body as horizontal slices lofted together (with nose or flat ends). */
function buildShell({ L, nose, bands, openings }) {
  const rows = buildRows(bands, openings.flatMap(o => [o.y0, o.y1]));
  const nF = nose ? 56 : 14, nR = 14, pF = nose ? P_NOSE : 8, pR = 8, Dr = 0.07;
  const S = y => nose ? noseS(y) : 0, D = y => nose ? noseD(y) : Dr, TP = x => nose ? taperAt(L, x) : 1;
  const extraX = nose ? [0.45, 0.8, 1.05, 1.3, 1.55, 1.9, 2.25].map(d => L / 2 - d) : [];
  const brks = side => [...new Set(openings.filter(o => o.side === 0 || o.side === side).flatMap(o => [o.x0, o.x1]).concat(extraX).map(v => +v.toFixed(4)))].sort((a, b) => a - b);
  const cols = [];
  for (let i = 0; i < nR; i++) cols.push({ t: 'R', phi: -PI / 2 + PI * i / (nR - 1), sn: i === 0, sp: i === nR - 1 });
  brks(1).forEach(x => cols.push({ t: 'S', x, sp: true }));
  for (let i = 0; i < nF; i++) cols.push({ t: 'F', phi: -PI / 2 + PI * i / (nF - 1), f: true, sp: i === 0, sn: i === nF - 1 });
  brks(-1).reverse().forEach(x => cols.push({ t: 'S', x, sn: true }));
  const Mc = cols.length, R = rows.length;
  const pos = [], col = [];
  const bandCols = bands.map(b => new THREE.Color(b[1]));
  const pw = (v, e) => Math.pow(Math.abs(v), e);
  for (let k = 0; k < R; k++) {
    const y = rows[k].y, hw = hwAt(y), s = S(y), d = D(y), xr0 = -L / 2 + Dr, xf0 = L / 2 - s - d, c = bandCols[rows[k].band];
    for (let j = 0; j < Mc; j++) {
      const q = cols[j]; let x, z;
      if (q.t === 'R') { const cs = Math.cos(q.phi), sn = Math.sin(q.phi); x = -L / 2 + Dr - Dr * pw(cs, 2 / pR); z = hw * Math.sign(sn) * pw(sn, 2 / pR); }
      else if (q.t === 'F') { const cs = Math.cos(q.phi), sn = Math.sin(q.phi); x = xf0 + d * pw(cs, 2 / pF); z = -hw * TP(x) * Math.sign(sn) * pw(sn, 2 / pF); }
      else { x = clamp(q.x, xr0, xf0); z = (q.sp ? hw : -hw) * TP(x); }
      pos.push(x, y, z); col.push(c.r, c.g, c.b);
    }
  }
  const idx = { paint: [], glass: [], trim: [] };
  for (let k = 0; k < R - 1; k++) {
    const y0 = rows[k].y, y1 = rows[k + 1].y; if (y1 - y0 < 1e-7) continue;
    const cy = (y0 + y1) / 2;
    for (let j = 0; j < Mc; j++) {
      const j1 = (j + 1) % Mc, A = cols[j], B = cols[j1];
      const a = k * Mc + j, b = k * Mc + j1, c = (k + 1) * Mc + j, d = (k + 1) * Mc + j1;
      let target = 'paint';
      if ((A.sp && B.sp) || (A.sn && B.sn)) {
        const side = (A.sp && B.sp) ? 1 : -1;
        const cx = (pos[a * 3] + pos[b * 3] + pos[c * 3] + pos[d * 3]) / 4;
        const o = openings.find(o => (o.side === 0 || o.side === side) && cx > o.x0 && cx < o.x1 && cy > o.y0 && cy < o.y1);
        if (o) { if (o.kind === 'hole') continue; target = 'glass'; }
      } else if (A.f && B.f && nose) {
        const cx = (pos[a * 3] + pos[b * 3] + pos[c * 3] + pos[d * 3]) / 4, cz = (pos[a * 3 + 2] + pos[b * 3 + 2] + pos[c * 3 + 2] + pos[d * 3 + 2]) / 4;
        target = frontClass(cy, (A.phi + B.phi) / 2, cz);
        if (target === 'paint') { const side = cz > 0 ? 1 : -1; if (openings.some(o => o.kind === 'glass' && (o.side === 0 || o.side === side) && cx > o.x0 && cx < o.x1 && cy > o.y0 && cy < o.y1)) target = 'glass'; }
      }
      idx[target].push(a, b, d, a, d, c);
    }
  }
  // roof cap
  const top = R - 1, ring = [], capIdx = [];
  for (let j = 0; j < Mc; j++) { const i = top * Mc + j, x = pos[i * 3], z = pos[i * 3 + 2], l = ring[ring.length - 1]; if (!l || Math.hypot(l.x - x, l.y - z) > 1e-4) ring.push(new THREE.Vector2(x, z)); }
  if (ring.length > 2 && ring[0].distanceTo(ring[ring.length - 1]) < 1e-4) ring.pop();
  const base = pos.length / 3, rc = bandCols[rows[top].band];
  ring.forEach(p => { pos.push(p.x, C.yt, p.y); col.push(rc.r, rc.g, rc.b); });
  for (const [i0, i1, i2] of THREE.ShapeUtils.triangulateShape(ring, [])) {
    const p0 = ring[i0], p1 = ring[i1], p2 = ring[i2];
    const ny = (p1.y - p0.y) * (p2.x - p0.x) - (p1.x - p0.x) * (p2.y - p0.y);
    if (ny >= 0) capIdx.push(base + i0, base + i1, base + i2); else capIdx.push(base + i0, base + i2, base + i1);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  geo.setIndex([...idx.paint, ...idx.glass, ...idx.trim, ...capIdx]);
  geo.computeVertexNormals();
  const nrm = geo.attributes.normal;
  for (let k = 0; k < R - 1; k++) if (rows[k + 1].y - rows[k].y < 1e-7) for (let j = 0; j < Mc; j++) {
    const a = k * Mc + j, b = (k + 1) * Mc + j;
    const nx = nrm.getX(a) + nrm.getX(b), ny = nrm.getY(a) + nrm.getY(b), nz = nrm.getZ(a) + nrm.getZ(b), l = Math.hypot(nx, ny, nz) || 1;
    nrm.setXYZ(a, nx / l, ny / l, nz / l); nrm.setXYZ(b, nx / l, ny / l, nz / l);
  }
  const make = arr => { if (!arr.length) return null; const g = new THREE.BufferGeometry(); g.setAttribute('position', geo.attributes.position); g.setAttribute('normal', nrm); g.setAttribute('color', geo.attributes.color); g.setIndex(arr); g.computeBoundingSphere(); return g; };
  return { paint: make([...idx.paint, ...capIdx]), glass: make(idx.glass), trim: make(idx.trim) };
}

// ───────────────────────── textures ─────────────────────────
function destTexture(line, text) {
  return canvasTex(1024, 168, (g, w, h) => {
    g.fillStyle = '#060606'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#ffa21a'; g.textBaseline = 'middle';
    const mg = 84; g.font = `700 132px ${FONT}`; g.fillText(line, mg, h / 2 + 8);
    const lw = g.measureText(line).width + mg;
    let fs = 96; g.font = `600 ${fs}px ${FONT}`;
    while (g.measureText(text).width > w - lw - 40 - mg && fs > 40) { fs -= 4; g.font = `600 ${fs}px ${FONT}`; }
    g.textAlign = 'center'; g.fillText(text, lw + 30 + (w - lw - 30 - mg) / 2, h / 2 + 6);
    g.fillStyle = 'rgba(0,0,0,0.55)';
    for (let x = 0; x < w; x += 6) g.fillRect(x, 0, 2, h);
    for (let y = 0; y < h; y += 6) g.fillRect(0, y, w, 2);
  });
}
function textTex(str, { w = 512, h = 128, color = '#fff', weight = 700, italic = false, align = 'center' } = {}) {
  return canvasTex(w, h, (g) => {
    let fs = h * 0.86; g.font = `${italic ? 'italic ' : ''}${weight} ${fs}px ${FONT}`;
    while (g.measureText(str).width > w * 0.96 && fs > 10) { fs -= 2; g.font = `${italic ? 'italic ' : ''}${weight} ${fs}px ${FONT}`; }
    g.fillStyle = color; g.textBaseline = 'middle'; g.textAlign = align;
    g.fillText(str, align === 'center' ? w / 2 : 4, h / 2 + 2);
  });
}
function decalTex(kind, wM, hM) {
  const W = 1024, H = Math.round(W * hM / wM);
  return canvasTex(W, H, (g, w, h) => {
    const red = '#cf1f26';
    const bars = (x, y, s) => { g.fillStyle = red; for (let i = 0; i < 3; i++) { g.beginPath(); const bx = x + i * s * 0.42; g.moveTo(bx + s * 0.28, y); g.lineTo(bx + s * 0.5, y); g.lineTo(bx + s * 0.22, y + s); g.lineTo(bx, y + s); g.closePath(); g.fill(); } };
    if (kind === 'logo') {
      g.fillStyle = red; g.textBaseline = 'middle'; g.font = `italic 700 ${h * 0.62}px ${FONT}`; g.fillText('DVG', w * 0.06, h * 0.52);
      const tw = g.measureText('DVG').width; bars(w * 0.06 + tw + h * 0.12, h * 0.22, h * 0.6); return;
    }
    const title = kind === 'komfort' ? 'DEINE NEUE KOMFORTZONE' : 'ICH BIN DIE NEUE';
    const sub = kind === 'komfort' ? 'Mehr Platz. Mehr Klima. Mehr WLAN. Mehr Duisburg.' : 'Mehr Platz. Mehr Klima. Mehr WLAN.';
    const s = h * 0.62; bars(w * 0.03, h * 0.08, s);
    g.fillStyle = red; g.textBaseline = 'alphabetic';
    let fs = h * 0.46; g.font = `italic 700 ${fs}px ${FONT}`;
    const x0 = w * 0.03 + s * 1.25;
    while (g.measureText(title).width > w - x0 - 10) { fs -= 2; g.font = `italic 700 ${fs}px ${FONT}`; }
    g.fillText(title, x0, h * 0.50);
    g.fillStyle = '#4f5359'; g.font = `500 ${h * 0.22}px ${FONT}`; g.fillText(sub, x0 + 4, h * 0.80);
  });
}
const grillTex = canvasTex(256, 64, (g, w, h) => { g.fillStyle = '#5a5f65'; g.fillRect(0, 0, w, h); g.fillStyle = '#2b2e32'; for (let x = 4; x < w; x += 8) g.fillRect(x, 6, 4, h - 12); });

// ───────────────────────── materials per variant ─────────────────────────
function makeMats(V) {
  const interior = new THREE.Color(V.interior);
  const paint = mat('MeshPhysicalMaterial', { vertexColors: true, roughness: 0.38, metalness: 0, clearcoat: 0.4, clearcoatRoughness: 0.22, side: THREE.DoubleSide });
  paint.onBeforeCompile = sh => {
    sh.uniforms.uInterior = { value: interior }; sh.uniforms.uGlow = glow;
    sh.fragmentShader = 'uniform vec3 uInterior;\nuniform float uGlow;\n' + sh.fragmentShader
      .replace('#include <color_fragment>', '#include <color_fragment>\n if(!gl_FrontFacing){ diffuseColor.rgb = uInterior; }')
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n if(!gl_FrontFacing){ totalEmissiveRadiance += uInterior * uGlow; }');
  };
  const m = {
    paint,
    glass: mat('MeshPhysicalMaterial', { color: 0x0f151b, roughness: 0.04, metalness: 0.1, transparent: true, opacity: 0.58, side: THREE.DoubleSide, depthWrite: false, envMapIntensity: 1.4 }),
    trim: mat('MeshStandardMaterial', { color: 0x121315, roughness: 0.42, metalness: 0.15, side: THREE.DoubleSide }),
    door: mat('MeshPhysicalMaterial', { color: V.door, roughness: 0.38, clearcoat: 0.4, clearcoatRoughness: 0.22 }),
    rubber: mat('MeshStandardMaterial', { color: 0x0d0d0e, roughness: 0.8 }),
    button: mat('MeshStandardMaterial', { color: 0x2fa84f, emissive: 0x2fa84f, emissiveIntensity: 0.4, roughness: 0.4 }),
    bellows: mat('MeshStandardMaterial', { color: V.bellows, roughness: 0.88, side: THREE.DoubleSide }),
    roofKit: mat('MeshStandardMaterial', { color: V.roofKit, roughness: 0.55, metalness: 0.25 }),
    grill: mat('MeshStandardMaterial', { map: grillTex, roughness: 0.7, metalness: 0.3 }),
    seat: mat('MeshStandardMaterial', { color: V.seat, roughness: 0.9, emissive: V.seat, emissiveIntensity: 0 }),
    pole: mat('MeshStandardMaterial', { color: V.pole, roughness: 0.35, metalness: 0.25, emissive: V.pole, emissiveIntensity: 0 }),
    inner: mat('MeshStandardMaterial', { color: V.interior, roughness: 0.8, emissive: V.interior, emissiveIntensity: 0 }),
    floor: mat('MeshStandardMaterial', { color: V.floor, roughness: 0.9, emissive: V.floor, emissiveIntensity: 0 }),
    stripe: mat('MeshStandardMaterial', { color: 0xf0c419, roughness: 0.6 }),
    light: mat('MeshStandardMaterial', { color: 0xffffff, emissive: 0xfff3df, emissiveIntensity: 0.35 }),
    screen: mat('MeshStandardMaterial', { color: 0x070b10, emissive: 0x2f6fc4, emissiveIntensity: 0.18, roughness: 0.25 }),
    frame: mat('MeshStandardMaterial', { color: 0x2a2d31, roughness: 0.6, metalness: 0.35 }),
    dark: mat('MeshStandardMaterial', { color: 0x3a3e44, roughness: 0.55, metalness: 0.5 }),
    spring: mat('MeshStandardMaterial', { color: 0x1b1c1e, roughness: 0.7 }),
    wheel: mat('MeshStandardMaterial', { color: 0x9da3aa, roughness: 0.32, metalness: 0.9 }),
    insulator: mat('MeshStandardMaterial', { color: 0x6c7a6a, roughness: 0.5 }),
    copper: mat('MeshStandardMaterial', { color: 0x2b2b2b, roughness: 0.35, metalness: 0.7 }),
  };
  return m;
}

// ───────────────────────── car parts ─────────────────────────
function openingsFor(V, kind) {
  const ops = [];
  if (kind === 'end') {
    const L = V.EL;
    for (const [k, a, b] of V.endLayout) {
      const x0 = L / 2 - b, x1 = L / 2 - a;
      if (k === 'win') ops.push({ x0, x1, y0: C.winY[0], y1: C.winY[1], kind: 'glass', side: 0 });
      else if (k === 'door') ops.push({ x0, x1, y0: C.doorY[0], y1: C.doorY[1], kind: 'hole', side: 0, door: 2 });
      else if (k === 'cab') { ops.push({ x0, x1, y0: 0.62, y1: 2.52, kind: 'hole', side: 1, door: 1, hinge: true }); ops.push({ x0, x1, y0: C.winY[0], y1: C.winY[1], kind: 'glass', side: -1 }); }
    }
  } else {
    const L = C.ML;
    for (const [k, a, b] of V.midLayout) {
      const x0 = -L / 2 + a, x1 = -L / 2 + b;
      if (k === 'win') ops.push({ x0, x1, y0: C.winY[0], y1: C.winY[1], kind: 'glass', side: 0 });
      else ops.push({ x0, x1, y0: C.doorY[0], y1: C.doorY[1], kind: 'hole', side: 0, door: 2 });
    }
  }
  return ops;
}

function buildLeaf(V, m, w, h, t, y0, innerLocal, glassY = V.doorGlass) {
  const g = new THREE.Group(), sw = 0.07;
  const gy0 = glassY[0] - y0, gy1 = glassY[1] - y0;
  const frame = mergeGeometries([
    boxGeo(w, gy0, t, 0, gy0 / 2, -t / 2), boxGeo(w, h - gy1, t, 0, (gy1 + h) / 2, -t / 2),
    boxGeo(sw, gy1 - gy0, t, -w / 2 + sw / 2, (gy0 + gy1) / 2, -t / 2), boxGeo(sw, gy1 - gy0, t, w / 2 - sw / 2, (gy0 + gy1) / 2, -t / 2)]);
  g.add(mesh(frame, m.door));
  const gl = mesh(new THREE.BoxGeometry(w - 2 * sw + 0.01, gy1 - gy0 + 0.01, 0.012), m.glass, false, false); gl.position.set(0, (gy0 + gy1) / 2, -t / 2); gl.renderOrder = 2; g.add(gl);
  const seal = mesh(new THREE.BoxGeometry(0.022, h, t + 0.006), m.rubber); seal.position.set(innerLocal * (w / 2 - 0.011), h / 2, -t / 2); g.add(seal);
  const btn = mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.012, 18).rotateX(PI / 2), m.button, false, false); btn.position.set(innerLocal * (w / 2 - 0.1), 1.12 - y0, 0.004); g.add(btn);
  return g;
}

function addDoors(car, V, ops, m) {
  const frames = [];
  for (const o of ops) {
    if (o.kind !== 'hole') continue;
    if (o.hinge) { addCabDoor(car, V, o, m); continue; }
    const sides = o.side === 0 ? [1, -1] : [o.side];
    for (const side of sides) {
      const n = o.door, W = o.x1 - o.x0, w = W / n - 0.012, h = o.y1 - o.y0 - 0.012, t = 0.045;
      for (let i = 0; i < n; i++) {
        const xc = o.x0 + (i + 0.5) * W / n;
        const dirX = n === 1 ? -1 : (i === 0 ? -1 : 1);
        const leaf = buildLeaf(V, m, w, h, t, o.y0, -dirX * side);
        leaf.position.set(xc, o.y0 + 0.006, side * C.HW);
        leaf.rotation.y = side > 0 ? 0 : PI;
        car.body.add(leaf);
        car.leaves.push({ obj: leaf, side, xc, dirX, w });
      }
      const z = side * (C.HW + 0.004), ym = (o.y0 + o.y1) / 2, hh = o.y1 - o.y0 + 0.03;
      frames.push(boxGeo(0.03, hh, 0.012, o.x0 - 0.015, ym, z), boxGeo(0.03, hh, 0.012, o.x1 + 0.015, ym, z), boxGeo(W + 0.06, 0.03, 0.012, (o.x0 + o.x1) / 2, o.y1 + 0.015, z));
    }
  }
  if (frames.length) car.body.add(mesh(mergeGeometries(frames), m.trim));
}

// Driver's door: a hinged door at the rear edge that swings inwards into the cab
function addCabDoor(car, V, o, m) {
  const L = car.L, W = o.x1 - o.x0, w = W - 0.012, h = o.y1 - o.y0 - 0.012, t = 0.045;
  const zAt = x => C.HW * taperAt(L, x);
  const a = Math.atan2(zAt(o.x0) - zAt(o.x1), W);
  const pivot = new THREE.Group(); pivot.position.set(o.x0 + 0.006, o.y0 + 0.006, zAt(o.x0)); pivot.rotation.y = a;
  const leaf = buildLeaf(V, m, w, h, t, o.y0, 1, [1.32, 2.40]); leaf.position.x = W / 2; pivot.add(leaf);
  const handle = mesh(boxGeo(0.03, 0.16, 0.03, W - 0.07, 1.42 - o.y0, 0.012), m.rubber, false, false); pivot.add(handle);
  car.body.add(pivot); car.leaves.push({ obj: pivot, hinge: true, base: a });
  const fr = new THREE.Group(); fr.position.set(o.x0, 0, zAt(o.x0)); fr.rotation.y = a;
  const ym = (o.y0 + o.y1) / 2, hh = o.y1 - o.y0 + 0.03;
  fr.add(mesh(mergeGeometries([boxGeo(0.03, hh, 0.012, -0.015, ym, 0.004), boxGeo(0.03, hh, 0.012, W + 0.015, ym, 0.004), boxGeo(W + 0.06, 0.03, 0.012, W / 2, o.y1 + 0.015, 0.004), boxGeo(W + 0.06, 0.03, 0.012, W / 2, o.y0 - 0.015, 0.004)]), m.trim));
  fr.add(mesh(boxGeo(W - 0.14, 0.15, 0.012, W / 2, 0.44, 0.003), m.trim, false, false)); // foot step
  car.body.add(fr);
}

function buildInterior(V, car, ops, m) {
  const g = new THREE.Group(), L = car.L, nose = car.kind === 'end';
  const xFront = nose ? L / 2 - 2.32 : L / 2 - 0.08, xRear = -L / 2 + 0.08;
  const floorTo = nose ? L / 2 - 2.33 : L / 2 - 0.08;
  g.add(mesh(boxGeo(floorTo - xRear, 0.07, 2.18, (floorTo + xRear) / 2, 0.335, 0), m.floor, false, true));
  const raised = [];
  if (nose) {
    const xb = L / 2 - V.endBogie, r0 = xb - 1.35, r1 = Math.min(xb + 1.35, xFront);
    raised.push([r0, r1]);
    g.add(mesh(boxGeo(r1 - r0, 0.23, 2.18, (r0 + r1) / 2, 0.485, 0), m.floor, false, true));
    g.add(mesh(boxGeo(0.04, 0.012, 2.18, r0 + 0.02, 0.604, 0), m.stripe, false, false));
  } else {
    for (const xb of [-C.midBogie / 2, C.midBogie / 2]) for (const sz of [1, -1]) g.add(mesh(boxGeo(2.0, 0.40, 0.42, xb, 0.57, sz * 0.84), m.inner, false, true));
  }
  // ceiling + light strips
  g.add(mesh(boxGeo(xFront - xRear, 0.03, 2.12, (xFront + xRear) / 2, 2.76, 0), m.inner, false, false));
  for (const sz of [1, -1]) g.add(mesh(boxGeo(xFront - xRear - 0.4, 0.02, 0.1, (xFront + xRear) / 2, 2.74, sz * 0.55), m.light, false, false));
  // seats
  const seatGeos = [];
  for (const side of [1, -1]) for (const o of ops) {
    if (o.kind !== 'glass' || !(o.side === 0 || o.side === side)) continue;
    if (nose && o.x1 > xFront) continue;
    const span = o.x1 - o.x0, n = Math.max(1, Math.floor((span + 0.05) / 0.78)), pitch = span / n;
    for (let i = 0; i < n; i++) {
      const x = o.x0 + pitch * (i + 0.5), facing = i % 2 === 0 ? 1 : -1;
      const fy = raised.some(([a, b]) => x > a && x < b) ? 0.60 : 0.37;
      for (const zz of [0.80, 0.37]) {
        const z = side * zz;
        seatGeos.push(boxGeo(0.44, 0.09, 0.40, x, fy + 0.42, z));
        const back = new THREE.BoxGeometry(0.07, 0.54, 0.40); back.rotateZ(facing * 0.12); back.translate(x - facing * 0.23, fy + 0.73, z); seatGeos.push(back);
        seatGeos.push(boxGeo(0.06, 0.38, 0.28, x, fy + 0.19, z));
      }
    }
  }
  if (seatGeos.length) g.add(mesh(mergeGeometries(seatGeos), m.seat, false, true));
  // poles & rails
  const poleGeos = [];
  const vpole = (x, z, y0) => poleGeos.push(new THREE.CylinderGeometry(0.018, 0.018, 2.75 - y0, 10).translate(x, (2.75 + y0) / 2, z));
  for (const o of ops) if (o.kind === 'hole' && !o.hinge) {
    const sides = o.side === 0 ? [1, -1] : [o.side];
    for (const s of sides) { vpole(o.x0 + 0.1, s * (C.HW - 0.3), 0.37); vpole(o.x1 - 0.1, s * (C.HW - 0.3), 0.37); }
  }
  for (const sz of [1, -1]) poleGeos.push(new THREE.CylinderGeometry(0.016, 0.016, xFront - xRear - 0.6, 10).rotateZ(PI / 2).translate((xFront + xRear) / 2, 1.98, sz * 0.32));
  g.add(mesh(mergeGeometries(poleGeos), m.pole, false, false));
  if (nose) {
    // cab partition, desk, screens, seat
    const xp = L / 2 - 2.33;
    g.add(mesh(boxGeo(xp - (L / 2 - 0.62) < 0 ? (L / 2 - 0.62) - xp : 0.01, 0.32, 1.70, (xp + L / 2 - 0.62) / 2, 0.46, 0), m.floor, false, true)); // raised cab floor
    g.add(mesh(boxGeo(0.05, 2.38, 2.16, xp, 0.37 + 1.19, 0), m.inner, false, true));
    g.add(mesh(boxGeo(0.06, 1.1, 0.7, xp + 0.03, 1.75, 0), m.glass, false, false));
    const desk = new THREE.BoxGeometry(0.5, 0.66, 1.7); desk.translate(L / 2 - 1.10, 0.95, 0);
    g.add(mesh(desk, m.frame, false, true));
    for (const sz of [0.42, -0.42]) { const scr = mesh(new THREE.BoxGeometry(0.2, 0.02, 0.27), m.screen, false, false); scr.position.set(L / 2 - 1.14, 1.29, sz * 0.9); scr.rotation.z = 0.45; g.add(scr); }
    g.add(mesh(boxGeo(0.08, 0.05, 0.36, L / 2 - 1.38, 1.31, 0), m.rubber, false, false));
    g.add(mesh(boxGeo(0.5, 0.1, 0.5, L / 2 - 1.70, 1.10, 0), m.seat, false, true));
    g.add(mesh(boxGeo(0.08, 0.7, 0.5, L / 2 - 1.95, 1.50, 0), m.seat, false, true));
  }
  return g;
}

function addFront(car, V, m) {
  const L = car.L, b = car.body;
  car.headMat = mat('MeshStandardMaterial', { color: 0xe9e9e9, emissive: 0xffffff, emissiveIntensity: 0, roughness: 0.2 });
  car.tailMat = mat('MeshStandardMaterial', { color: 0x4a0a0a, emissive: 0xff1c1c, emissiveIntensity: 0, roughness: 0.3 });
  const housing = new RoundedBoxGeometry(0.34, 0.12, 0.03, 2, 0.012);
  for (const sz of [1, -1]) {
    b.add(onFront(L, mesh(housing, m.rubber, false, false), 1.08, sz * 0.68, 0.004));
    for (const zz of [0.735, 0.865]) b.add(onFront(L, mesh(new THREE.CircleGeometry(0.043, 24), car.headMat, false, false), 1.08, sz * (zz - 0.12), 0.021));
    b.add(onFront(L, mesh(new THREE.CircleGeometry(0.036, 20), car.tailMat, false, false), 1.08, sz * 0.46, 0.008));
  }
  if (V.logo) b.add(onFront(L, mesh(new THREE.PlaneGeometry(0.62, 0.155), mat('MeshStandardMaterial', { map: textTex(V.logo, { w: 512, h: 128, italic: true }), transparent: true, roughness: 0.5 }), false, false), 1.08, 0, 0.007));
  const numMat = mat('MeshStandardMaterial', { map: textTex(V.number, { w: 256, h: 96, color: V.numberColor, weight: 600 }), transparent: true, roughness: 0.5 });
  if (V.key === 'dvg') b.add(onFront(L, mesh(new THREE.PlaneGeometry(0.30, 0.11), numMat, false, false), 0.78, -0.30, 0.006));
  else b.add(onFront(L, mesh(new THREE.PlaneGeometry(0.28, 0.105), numMat, false, false), 1.08, -0.26, 0.007));
  // destination display behind the windscreen
  car.destMat = mat('MeshBasicMaterial', { map: destTexture(V.dest[0], V.dest[1]), toneMapped: false });
  // flat, upright display behind the cut-out in the blacked-out top of the windscreen
  let xm = Infinity; for (const y of [2.60, 2.86]) for (const z of [0, 0.78, -0.78]) xm = Math.min(xm, frontX(L, y, z));
  const dsp = mesh(new THREE.PlaneGeometry(1.50, 0.27), car.destMat, false, false); dsp.position.set(xm - 0.04, 2.73, 0); dsp.rotation.y = PI / 2; b.add(dsp);
  const dbk = mesh(boxGeo(0.03, 0.31, 1.56, xm - 0.06, 2.73, 0), m.rubber, false, false); b.add(dbk);
  // wiper
  const wa = frontPt(L, 1.30, 0.28, 0.03), wb = frontPt(L, 1.38, -0.60, 0.03);
  const wiper = rod(0.011, m.rubber, 6); setRod(wiper, wa, wb); b.add(wiper);
  // camera pods ("mirrors")
  for (const sz of [1, -1]) {
    const pod = mesh(new RoundedBoxGeometry(0.22, 0.11, 0.13, 2, 0.03), m.trim); const pz = C.HW * taperAt(L, L / 2 - 2.45); pod.position.set(L / 2 - 2.45, 2.72, sz * (pz + 0.085)); b.add(pod);
    b.add(mesh(boxGeo(0.05, 0.04, 0.06, L / 2 - 2.45, 2.72, sz * (pz + 0.02)), m.trim));
  }
  car.markerPts.cab = new V3(L / 2 - 1.2, 2.3, 0);
  car.markerPts.cams = new V3(L / 2 - 2.45, 2.98, C.HW + 0.1);
}

function addSideDecals(car, V, kind) {
  const L = car.L, items = [];
  if (kind === 'end') { items.push([L / 2 - 5.92, L / 2 - 2.75, 'komfort']); items.push([L / 2 - 9.15, L / 2 - 7.70, 'logo']); }
  else { items.push([-L / 2 + 0.40, -L / 2 + 3.62, 'neue']); items.push([L / 2 - 3.62, L / 2 - 0.40, 'neue']); }
  for (const [x0, x1, k] of items) {
    const w = (x1 - x0) * (k === 'logo' ? 0.7 : 0.98), h = k === 'logo' ? 0.30 : 0.44;
    const mt = mat('MeshStandardMaterial', { map: decalTex(k, w, h), transparent: true, roughness: 0.4, polygonOffset: true, polygonOffsetFactor: -2 });
    for (const side of [1, -1]) {
      const p = mesh(new THREE.PlaneGeometry(w, h), mt, false, false);
      p.position.set((x0 + x1) / 2, 0.93, side * (C.HW + 0.003)); p.rotation.y = side > 0 ? 0 : PI;
      car.body.add(p);
    }
  }
}

function addRoofKit(car, V, m) {
  const L = car.L, y = C.yt;
  const box = (x0, x1, w, h) => {
    const bx = mesh(new RoundedBoxGeometry(x1 - x0, h, w, 2, 0.035), m.roofKit); bx.position.set((x0 + x1) / 2, y + h / 2 - 0.01, 0); car.body.add(bx);
    const gr = mesh(new THREE.PlaneGeometry((x1 - x0) * 0.7, w * 0.55), m.grill, false, false); gr.rotation.x = -PI / 2; gr.position.set((x0 + x1) / 2, y + h - 0.006, 0); car.body.add(gr);
  };
  if (car.kind === 'end') { box(L / 2 - 5.0, L / 2 - 2.7, 1.5, 0.24); box(Math.max(-L / 2 + 0.4, L / 2 - 8.7), L / 2 - 5.4, 1.6, 0.22); car.markerPts.roof = new V3(L / 2 - 3.85, y + 0.55, 0); }
  else { box(0.6, 3.8, 1.5, 0.22); box(-0.9, -0.2, 0.8, 0.16); }
}

function buildPantograph(m) {
  const g = new THREE.Group();
  g.add(mesh(boxGeo(1.5, 0.06, 1.0, -0.05, 0.15, 0), m.frame));
  for (const [x, z] of [[-0.65, 0.4], [-0.65, -0.4], [0.55, 0.4], [0.55, -0.4]]) g.add(mesh(new THREE.CylinderGeometry(0.045, 0.055, 0.13, 12).translate(x, 0.065, z), m.insulator));
  const P0 = new V3(-0.55, 0.22, 0), L1 = 1.6, L2 = 1.52, dX = 0.1;
  const lowA = rod(0.03, m.frame), lowB = rod(0.03, m.frame), up1 = rod(0.022, m.frame), up2 = rod(0.012, m.frame), up3 = rod(0.012, m.frame), guide = rod(0.01, m.frame), damper = rod(0.025, m.dark);
  g.add(lowA, lowB, up1, up2, up3, guide, damper);
  g.add(mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.75, 12).rotateX(PI / 2).translate(P0.x, P0.y, 0), m.dark));
  const head = new THREE.Group(); g.add(head);
  for (const x of [-0.13, 0.13]) head.add(mesh(boxGeo(0.06, 0.04, 1.1, x, 0.02, 0), m.copper));
  for (const z of [-0.42, 0.42]) head.add(mesh(boxGeo(0.32, 0.03, 0.03, 0, -0.01, z), m.frame));
  for (const sz of [1, -1]) {
    const curve = new THREE.QuadraticBezierCurve3(new V3(0, 0.02, sz * 0.55), new V3(0, 0.03, sz * 0.78), new V3(0, -0.16, sz * 0.82));
    head.add(mesh(new THREE.TubeGeometry(curve, 10, 0.016, 6), m.frame));
  }
  const knee = new V3(), hp = new V3(), tmp = new V3(), tmp2 = new V3();
  function solve(h) {
    const aMax = Math.acos(dX / L1);
    let lo = 0, hi = aMax;
    const yOf = a => L1 * Math.sin(a) + Math.sqrt(Math.max(0, L2 * L2 - Math.pow(L1 * Math.cos(a) - dX, 2)));
    h = clamp(h, yOf(0), yOf(aMax) - 0.01);
    for (let i = 0; i < 30; i++) { const mid = (lo + hi) / 2; if (yOf(mid) < h) lo = mid; else hi = mid; }
    return lo;
  }
  function update(h) {
    const a = solve(h);
    knee.set(P0.x + L1 * Math.cos(a), P0.y + L1 * Math.sin(a), 0);
    hp.set(P0.x + dX, P0.y + L1 * Math.sin(a) + Math.sqrt(Math.max(0, L2 * L2 - Math.pow(L1 * Math.cos(a) - dX, 2))), 0);
    setRod(lowA, tmp.set(P0.x, P0.y, 0.32), knee); setRod(lowB, tmp.set(P0.x, P0.y, -0.32), knee);
    setRod(up1, knee, hp);
    setRod(up2, tmp.lerpVectors(knee, hp, 0.55), tmp2.set(hp.x, hp.y - 0.02, 0.3));
    setRod(up3, tmp.lerpVectors(knee, hp, 0.55), tmp2.set(hp.x, hp.y - 0.02, -0.3));
    setRod(guide, tmp.set(P0.x - 0.2, P0.y + 0.02, 0.12), tmp2.lerpVectors(knee, hp, 0.12).setZ(0.05));
    setRod(damper, tmp.set(P0.x + 0.45, 0.2, 0.18), tmp2.lerpVectors(new V3(P0.x, P0.y, 0.18), new V3(knee.x, knee.y, 0.18), 0.35));
    head.position.copy(hp);
  }
  update(0.25);
  return { group: g, update, head, pivotY: P0.y, top: 0.04 };
}

const wheelGeo = (() => {
  const R = C.wheelR;
  const pts = [[0, -0.035], [R * 0.55, -0.035], [R - 0.012, -0.05], [R + 0.022, -0.055], [R + 0.022, -0.045], [R, -0.028], [R - 0.004, 0.055], [R * 0.6, 0.05], [R * 0.3, 0.07], [0, 0.07]].map(([r, h]) => new THREE.Vector2(r, h));
  const g = new THREE.LatheGeometry(pts, 40); g.rotateX(PI / 2); return g;
})();

function buildBogie(V, drive, m) {
  const g = new THREE.Group(), gauge = V.gauge, wb = drive ? V.driveWB : V.runWB, R = C.wheelR;
  const wz = gauge / 2 + 0.035, fz = V.insideFrames ? gauge / 2 - 0.16 : gauge / 2 + 0.17;
  const wheelsets = [];
  const parts = [];
  for (const ax of [-wb / 2, wb / 2]) {
    const ws = new THREE.Group(); ws.position.set(ax, R, 0); g.add(ws); wheelsets.push(ws);
    for (const sz of [1, -1]) { const w = mesh(wheelGeo, m.wheel); w.position.z = sz * wz; if (sz < 0) w.rotation.y = PI; ws.add(w); }
    if (drive) ws.add(mesh(new THREE.CylinderGeometry(0.07, 0.07, gauge + 0.1, 14).rotateX(PI / 2), m.dark));
    else { parts.push(boxGeo(0.14, 0.1, 2 * wz - 0.22, ax, 0.14, 0)); for (const sz of [1, -1]) parts.push(boxGeo(0.12, R - 0.1, 0.1, ax, (R + 0.12) / 2, sz * (wz - 0.11))); }
    for (const sz of [1, -1]) { parts.push(boxGeo(0.24, 0.2, 0.15, ax, R, sz * fz)); }
    if (drive) parts.push(boxGeo(0.32, 0.3, 0.14, ax, R, (gauge / 2 - 0.24) * (ax > 0 ? 1 : -1)));
  }
  const frameGeos = [];
  for (const sz of [1, -1]) frameGeos.push(boxGeo(wb + 0.75, 0.16, 0.12, 0, R + 0.12, sz * fz));
  frameGeos.push(boxGeo(0.36, 0.14, 2 * fz, 0, R + 0.12, 0));
  g.add(mesh(mergeGeometries(frameGeos), m.frame));
  g.add(mesh(mergeGeometries(parts), m.dark));
  const springs = [];
  for (const ax of [-wb / 2, wb / 2]) for (const sz of [1, -1]) springs.push(new THREE.CylinderGeometry(0.055, 0.055, 0.1, 12).translate(ax, R + 0.12, sz * fz));
  for (const sz of [1, -1]) springs.push(new THREE.CylinderGeometry(0.085, 0.085, 0.2, 14).translate(0, R + 0.3, sz * fz * 0.85));
  g.add(mesh(mergeGeometries(springs), m.spring));
  if (drive) for (const x of [-0.42, 0.42]) g.add(mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.62, 18).rotateX(PI / 2).translate(x, 0.36, 0), m.frame));
  for (const sz of [1, -1]) g.add(mesh(boxGeo(Math.min(1.0, wb - 0.7), 0.07, 0.08, 0, 0.065, sz * wz), m.dark));
  return { group: g, wheelsets, drive };
}

// ───────────────────────── cars ─────────────────────────
function newCar(kind, L) {
  const car = { kind, L, root: new THREE.Group(), body: new THREE.Group(), chassis: new THREE.Group(), bogies: [], leaves: [], markerPts: {}, yaw: 0, c: new V3(), dir: new V3(1, 0, 0) };
  car.root.add(car.body, car.chassis); return car;
}
function addShell(car, cfg, m) {
  const sh = buildShell(cfg);
  for (const k of ['paint', 'trim', 'glass']) {
    if (!sh[k]) continue;
    const o = mesh(sh[k], m[k], k !== 'glass', k !== 'glass');
    if (k === 'glass') o.renderOrder = 2;
    car.body.add(o);
  }
}
function buildEndCar(V, m) {
  const L = V.EL, car = newCar('end', L), ops = openingsFor(V, 'end');
  addShell(car, { L, nose: true, bands: V.bands, openings: ops }, m);
  addDoors(car, V, ops, m);
  car.body.add(buildInterior(V, car, ops, m));
  addFront(car, V, m);
  addRoofKit(car, V, m);
  if (V.decals) addSideDecals(car, V, 'end');
  const bx = L / 2 - V.endBogie, bg = buildBogie(V, true, m);
  bg.group.position.x = bx; car.chassis.add(bg.group); car.bogies.push({ ...bg, x: bx });
  const d = ops.find(o => o.kind === 'hole' && o.door === 2);
  car.markerPts.doors = new V3((d.x0 + d.x1) / 2, 1.6, C.HW + 0.08);
  car.markerPts.drive = new V3(bx, 0.55, C.HW + 0.15);
  return car;
}
function buildMidCar(V, m) {
  const L = C.ML, car = newCar('mid', L), ops = openingsFor(V, 'mid');
  addShell(car, { L, nose: false, bands: V.bands, openings: ops }, m);
  addDoors(car, V, ops, m);
  car.body.add(buildInterior(V, car, ops, m));
  addRoofKit(car, V, m);
  if (V.decals) addSideDecals(car, V, 'mid');
  // side destination display in first window
  const dm = mat('MeshBasicMaterial', { map: destTexture(V.dest[0], V.dest[1]), toneMapped: false });
  for (const side of [1, -1]) { const p = mesh(new THREE.PlaneGeometry(0.95, 0.16), dm, false, false); p.position.set(-L / 2 + 1.18, 2.30, side * (C.HW - 0.05)); p.rotation.y = side > 0 ? 0 : PI; car.body.add(p); }
  for (const xb of [-C.midBogie / 2, C.midBogie / 2]) { const bg = buildBogie(V, false, m); bg.group.position.x = xb; car.chassis.add(bg.group); car.bogies.push({ ...bg, x: xb }); }
  const pan = buildPantograph(m); pan.group.position.set(-L / 2 + 2.7, C.yt, 0); car.body.add(pan.group); car.panto = pan;
  car.markerPts.run = new V3(C.midBogie / 2, 0.55, C.HW + 0.15);
  car.markerPts.floor = new V3(0, 0.75, C.HW + 0.1);
  car.markerPts.joint = new V3(L / 2 + C.J / 2, 2.0, C.HW + 0.05);
  return car;
}

// ───────────────────────── bellows (articulation) ─────────────────────────
class Bellows {
  constructor(m) {
    const pts = [], hw = 1.07, y0 = 0.32, y1 = 3.15, rT = 0.32, rB = 0.06;
    const arc = (cx, cy, r, a0, a1) => { for (let i = 0; i <= 6; i++) { const a = a0 + (a1 - a0) * i / 6; pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); } };
    arc(hw - rB, y0 + rB, rB, -PI / 2, 0); arc(hw - rT, y1 - rT, rT, 0, PI / 2); arc(-hw + rT, y1 - rT, rT, PI / 2, PI); arc(-hw + rB, y0 + rB, rB, PI, 1.5 * PI);
    // resample uniformly
    const segs = []; let tot = 0;
    for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; const l = Math.hypot(b[0] - a[0], b[1] - a[1]); segs.push([a, b, l]); tot += l; }
    this.nl = 64; this.loop = [];
    for (let i = 0; i < this.nl; i++) { let d = tot * i / this.nl; for (const [a, b, l] of segs) { if (d <= l) { const t = l ? d / l : 0; this.loop.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); break; } d -= l; } }
    this.ns = 26;
    const n = this.ns * this.nl, idx = [];
    for (let i = 0; i < this.ns - 1; i++) for (let j = 0; j < this.nl; j++) { const a = i * this.nl + j, b = i * this.nl + (j + 1) % this.nl, c = a + this.nl, d = b + this.nl; idx.push(a, c, b, b, c, d); }
    this.geo = new THREE.BufferGeometry(); this.geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3)); this.geo.setIndex(idx);
    this.mesh = mesh(this.geo, m.bellows); this.mesh.frustumCulled = false;
  }
  update(pA, yawA, pB, yawB, lift) {
    const arr = this.geo.attributes.position.array, len = pA.distanceTo(pB);
    const dA = new V3(Math.cos(yawA), 0, -Math.sin(yawA)).multiplyScalar(len), dB = new V3(Math.cos(yawB), 0, -Math.sin(yawB)).multiplyScalar(len);
    const dy = wrapAng(yawB - yawA);
    for (let i = 0; i < this.ns; i++) {
      const t = i / (this.ns - 1), t2 = t * t, t3 = t2 * t;
      const h00 = 2 * t3 - 3 * t2 + 1, h10 = t3 - 2 * t2 + t, h01 = -2 * t3 + 3 * t2, h11 = t3 - t2;
      const px = h00 * pA.x + h10 * dA.x + h01 * pB.x + h11 * dB.x, pz = h00 * pA.z + h10 * dA.z + h01 * pB.z + h11 * dB.z;
      const yaw = yawA + dy * t, sn = Math.sin(yaw), cs = Math.cos(yaw);
      const s = (i === 0 || i === this.ns - 1) ? 1 : (i % 2 ? 0.972 : 1.0);
      for (let j = 0; j < this.nl; j++) {
        const [lz, ly] = this.loop[j], k = (i * this.nl + j) * 3, z = lz * s, y = 1.74 + (ly - 1.74) * s;
        arr[k] = px + z * sn; arr[k + 1] = y + lift; arr[k + 2] = pz + z * cs;
      }
    }
    this.geo.attributes.position.needsUpdate = true; this.geo.computeVertexNormals(); this.geo.computeBoundingSphere();
  }
}

// ───────────────────────── paths ─────────────────────────
class StraightPath { constructor(z) { this.z = z; this.closed = false; } pos(s) { return { x: s, z: this.z }; } yaw() { return 0; } }
class StadiumPath {
  constructor(R, Ls) { this.R = R; this.Ls = Ls; this.length = 4 * Ls + 2 * PI * R; this.closed = true; }
  w(s) { const L = this.length; return ((s % L) + L) % L; }
  pos(s) {
    s = this.w(s); const { R, Ls } = this, a1 = 2 * Ls, a2 = a1 + PI * R, a3 = a2 + 2 * Ls;
    if (s < a1) return { x: -Ls + s, z: R };
    if (s < a2) { const a = PI / 2 - (s - a1) / R; return { x: Ls + R * Math.cos(a), z: R * Math.sin(a) }; }
    if (s < a3) return { x: Ls - (s - a2), z: -R };
    const a = -PI / 2 - (s - a3) / R; return { x: -Ls + R * Math.cos(a), z: R * Math.sin(a) };
  }
  yaw(s) {
    s = this.w(s); const { R, Ls } = this, a1 = 2 * Ls, a2 = a1 + PI * R, a3 = a2 + 2 * Ls;
    if (s < a1) return 0; if (s < a3 && s >= a2) return PI;
    const a = s < a2 ? PI / 2 - (s - a1) / R : -PI / 2 - (s - a3) / R;
    return Math.atan2(Math.cos(a), Math.sin(a));
  }
}
const pdist = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);

// ───────────────────────── tram ─────────────────────────
class Tram {
  constructor(V) {
    this.V = V; this.m = makeMats(V); this.group = new THREE.Group(); scene.add(this.group); this.group.position.y = 0.026; // rail head height
    this.A = buildEndCar(V, this.m); this.B = buildEndCar(V, this.m); this.M = buildMidCar(V, this.m);
    this.cars = [this.A, this.M, this.B];
    this.cars.forEach(c => this.group.add(c.root));
    this.bel = [new Bellows(this.m), new Bellows(this.m)]; this.bel.forEach(b => this.group.add(b.mesh));
    this.s = 0; this.v = 0; this.dir = 1; this.phase = 'run'; this.phaseT = 0;
    this.doorOpen = { 1: 0, '-1': 0 }; this.doorTarget = { 1: 0, '-1': 0 }; this.cabOpen = 0; this.cabTarget = 0;
    this.pantoH = 0.25; this.explode = 0; this.path = null;
  }
  get tip() { return C.ML / 2 + C.J + this.V.EL; }
  pose(path, s, explode = 0) {
    const V = this.V, d = C.midBogie, P = s2 => path.pos(s2);
    const sa = s + d / 2; let sb = sa - d;
    const pa = P(sa); for (let i = 0; i < 5; i++) sb += pdist(pa, P(sb)) - d;
    const pb = P(sb), M = this.M, A = this.A, B = this.B;
    M.c.set((pa.x + pb.x) / 2, 0, (pa.z + pb.z) / 2); M.dir.set(pa.x - pb.x, 0, pa.z - pb.z).normalize(); M.yaw = Math.atan2(-M.dir.z, M.dir.x);
    const jOff = C.ML / 2 + C.J / 2, r = V.EL + C.J / 2 - V.endBogie;
    const JA = M.c.clone().addScaledVector(M.dir, jOff), JB = M.c.clone().addScaledVector(M.dir, -jOff);
    let sf = sa + (jOff - d / 2) + r; for (let i = 0; i < 6; i++) sf -= pdist(P(sf), JA) - r;
    let sr = sb - (jOff - d / 2) - r; for (let i = 0; i < 6; i++) sr += pdist(P(sr), JB) - r;
    const pf = P(sf), pr = P(sr);
    A.dir.set(pf.x - JA.x, 0, pf.z - JA.z).normalize(); A.yaw = Math.atan2(-A.dir.z, A.dir.x);
    B.dir.set(pr.x - JB.x, 0, pr.z - JB.z).normalize(); B.yaw = Math.atan2(-B.dir.z, B.dir.x);
    const gap = explode * 2.6, lift = explode * 1.7;
    A.c.copy(JA).addScaledVector(A.dir, V.EL / 2 + C.J / 2 + gap);
    B.c.copy(JB).addScaledVector(B.dir, V.EL / 2 + C.J / 2 + gap);
    for (const c of this.cars) { c.root.position.copy(c.c); c.root.rotation.y = c.yaw; c.body.position.y = lift; }
    const bogieS = [[A, 0, sf, 1], [M, 0, sa, 1], [M, 1, sb, 1], [B, 0, sr, -1]];
    for (const [car, i, sv, sg] of bogieS) {
      const bg = car.bogies[i]; let ly = wrapAng(path.yaw(sv) - car.yaw); if (Math.abs(ly) > PI / 2) ly = wrapAng(ly - PI);
      bg.group.rotation.y = explode > 0 ? ly * (1 - explode) : ly;
      for (const ws of bg.wheelsets) ws.rotation.z = -(sv * sg) / C.wheelR;
    }
    // bellows: centre car face -> end car face
    const mF = M.c.clone().addScaledVector(M.dir, C.ML / 2), mR = M.c.clone().addScaledVector(M.dir, -C.ML / 2);
    const aR = A.c.clone().addScaledVector(A.dir, -V.EL / 2), bR = B.c.clone().addScaledVector(B.dir, -V.EL / 2);
    this.bel[0].update(mF, M.yaw, aR, A.yaw, lift);
    this.bel[1].update(bR, wrapAng(B.yaw + PI), mR, M.yaw, lift);
    this.lift = lift;
  }
  animate(dt) {
    for (const k of [1, -1]) { const t = this.doorTarget[k], c = this.doorOpen[k]; this.doorOpen[k] = c + clamp(t - c, -dt * 0.45, dt * 0.45); }
    this.cabOpen += clamp(this.cabTarget - this.cabOpen, -dt * 0.6, dt * 0.6);
    for (const car of this.cars) for (const lf of car.leaves) {
      if (lf.hinge) { lf.obj.rotation.y = lf.base + smooth(this.cabOpen) * 1.55; continue; }
      const u = this.doorOpen[lf.side], out = smooth(clamp(u / 0.3, 0, 1)) * 0.07, sl = smooth(clamp((u - 0.3) / 0.7, 0, 1)) * lf.w * 0.97;
      lf.obj.position.x = lf.xc + lf.dirX * sl; lf.obj.position.z = lf.side * (C.HW + out);
    }
    const wireRel = C.wire - 0.01 - (C.yt + this.M.panto.pivotY + this.M.panto.top + (this.lift || 0));
    const target = wireRel;
    this.pantoH += clamp(target - this.pantoH, -dt * 1.1, dt * 1.1);
    this.M.panto.update(this.pantoH);
  }
  setLights(on, night, leadIsA) {
    const lead = leadIsA ? this.A : this.B, trail = leadIsA ? this.B : this.A;
    lead.headMat.emissiveIntensity = on ? (night ? 5 : 2.4) : 0; lead.tailMat.emissiveIntensity = 0;
    trail.headMat.emissiveIntensity = 0; trail.tailMat.emissiveIntensity = on ? (night ? 3 : 2.2) : 0;
    for (const c of [this.A, this.B]) c.destMat.color.setScalar(on ? 1 : 0.08);
  }
  setNight(n) { for (const k of ['seat', 'pole', 'inner', 'floor']) this.m[k].emissiveIntensity = n ? 0.45 : 0; this.m.light.emissiveIntensity = n ? 2.2 : 0.35; }
}

// ───────────────────────── environment / tracks ─────────────────────────
const texAsphalt = canvasTex(512, 512, (g, w, h) => {
  g.fillStyle = '#6c6d6b'; g.fillRect(0, 0, w, h); const r = rng(7);
  for (let i = 0; i < 26000; i++) { const v = 80 + r() * 70 | 0; g.fillStyle = `rgba(${v},${v},${v - 4},${0.25 + r() * 0.35})`; g.fillRect(r() * w, r() * h, 1 + r() * 2, 1 + r() * 2); }
});
texAsphalt.wrapS = texAsphalt.wrapT = THREE.RepeatWrapping; texAsphalt.repeat.set(260, 260);
const texSetts = canvasTex(512, 512, (g, w, h) => {
  g.fillStyle = '#3e3f40'; g.fillRect(0, 0, w, h); const r = rng(11), rowsN = 8, colsN = 4;
  for (let j = 0; j < rowsN; j++) for (let i = -1; i < colsN; i++) {
    const off = (j % 2) * (w / colsN / 2), x = i * w / colsN + off, y = j * h / rowsN, v = 120 + r() * 50 | 0;
    g.fillStyle = `rgb(${v},${v - 3},${v - 8})`; g.fillRect(x + 3, y + 3, w / colsN - 6, h / rowsN - 6);
    g.fillStyle = 'rgba(255,255,255,0.05)'; g.fillRect(x + 3, y + 3, w / colsN - 6, 5);
  }
});
texSetts.wrapS = texSetts.wrapT = THREE.RepeatWrapping;
const envM = {
  ground: mat('MeshStandardMaterial', { map: texAsphalt, roughness: 0.96, envMapIntensity: 0.5 }),
  bed: mat('MeshStandardMaterial', { map: texSetts, roughness: 0.92 }),
  railTop: mat('MeshStandardMaterial', { color: 0xc9ced3, roughness: 0.22, metalness: 0.95 }),
  railSide: mat('MeshStandardMaterial', { color: 0x5c4c40, roughness: 0.8, metalness: 0.3, side: THREE.DoubleSide }),
  groove: mat('MeshStandardMaterial', { color: 0x1d1c1b, roughness: 0.9 }),
  pole: mat('MeshStandardMaterial', { color: 0x58605a, roughness: 0.6, metalness: 0.5 }),
  wire: mat('MeshStandardMaterial', { color: 0x3b3328, roughness: 0.4, metalness: 0.8 }),
  grass: mat('MeshStandardMaterial', { color: 0x5d7e3c, roughness: 1, envMapIntensity: 0.4 }),
  platform: mat('MeshStandardMaterial', { color: 0xa9a7a1, roughness: 0.9 }),
  edge: mat('MeshStandardMaterial', { color: 0xf2f2ee, roughness: 0.7 }),
  shelterGlass: mat('MeshPhysicalMaterial', { color: 0xbfd2de, roughness: 0.05, transparent: true, opacity: 0.3, side: THREE.DoubleSide, depthWrite: false }),
  sign: mat('MeshStandardMaterial', { map: canvasTex(128, 128, (g) => { g.fillStyle = '#f6d313'; g.beginPath(); g.arc(64, 64, 62, 0, 7); g.fill(); g.fillStyle = '#1f8a4c'; g.beginPath(); g.arc(64, 64, 50, 0, 7); g.fill(); g.fillStyle = '#f6d313'; g.font = `700 74px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('H', 64, 68); }), roughness: 0.5 }),
  lamp: mat('MeshStandardMaterial', { color: 0xffffff, emissive: 0xffe2b0, emissiveIntensity: 0 }),
};

function ribbon(path, s0, s1, step, o0, o1, y, uvS = 1, y1 = null) {
  const n = Math.max(2, Math.ceil((s1 - s0) / step) + 1), pos = [], uv = [], idx = [];
  for (let i = 0; i < n; i++) {
    const s = s0 + (s1 - s0) * i / (n - 1), p = path.pos(s), yw = path.yaw(s), nx = Math.sin(yw), nz = Math.cos(yw);
    if (y1 === null) { pos.push(p.x + nx * o0, y, p.z + nz * o0, p.x + nx * o1, y, p.z + nz * o1); }
    else { pos.push(p.x + nx * o0, y, p.z + nz * o0, p.x + nx * o0, y1, p.z + nz * o0); }
    uv.push(0, s * uvS, (y1 === null ? (o1 - o0) : (y1 - y)) * uvS, s * uvS);
    if (i < n - 1) { const a = 2 * i, b = a + 1, c = a + 2, d = a + 3; idx.push(a, b, c, b, d, c); }
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals(); return g;
}
function buildTrack(path, gauge, s0, s1) {
  const g = new THREE.Group(), step = path.closed ? 1 : 10, hb = gauge / 2 + 0.85;
  g.add(mesh(ribbon(path, s0, s1, step, -hb, hb, 0.012, 1), envM.bed, false, true));
  const tops = [], sides = [], grooves = [];
  for (const sg of [1, -1]) {
    const o = sg * (gauge / 2 + 0.036);
    tops.push(ribbon(path, s0, s1, step, o - 0.036, o + 0.036, 0.026));
    sides.push(ribbon(path, s0, s1, step, o - 0.036, 0, 0.012, 1, 0.026), ribbon(path, s0, s1, step, o + 0.036, 0, 0.012, 1, 0.026));
    const gi = o - sg * 0.036, go = gi - sg * 0.034;
    grooves.push(ribbon(path, s0, s1, step, Math.min(gi, go), Math.max(gi, go), 0.017));
  }
  g.add(mesh(mergeGeometries(tops), envM.railTop, false, true), mesh(mergeGeometries(sides), envM.railSide, false, true), mesh(mergeGeometries(grooves), envM.groove, false, true));
  return g;
}
function catenaryPole(base, dirIn, armLen, wirePts) {
  const g = new THREE.Group();
  const pole = mesh(new THREE.CylinderGeometry(0.12, 0.16, 7.2, 12), envM.pole); pole.position.set(base.x, 3.6, base.z); g.add(pole);
  const tipP = new V3(base.x + dirIn.x * armLen, 6.5, base.z + dirIn.z * armLen);
  const arm = rod(0.05, envM.pole); setRod(arm, new V3(base.x, 6.6, base.z), tipP); g.add(arm);
  const brace = rod(0.03, envM.pole); setRod(brace, new V3(base.x, 5.7, base.z), new V3(base.x + dirIn.x * armLen * 0.6, 6.55, base.z + dirIn.z * armLen * 0.6)); g.add(brace);
  for (const w of wirePts) { const dr = rod(0.008, envM.wire, 5); setRod(dr, new V3(w.x, C.wire, w.z), new V3(w.x, 6.53, w.z)); g.add(dr); }
  return g;
}
function wireTube(pts, closed) { const curve = new THREE.CatmullRomCurve3(pts, closed); return mesh(new THREE.TubeGeometry(curve, Math.max(8, pts.length * 3), 0.011, 5, closed), envM.wire, true, false); }

// Buildings ring (shared)
const winTex = canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#ece8e0'; g.fillRect(0, 0, w, h); g.fillStyle = '#dcd6cb'; g.fillRect(0, 120, w, 8); g.fillRect(0, 248, w, 8); for (let y = 0; y < 2; y++) for (let x = 0; x < 3; x++) { g.fillStyle = '#d0cabe'; g.fillRect(22 + x * 80, 26 + y * 128, 44, 72); g.fillStyle = '#8796a2'; g.fillRect(25 + x * 80, 29 + y * 128, 38, 66); } });
winTex.wrapS = winTex.wrapT = THREE.RepeatWrapping;
const winEm = canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#000'; g.fillRect(0, 0, w, h); const r = rng(5); for (let y = 0; y < 2; y++) for (let x = 0; x < 3; x++) if (r() > 0.45) { g.fillStyle = r() > 0.5 ? '#ffd79a' : '#ffe9c4'; g.fillRect(25 + x * 80, 29 + y * 128, 38, 66); } });
winEm.wrapS = winEm.wrapT = THREE.RepeatWrapping;
const buildMats = ['#d8cdbb', '#b9c0c4', '#cfb9a2', '#a9a49c', '#e2dccf'].map(c => mat('MeshStandardMaterial', { color: c, map: winTex, emissiveMap: winEm, emissive: 0xffffff, emissiveIntensity: 0, roughness: 0.85 }));
const roofMat = mat('MeshStandardMaterial', { color: 0x6d6a66, roughness: 0.9 });

// ───────────────────────── home page scene ─────────────────────────
// Two concentric loops. The camera looks at the near straight, where both trams
// stop at an island platform between the tracks. The rest of the loop is out of view.
const LS = 25, R_DVG = 28.5, R_RB = 22.5;
const LOOPS = { dvg: new StadiumPath(R_DVG, LS), rb: new StadiumPath(R_RB, LS) };
// On the near straight s = LS + x. The DVG runs towards +x, the Ruhrbahn towards -x.
const STOPS = {
  dvg: { s: LS - 2, side: -1, dir: 1 },
  rb: { s: LS + 4, side: 1, dir: -1 },
};
const VMAX = 11.5;                  // m/s on the outer loop (~41 km/h)
const ACC = 1.1, DEC = 1.1;         // m/s²
const DWELL = 5.5;                  // s from stopping until the doors start to close
const PLATFORM_Z = (R_DVG + R_RB) / 2;
const FOCUS = new V3(0, 0, PLATFORM_Z);
const HOME_CAM = { pos: new V3(34, 8, PLATFORM_Z + 17), target: new V3(1, 1.3, PLATFORM_Z - 0.5) };

function buildWorld(renderer) {
  scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(renderer), 0.04).texture;

  const sky = new THREE.Mesh(new THREE.SphereGeometry(1200, 32, 16), new THREE.ShaderMaterial({
    uniforms: { top: { value: new THREE.Color('#5e93cc') }, mid: { value: new THREE.Color('#d6e3ec') }, bot: { value: new THREE.Color('#cfd3d2') } },
    side: THREE.BackSide, depthWrite: false, fog: false,
    vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: 'uniform vec3 top; uniform vec3 mid; uniform vec3 bot; varying vec3 vP; void main(){ float h = vP.y; vec3 c = h > 0.0 ? mix(mid, top, pow(clamp(h,0.0,1.0), 0.6)) : mix(mid, bot, clamp(-h*6.0,0.0,1.0)); gl_FragColor = vec4(c,1.0);\n#include <colorspace_fragment>\n}'
  }));
  sky.renderOrder = -10; scene.add(sky);
  scene.fog = new THREE.Fog(0xd6e3ec, 180, 660);

  scene.add(new THREE.HemisphereLight(0xe3efff, 0x5f5b52, 0.75));
  const sun = new THREE.DirectionalLight(0xfff2df, 2.5);
  sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -42, right: 42, top: 42, bottom: -42, near: 1, far: 200 });
  sun.shadow.bias = -0.0003; sun.shadow.normalBias = 0.03;
  sun.position.copy(FOCUS).add(new V3(-34, 58, 40)); sun.target.position.copy(FOCUS);
  scene.add(sun, sun.target);

  scene.add(mesh(new THREE.CircleGeometry(700, 64).rotateX(-PI / 2), envM.ground, false, true));

  // tracks and overhead wire
  for (const k of ['dvg', 'rb']) {
    const p = LOOPS[k], pts = [];
    scene.add(buildTrack(p, VARIANTS[k].gauge, 0, p.length));
    for (let s = 0; s < p.length; s += 3) { const q = p.pos(s); pts.push(new V3(q.x, C.wire, q.z)); }
    scene.add(wireTube(pts, true));
  }
  // catenary poles outside the outer loop, leaving a gap from x = -22 to the start of the
  // curve at x = +25, so that no pole stands between the camera and the trams at the stop
  const outer = LOOPS.dvg, sp = R_DVG - R_RB, s0 = LS + 31, span = outer.length - 53, n = Math.round(span / 24);
  for (let i = 0; i <= n; i++) {
    const s = s0 + span * i / n, q = outer.pos(s), yw = outer.yaw(s), nrm = new V3(Math.sin(yw), 0, Math.cos(yw));
    const base = new V3(q.x + nrm.x * 3.4, 0, q.z + nrm.z * 3.4);
    scene.add(catenaryPole(base, nrm.clone().negate(), 3.4 + sp + 0.4, [q, { x: q.x - nrm.x * sp, z: q.z - nrm.z * sp }]));
  }

  // grass inside the inner loop
  const sh = new THREE.Shape(), gr = R_RB - 3.2;
  sh.moveTo(-LS, -gr); sh.lineTo(LS, -gr); sh.absarc(LS, 0, gr, -PI / 2, PI / 2, false); sh.lineTo(-LS, gr); sh.absarc(-LS, 0, gr, PI / 2, 1.5 * PI, false);
  scene.add(mesh(new THREE.ShapeGeometry(sh, 24).rotateX(-PI / 2).translate(0, 0.035, 0), envM.grass, false, true));

  // island platform between the two tracks
  const z0 = R_RB + 1.35, z1 = R_DVG - 1.35, zc = PLATFORM_Z, len = 38, pg = new THREE.Group();
  pg.add(mesh(boxGeo(len, 0.22, z1 - z0, 0, 0.11, zc), envM.platform));
  for (const ez of [z0 + 0.07, z1 - 0.07]) pg.add(mesh(boxGeo(len, 0.005, 0.12, 0, 0.223, ez), envM.edge, false, true));
  const sx = -9;
  for (const x of [sx - 4.5, sx + 4.5]) pg.add(mesh(boxGeo(0.08, 2.6, 0.08, x, 1.52, zc), envM.pole));
  pg.add(mesh(boxGeo(10.5, 0.06, 2.4, sx, 2.84, zc), envM.shelterGlass, false, false));
  pg.add(mesh(boxGeo(9.5, 1.9, 0.02, sx, 1.25, zc), envM.shelterGlass, false, false));
  for (const sz of [1, -1]) pg.add(mesh(boxGeo(3.2, 0.06, 0.42, sx, 0.66, zc + sz * 0.3), envM.pole));
  const signPole = mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.7, 8), envM.pole); signPole.position.set(9, 1.57, zc); pg.add(signPole);
  for (const ry of [PI / 2, -PI / 2]) { const sg = mesh(new THREE.CircleGeometry(0.32, 32), envM.sign, false, false); sg.position.set(9 + (ry > 0 ? 0.01 : -0.01), 2.75, zc); sg.rotation.y = ry; pg.add(sg); }
  scene.add(pg);

  // trees inside the loop and further out
  const r = rng(21), trees = [];
  for (let i = 0; i < 22; i++) trees.push([(r() * 2 - 1) * (LS + 6), -12 + r() * 18, 2.2 + r() * 1.8, r()]);
  for (let i = 0; i < 40; i++) { const a = r() * PI * 2, rad = 85 + r() * 30; trees.push([Math.cos(a) * rad * 1.1, Math.sin(a) * rad * 0.75, 2.2 + r() * 1.8, r()]); }
  const tI = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.18, 0.25, 3, 7), mat('MeshStandardMaterial', { color: 0x5b4636, roughness: 1 }), trees.length);
  const cI = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), mat('MeshStandardMaterial', { color: 0xffffff, roughness: 0.95, flatShading: true, envMapIntensity: 0.35 }), trees.length);
  const mtx = new THREE.Matrix4(), col = new THREE.Color(), q0 = new THREE.Quaternion();
  trees.forEach(([x, z, s, c], i) => {
    mtx.makeTranslation(x, 1.5, z); tI.setMatrixAt(i, mtx);
    mtx.compose(new V3(x, 3 + s * 0.8, z), q0, new V3(s, s * 1.15, s)); cI.setMatrixAt(i, mtx);
    cI.setColorAt(i, col.setHSL(0.25 + c * 0.06, 0.5, 0.17 + c * 0.08));
  });
  tI.castShadow = cI.castShadow = true; scene.add(tI, cI);

  // ring of buildings on the horizon
  const rb = rng(3), bg = new THREE.Group();
  for (let i = 0; i < 46; i++) {
    const a = i / 46 * PI * 2 + rb() * 0.05, rad = 200 + rb() * 80, w = 18 + rb() * 24, d = 12 + rb() * 12, h = 9 + rb() * 18;
    const geo = new THREE.BoxGeometry(w, h, d), uv = geo.attributes.uv;
    for (let f = 0; f < 6; f++) for (let v = 0; v < 4; v++) { const k = f * 4 + v, fw = (f < 2) ? d : w; uv.setXY(k, uv.getX(k) * fw / 7.5, uv.getY(k) * h / 6.4); }
    const mt = buildMats[i % buildMats.length], b = mesh(geo, [mt, mt, roofMat, roofMat, mt, mt], false, false);
    b.position.set(Math.cos(a) * rad, h / 2, Math.sin(a) * rad); b.rotation.y = -a + PI / 2; bg.add(b);
  }
  scene.add(bg);
  return sky;
}

// ───────────────────────── drive cycle ─────────────────────────
// run → brake → dwell (doors open and close) → ready. Once both trams are ready
// they set off together, do a lap and brake for the stop again.
function distToStop(T) { const L = T.loop.length; return ((((T.stop.s - T.s) * T.dir) % L) + L) % L; }
function drive(T, dt) {
  T.phaseT += dt;
  if (T.phase === 'run') {
    if (T.hold > 0) { T.hold -= dt; return; }
    T.v = Math.min(T.vmax, T.v + ACC * dt);
    T.s += T.dir * T.v * dt;
    const ds = distToStop(T);
    if (ds < T.v * T.v / (2 * DEC) + 0.5 && ds < T.loop.length / 2) T.phase = 'brake';
  } else if (T.phase === 'brake') {
    const ds = distToStop(T);
    if (ds < 0.03 || ds > T.loop.length - 3) { T.s = T.stop.s; T.v = 0; T.phase = 'dwell'; T.phaseT = 0; }
    else { T.v = Math.max(0.25, Math.min(T.v, Math.sqrt(2 * DEC * ds))); T.s += T.dir * Math.min(ds, T.v * dt); }
  } else if (T.phase === 'dwell') {
    const sd = T.stop.side;
    if (T.phaseT > 0.8 && T.phaseT < DWELL) T.doorTarget[sd] = 1;
    if (T.phaseT >= DWELL) { T.doorTarget[sd] = 0; if (T.doorOpen[sd] <= 1e-4) T.phase = 'ready'; }
  }
}

// ───────────────────────── setup ─────────────────────────
function init(container) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  } catch (e) {
    container.hidden = true; // no WebGL: leave the page as it is
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.9;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden', 'true');
  container.prepend(canvas);

  scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.08, 2000);
  camera.position.copy(HOME_CAM.pos);
  const controls = new OrbitControls(camera, canvas);
  controls.target.copy(HOME_CAM.target);
  controls.enableDamping = true; controls.dampingFactor = 0.08;
  controls.maxPolarAngle = PI * 0.48; controls.minDistance = 5; controls.maxDistance = 170;
  controls.update(); controls.saveState();
  // Vertical swipes keep scrolling the page on touch screens; horizontal drags rotate.
  canvas.style.touchAction = 'pan-y';
  // The mouse wheel scrolls the page unless Ctrl/Cmd is held, so the scene does not trap scrolling.
  container.addEventListener('wheel', e => { controls.enableZoom = e.ctrlKey || e.metaKey; }, { capture: true, passive: true });
  container.addEventListener('pointerdown', () => { controls.enableZoom = true; }, { capture: true });

  const sky = buildWorld(renderer);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const trams = ['dvg', 'rb'].map(k => {
    const T = new Tram(VARIANTS[k]);
    T.loop = T.path = LOOPS[k]; T.stop = STOPS[k]; T.dir = STOPS[k].dir;
    // equal lap times on both loops, so the trams arrive together
    T.vmax = VMAX * LOOPS[k].length / LOOPS.dvg.length;
    T.hold = 0;
    if (reduceMotion) { T.s = T.stop.s; T.phase = 'dwell'; }
    else {
      // start on the curve, out of view, at full speed; the Ruhrbahn arrives a little later
      const away = (k === 'dvg' ? 72 : 78) * T.vmax / VMAX;
      T.s = T.stop.s - T.dir * away; T.v = T.vmax; T.phase = 'run';
    }
    T.pose(T.path, T.s); T.animate(10); // pantograph straight up to the wire
    T.setLights(true, false, T.dir > 0);
    return T;
  });

  // hint and reset button
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const hint = document.createElement('div');
  hint.className = 'tram-hero__hint';
  hint.textContent = coarse ? 'Seitlich wischen zum Drehen · zwei Finger zum Zoomen' : 'Ziehen zum Drehen · Strg + Mausrad zum Zoomen · Rechtsklick zum Verschieben';
  const reset = document.createElement('button');
  reset.type = 'button'; reset.className = 'tram-hero__reset'; reset.textContent = 'Ansicht zurücksetzen'; reset.hidden = true;
  reset.addEventListener('click', () => { controls.reset(); reset.hidden = true; });
  controls.addEventListener('start', () => { reset.hidden = false; hint.classList.add('tram-hero__hint--hidden'); });
  container.append(hint, reset);
  setTimeout(() => hint.classList.add('tram-hero__hint--hidden'), 8000);

  function resize() {
    const w = container.clientWidth, h = container.clientHeight; if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w / h < 1.4 ? 52 : 38;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(container);
  resize();

  function update(dt) {
    if (!reduceMotion) {
      for (const T of trams) drive(T, dt);
      if (trams.every(T => T.phase === 'ready')) trams.forEach((T, i) => { T.phase = 'run'; T.phaseT = 0; T.hold = i * 1.2; });
    }
    for (const T of trams) { T.pose(T.path, T.s); T.animate(dt); }
    controls.update();
    if (controls.target.y < 0) controls.target.y = 0;
    sky.position.copy(camera.position);
  }

  // only animate while the scene is on screen
  let visible = false, running = false, last = 0;
  function frame(now) {
    if (!visible || document.hidden) { running = false; return; }
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016); last = now;
    update(dt);
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  function start() { if (running || !visible || document.hidden) return; running = true; last = performance.now(); requestAnimationFrame(frame); }
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; start(); }).observe(container);
  document.addEventListener('visibilitychange', start);

  renderer.render(scene, camera);
  container.classList.add('tram-hero--ready');
}

const heroContainer = document.getElementById('tram-hero');
if (heroContainer) init(heroContainer);
