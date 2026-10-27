// Imprenta del pliego (adaptada del pliego de Amine): cada panel se dibuja en
// dos "tintas", rojo fluo y azul, como en una risografía. El resultado es una
// máscara RGBA donde R = cobertura del rojo y G = cobertura del azul; el shader
// las combina sobre el papel y las desfasa cuando el pliego se mueve.

export const TW = 1000; // unidades de diseño del panel
export const TH = 1333;

export const INK = { paper: '#f4eee2', acento: '#ff6a4d', ink: '#1f2d4d', back: '#e4dccd' };

export interface PrintData {
  nombre: string;
  apellido: string;
  rol: string;
  sitio: string;
  t: Record<'abrir' | 'experiencia' | 'proyectos' | 'stack' | 'formacion' | 'contacto' | 'escribime' | 'fin' | 'trayectoria' | 'loQueHice' | 'herramientas' | 'estudios' | 'pliego' | 'base', string>;
  experiencia: { empresa: string; rol: string; periodo: string }[];
  proyectos: { titulo: string; meta: string }[];
  stack: { area: string; items: string[] }[];
  estudios: { titulo: string; institucion: string; anio: string }[];
  contacto: [string, string][];
  images: Record<'foto' | 'elargot' | 'tesis', HTMLImageElement>;
}

type Ctx = CanvasRenderingContext2D;
interface Plate { must: Ctx; ink: Ctx }

const F = {
  display: (s: number) => `400 ${s}px "Bebas Neue", "Arial Narrow", sans-serif`,
  mono: (s: number, w = 400) => `${w} ${s}px "Courier Prime", "Courier New", monospace`,
  sans: (s: number, w = 400) => `${w} ${s}px Outfit, system-ui, sans-serif`,
};

function canvas(w: number, h: number) {
  const c = document.createElement('canvas');
  c.width = Math.round(w);
  c.height = Math.round(h);
  return c;
}

function plate(scale: number): Plate & { canvases: HTMLCanvasElement[] } {
  const mk = () => {
    const c = canvas(TW * scale, TH * scale);
    const ctx = c.getContext('2d', { willReadFrequently: true })!;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.scale(scale, scale);
    ctx.fillStyle = '#000';
    ctx.strokeStyle = '#000';
    return ctx;
  };
  const must = mk();
  const ink = mk();
  return { must, ink, canvases: [must.canvas, ink.canvas] };
}

function text(ctx: Ctx, str: string, x: number, y: number, font: string, opts: { align?: CanvasTextAlign; maxW?: number; lh?: number; tracking?: number } = {}) {
  ctx.font = font;
  ctx.textAlign = opts.align ?? 'left';
  ctx.textBaseline = 'alphabetic';
  if (opts.tracking) (ctx as Ctx & { letterSpacing: string }).letterSpacing = `${opts.tracking}px`;
  if (!opts.maxW) {
    ctx.fillText(str, x, y);
  } else {
    const lh = opts.lh ?? 1.3 * parseFloat(font.split('px')[0].split(' ').pop()!);
    let line = '';
    let yy = y;
    for (const word of str.split(' ')) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > opts.maxW && line) {
        ctx.fillText(line, x, yy);
        line = word;
        yy += lh;
      } else line = test;
    }
    ctx.fillText(line, x, yy);
    y = yy;
  }
  if (opts.tracking) (ctx as Ctx & { letterSpacing: string }).letterSpacing = '0px';
  return y;
}

// Ajusta el cuerpo de una palabra para que ocupe exactamente `w` de ancho.
function fit(ctx: Ctx, str: string, w: number, family: (s: number) => string) {
  ctx.font = family(100);
  return (100 * w) / ctx.measureText(str).width;
}

function rule(ctx: Ctx, x1: number, y: number, x2: number, wgt = 3) {
  ctx.fillRect(x1, y - wgt / 2, x2 - x1, wgt);
}

// Trama de puntos a partir de la luminancia de la imagen, recortada a object-fit: cover.
function halftone(ctx: Ctx, img: HTMLImageElement, x: number, y: number, w: number, h: number, cell = 9, rot = 0) {
  const cols = Math.ceil(w / cell);
  const rows = Math.ceil(h / cell);
  const s = canvas(cols, rows);
  const sc = s.getContext('2d', { willReadFrequently: true })!;
  const k = Math.max(cols / img.naturalWidth, rows / img.naturalHeight);
  const iw = img.naturalWidth * k;
  const ih = img.naturalHeight * k;
  sc.drawImage(img, (cols - iw) / 2, (rows - ih) / 2, iw, ih);
  const d = sc.getImageData(0, 0, cols, rows).data;
  let lo = 1;
  let hi = 0;
  for (let i = 0; i < d.length; i += 4) {
    const l = (0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]) / 255;
    lo = Math.min(lo, l);
    hi = Math.max(hi, l);
  }
  const range = Math.max(0.2, hi - lo);
  ctx.save();
  ctx.translate(x + w / 2, y + h / 2);
  ctx.rotate(rot);
  ctx.beginPath();
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = (r * cols + c) * 4;
      const lum = ((0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]) / 255 - lo) / range;
      let dark = 1 - lum;
      dark = Math.min(1, Math.max(0, (dark - 0.06) * 1.2)) ** 0.85;
      if (dark < 0.02) continue;
      const rad = cell * 0.56 * Math.sqrt(dark);
      const cx = -w / 2 + c * cell + cell / 2 + (r % 2 ? cell / 2 : 0);
      const cy = -h / 2 + r * cell + cell / 2;
      ctx.moveTo(cx + rad, cy);
      ctx.arc(cx, cy, rad, 0, Math.PI * 2);
    }
  }
  ctx.fill();
  ctx.restore();
}

function block(ctx: Ctx, x: number, y: number, w: number, h: number, rot = 0) {
  ctx.save();
  ctx.translate(x + w / 2, y + h / 2);
  ctx.rotate(rot);
  ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.restore();
}

function header(p: Plate, n: number, label: string) {
  text(p.ink, `${String(n).padStart(2, '0')} / 05`, 70, 96, F.mono(26, 700));
  text(p.ink, label.toUpperCase(), 930, 96, F.mono(26), { align: 'right' });
  rule(p.ink, 70, 122, 930, 3);
}

function footer(p: Plate, d: PrintData, n: number) {
  rule(p.ink, 70, 1238, 930, 2);
  text(p.ink, `${d.apellido.toUpperCase()} · ${d.t.pliego.toUpperCase()}`, 70, 1278, F.mono(22, 700));
  text(p.ink, `— ${n} —`, 930, 1278, F.mono(22), { align: 'right' });
}

const PANELS: ((p: Plate, d: PrintData) => void)[] = [
  // 0 · Portada
  (p, d) => {
    p.must.fillRect(0, 0, TW, 760);
    text(p.ink, d.t.pliego.toUpperCase(), 70, 96, F.mono(26, 700));
    text(p.ink, 'SAN JUAN · ARGENTINA', 930, 96, F.mono(26), { align: 'right' });
    rule(p.ink, 70, 122, 930, 3);
    const size = fit(p.ink, d.apellido.toUpperCase(), 860, F.display);
    text(p.ink, d.apellido.toUpperCase(), 66, 150 + size * 0.84, F.display(size));
    text(p.ink, d.nombre.toUpperCase(), 70, 150 + size * 0.84 + 70, F.mono(40, 700), { tracking: 10 });
    halftone(p.ink, d.images.foto, 470, 560, 460, 600, 8, 0.03);
    block(p.must, 494, 584, 460, 600, 0.03);
    text(p.ink, d.rol, 70, 860, F.sans(36, 500), { maxW: 360, lh: 46 });
    rule(p.ink, 70, 1238, 930, 2);
    text(p.ink, d.t.abrir.toUpperCase(), 70, 1278, F.mono(22, 700));
    text(p.ink, d.sitio.toUpperCase(), 930, 1278, F.mono(22), { align: 'right' });
  },
  // 1 · Experiencia
  (p, d) => {
    text(p.must, '01', 1010, 760, F.display(860), { align: 'right' });
    header(p, 1, d.t.trayectoria);
    text(p.ink, d.t.experiencia.toUpperCase(), 66, 300, F.display(fit(p.ink, d.t.experiencia.toUpperCase(), 860, F.display) * 0.98));
    let y = 400;
    d.experiencia.slice(0, 4).forEach((e, i) => {
      rule(p.ink, 70, y, 930, 2);
      text(p.ink, `0${i + 1}`, 70, y + 66, F.mono(26, 700));
      text(p.ink, e.empresa.toUpperCase(), 150, y + 76, F.display(76));
      text(p.ink, e.rol, 150, y + 120, F.sans(26, 500), { maxW: 560 });
      text(p.ink, e.periodo.toUpperCase(), 930, y + 66, F.mono(20, 700), { align: 'right' });
      y += 200;
    });
    footer(p, d, 1);
  },
  // 2 · Proyectos
  (p, d) => {
    header(p, 2, d.t.loQueHice);
    text(p.ink, d.t.proyectos.toUpperCase(), 66, 300, F.display(fit(p.ink, d.t.proyectos.toUpperCase(), 860, F.display)));
    block(p.must, 96, 380, 830, 400, -0.03);
    halftone(p.ink, d.images.elargot, 70, 360, 830, 400, 7, -0.03);
    let y = 860;
    d.proyectos.slice(0, 4).forEach((pr) => {
      rule(p.ink, 70, y, 930, 2);
      text(p.ink, pr.meta.toUpperCase(), 70, y + 38, F.mono(20, 700));
      text(p.ink, pr.titulo, 70, y + 78, F.sans(30, 600), { maxW: 860 });
      y += 92;
    });
    footer(p, d, 2);
  },
  // 3 · Stack
  (p, d) => {
    header(p, 3, d.t.herramientas);
    text(p.ink, 'STACK', 66, 330, F.display(260));
    let y = 430;
    d.stack.forEach((g, gi) => {
      text(p.ink, g.area.toUpperCase(), 70, y, F.mono(24, 700));
      y += 20;
      let x = 70;
      g.items.forEach((it) => {
        p.ink.font = F.display(66);
        const w = p.ink.measureText(it.toUpperCase()).width + 36;
        if (x + w > 930) {
          x = 70;
          y += 86;
        }
        if (gi % 2 === 0) block(p.must, x, y + 8, w, 72);
        else p.ink.strokeRect(x, y + 8, w, 72);
        text(p.ink, it.toUpperCase(), x + 18, y + 68, F.display(66));
        x += w + 14;
      });
      y += 140;
    });
    footer(p, d, 3);
  },
  // 4 · Formación
  (p, d) => {
    header(p, 4, d.t.estudios);
    text(p.ink, d.t.formacion.toUpperCase(), 66, 300, F.display(fit(p.ink, d.t.formacion.toUpperCase(), 860, F.display)));
    block(p.must, 70, 360, 380, 380, 0.04);
    text(p.ink, 'UNSJ', 260, 610, F.display(180), { align: 'center' });
    halftone(p.ink, d.images.tesis, 500, 360, 430, 380, 6);
    let y = 830;
    d.estudios.forEach((e) => {
      rule(p.ink, 70, y, 930, 2);
      text(p.ink, e.anio, 70, y + 44, F.mono(22, 700));
      text(p.ink, e.titulo, 180, y + 46, F.sans(28, 600), { maxW: 750, lh: 34 });
      y += 130;
    });
    footer(p, d, 4);
  },
  // 5 · Contacto
  (p, d) => {
    p.must.fillRect(0, 0, TW, TH);
    header(p, 5, d.t.contacto);
    const size = fit(p.ink, d.t.escribime.toUpperCase(), 860, F.display);
    text(p.ink, d.t.escribime.toUpperCase(), 66, 150 + size * 0.84, F.display(size));
    let y = 560;
    d.contacto.forEach(([k, v]) => {
      rule(p.ink, 70, y, 930, 2);
      text(p.ink, k.toUpperCase(), 70, y + 50, F.mono(24, 700));
      const s = Math.min(64, fit(p.ink, v, 860, F.display));
      text(p.ink, v, 70, y + 122, F.display(s));
      y += 160;
    });
    rule(p.ink, 70, 1238, 930, 2);
    text(p.ink, `${d.apellido.toUpperCase()} · ${d.t.pliego.toUpperCase()}`, 70, 1278, F.mono(22, 700));
    text(p.ink, d.t.fin.toUpperCase(), 930, 1278, F.mono(22, 700), { align: 'right' });
  },
];

export const PANEL_COUNT = PANELS.length;

export interface PrintedPanel {
  mask: HTMLCanvasElement; // R acento, G tinta
  proof: () => HTMLCanvasElement; // prueba en color (para la versión sin 3D)
}

export function printPanels(d: PrintData, scale: number): PrintedPanel[] {
  return PANELS.map((draw) => {
    const p = plate(scale);
    draw(p, d);
    const [mc] = p.canvases;
    const w = mc.width;
    const h = mc.height;
    const m = p.must.getImageData(0, 0, w, h).data;
    const k = p.ink.getImageData(0, 0, w, h).data;
    const out = canvas(w, h);
    const oc = out.getContext('2d')!;
    const img = oc.createImageData(w, h);
    for (let i = 0; i < m.length; i += 4) {
      img.data[i] = 255 - m[i];
      img.data[i + 1] = 255 - k[i];
      img.data[i + 2] = 0;
      img.data[i + 3] = 255;
    }
    oc.putImageData(img, 0, 0);
    return { mask: out, proof: () => proof(img, w, h) };
  });
}

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);

function proof(mask: ImageData, w: number, h: number) {
  const c = canvas(w, h);
  const ctx = c.getContext('2d')!;
  const out = ctx.createImageData(w, h);
  const [pa, mu, ik] = [hex(INK.paper), hex(INK.acento), hex(INK.ink)];
  for (let i = 0; i < mask.data.length; i += 4) {
    const a = mask.data[i] / 255;
    const b = mask.data[i + 1] / 255;
    for (let ch = 0; ch < 3; ch++) {
      const v = pa[ch] * (1 - a + a * mu[ch]) * (1 - b + b * ik[ch]);
      out.data[i + ch] = Math.round(v * 255);
    }
    out.data[i + 3] = 255;
  }
  ctx.putImageData(out, 0, 0);
  return c;
}

// Relieve del papel: fibras al azar convertidas en un normal map.
export function paperNormal(size = 512) {
  const c = canvas(size, size);
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 2600; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const a = Math.random() * Math.PI;
    const l = 4 + Math.random() * 22;
    const v = Math.random() > 0.5 ? 255 : 0;
    ctx.strokeStyle = `rgba(${v},${v},${v},${0.05 + Math.random() * 0.12})`;
    ctx.lineWidth = 0.6 + Math.random() * 1.2;
    for (const [dx, dy] of [[0, 0], [size, 0], [-size, 0], [0, size], [0, -size]]) {
      ctx.beginPath();
      ctx.moveTo(x + dx, y + dy);
      ctx.lineTo(x + dx + Math.cos(a) * l, y + dy + Math.sin(a) * l);
      ctx.stroke();
    }
  }
  const src = ctx.getImageData(0, 0, size, size).data;
  const out = ctx.createImageData(size, size);
  const hAt = (x: number, y: number) => src[(((y + size) % size) * size + ((x + size) % size)) * 4] / 255;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = (hAt(x + 1, y) - hAt(x - 1, y)) * 2.2;
      const dy = (hAt(x, y + 1) - hAt(x, y - 1)) * 2.2;
      const len = Math.hypot(dx, dy, 1);
      const i = (y * size + x) * 4;
      out.data[i] = ((-dx / len) * 0.5 + 0.5) * 255;
      out.data[i + 1] = ((dy / len) * 0.5 + 0.5) * 255;
      out.data[i + 2] = ((1 / len) * 0.5 + 0.5) * 255;
      out.data[i + 3] = 255;
    }
  }
  ctx.putImageData(out, 0, 0);
  return c;
}
