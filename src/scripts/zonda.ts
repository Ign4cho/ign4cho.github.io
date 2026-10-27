// Viento Zonda de la vista San Juan. Un solo valor de viento (0 = calma,
// 1 = Zonda pleno) mueve todo: las tarjetas colgadas se hamacan como péndulos,
// las letras del título se inclinan, el polvo cruza la pantalla, el cielo se
// pone ocre y las tecnologías de la caja (física con matter-js) salen volando.
//
// El viento sube con el botón «Soplar el Zonda», con ráfagas chicas al azar y
// al mover el mouse rápido. Con «reducir movimiento» no corre nada.

import Matter from "matter-js";

const root = document.querySelector<HTMLElement>("[data-sj]")!;
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const L = (root.dataset.lang ?? "es") as "es" | "en";
const ETIQUETAS =
  L === "en"
    ? ["calm", "breeze", "gusts", "Zonda", "full Zonda"]
    : ["calma", "brisa", "ráfagas", "Zonda", "Zonda pleno"];

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

if (!reduce) iniciar();

function iniciar() {
  root.classList.add("sj-vivo");

  // ── Viento ────────────────────────────────────────────────
  let viento = 0.06;
  let objetivo = 0.06;
  let zondaHasta = 0;
  let rafagaHasta = 0;
  const btn = root.querySelector<HTMLButtonElement>("[data-zonda]");
  const lblViento = root.querySelector<HTMLElement>("[data-viento]");
  const lblTemp = root.querySelector<HTMLElement>("[data-temp]");
  const lblVel = root.querySelector<HTMLElement>("[data-vel]");

  const soplar = (segundos = 6) => {
    zondaHasta = performance.now() + segundos * 1000;
    btn?.setAttribute("aria-pressed", "true");
  };
  btn?.addEventListener("click", () => {
    if (performance.now() < zondaHasta) {
      zondaHasta = 0;
      btn.setAttribute("aria-pressed", "false");
    } else soplar();
  });

  // ráfagas chicas al azar
  const programarRafaga = () =>
    setTimeout(() => {
      rafagaHasta = performance.now() + 1200 + Math.random() * 1600;
      programarRafaga();
    }, 5000 + Math.random() * 7000);
  programarRafaga();

  // mover el mouse rápido de costado también levanta viento
  let ultX = 0;
  let ultT = 0;
  let empujon = 0;
  addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    const now = performance.now();
    const v = Math.abs(e.clientX - ultX) / Math.max(1, now - ultT);
    ultX = e.clientX;
    ultT = now;
    empujon = Math.max(empujon, clamp((v - 1.2) * 0.12, 0, 0.35));
  });

  // ── Péndulos: tarjetas colgadas, la foto, los carteles ────
  type Pendulo = { el: HTMLElement; a: number; w: number; masa: number; fase: number };
  const pendulos: Pendulo[] = [...root.querySelectorAll<HTMLElement>("[data-hamaca]")].map((el, i) => ({
    el,
    a: 0,
    w: 0,
    masa: Number(el.dataset.hamaca || 1),
    fase: i * 1.7,
  }));
  const letras = [...root.querySelectorAll<HTMLElement>("[data-letra]")];

  // ── Polvo ─────────────────────────────────────────────────
  const cv = root.querySelector<HTMLCanvasElement>("[data-polvo]")!;
  const ctx = cv.getContext("2d")!;
  type Grano = { x: number; y: number; v: number; r: number; o: number };
  let granos: Grano[] = [];
  const dpr = Math.min(devicePixelRatio, 1.5);
  const medir = () => {
    cv.width = innerWidth * dpr;
    cv.height = innerHeight * dpr;
  };
  medir();
  addEventListener("resize", medir);
  const nuevoGrano = (x = -10): Grano => ({
    x,
    y: Math.random() * innerHeight,
    v: 0.6 + Math.random() * 1.4,
    r: 0.6 + Math.random() * 2.2,
    o: 0.15 + Math.random() * 0.5,
  });

  // ── Caja de tecnologías (matter-js) ───────────────────────
  const caja = root.querySelector<HTMLElement>("[data-caja]");
  const fisica = caja ? cajaFisica(caja) : null;

  // ── Loop ──────────────────────────────────────────────────
  let ultimo = performance.now();
  const tick = (now: number) => {
    const dt = Math.min(0.05, (now - ultimo) / 1000);
    ultimo = now;
    const t = now / 1000;

    const zonda = now < zondaHasta;
    if (!zonda && btn?.getAttribute("aria-pressed") === "true") btn.setAttribute("aria-pressed", "false");
    const brisa = 0.06 + Math.sin(t * 0.7) * 0.03 + Math.sin(t * 1.9) * 0.015;
    objetivo = zonda ? 0.85 + Math.sin(t * 3.1) * 0.12 + Math.sin(t * 7.3) * 0.05 : now < rafagaHasta ? 0.3 : brisa;
    objetivo = Math.max(objetivo, empujon);
    empujon *= Math.exp(-dt * 1.5);
    viento += (objetivo - viento) * (1 - Math.exp(-dt * (objetivo > viento ? 2.2 : 0.9)));

    root.style.setProperty("--viento", viento.toFixed(3));
    const nivel = viento < 0.12 ? 0 : viento < 0.25 ? 1 : viento < 0.5 ? 2 : viento < 0.8 ? 3 : 4;
    if (lblViento && lblViento.textContent !== ETIQUETAS[nivel]) lblViento.textContent = ETIQUETAS[nivel];
    if (lblTemp) lblTemp.textContent = String(Math.round(24 + viento * 14));
    if (lblVel) lblVel.textContent = String(Math.round(6 + viento * 84));

    // péndulos: torque del viento con turbulencia, resorte y amortiguación
    for (const p of pendulos) {
      const turb = Math.sin(t * 2.3 + p.fase) * 0.5 + Math.sin(t * 5.1 + p.fase * 2) * 0.3;
      const fuerza = (viento * (1 + turb * 0.6) * 9) / p.masa;
      const acc = fuerza - 18 * p.a - 2.6 * p.w;
      p.w += acc * dt;
      p.a += p.w * dt;
      // si la tarjeta está fuera de pantalla no hace falta tocar el DOM
      p.el.style.setProperty("--a", `${(p.a * 18).toFixed(2)}deg`);
    }
    letras.forEach((el, i) => {
      const s = Math.sin(t * 3 + i * 0.6) * viento;
      el.style.transform = `translate(${(viento * 10 + s * 6).toFixed(1)}px, ${(s * -3).toFixed(1)}px) skewX(${(-viento * 14).toFixed(1)}deg)`;
    });

    // polvo
    const meta = Math.round(viento * viento * 260);
    while (granos.length < meta) granos.push(nuevoGrano(Math.random() * innerWidth));
    if (granos.length > meta + 30) granos = granos.slice(0, meta + 30);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    ctx.fillStyle = "#e9b26a";
    for (const g of granos) {
      g.x += g.v * (2 + viento * 22) * dt * 60;
      g.y += Math.sin(g.x * 0.01 + t) * 0.4;
      if (g.x > innerWidth + 10) Object.assign(g, nuevoGrano());
      ctx.globalAlpha = g.o * clamp(viento * 1.6);
      ctx.beginPath();
      ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    fisica?.paso(viento, dt);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function cajaFisica(caja: HTMLElement) {
  const { Engine, Bodies, Body, Composite, Mouse, MouseConstraint, Events } = Matter;
  const chips = [...caja.querySelectorAll<HTMLElement>("[data-chip]")];
  const engine = Engine.create({ gravity: { x: 0, y: 1, scale: 0.0012 } });
  let cuerpos: { b: Matter.Body; el: HTMLElement; w: number; h: number }[] = [];
  let paredes: Matter.Body[] = [];
  let arrancado = false;

  const armarParedes = () => {
    Composite.remove(engine.world, paredes);
    const w = caja.clientWidth;
    const h = caja.clientHeight;
    const g = 200;
    paredes = [
      Bodies.rectangle(w / 2, h + g / 2, w * 3, g, { isStatic: true, friction: 0.8 }),
      Bodies.rectangle(-g / 2, h / 2, g, h * 4, { isStatic: true }),
      Bodies.rectangle(w + g / 2, h / 2, g, h * 4, { isStatic: true }),
      Bodies.rectangle(w / 2, -h - g / 2, w * 3, g, { isStatic: true }),
    ];
    Composite.add(engine.world, paredes);
  };

  const arrancar = () => {
    if (arrancado) return;
    arrancado = true;
    caja.classList.add("sj-caja-viva");
    armarParedes();
    const w = caja.clientWidth;
    cuerpos = chips.map((el, i) => {
      const cw = el.offsetWidth;
      const ch = el.offsetHeight;
      const b = Bodies.rectangle(40 + Math.random() * (w - 80), -60 - i * 50, cw, ch, {
        chamfer: { radius: ch / 2 },
        restitution: 0.35,
        friction: 0.4,
        frictionAir: 0.012,
        angle: (Math.random() - 0.5) * 0.6,
      });
      return { b, el, w: cw, h: ch };
    });
    Composite.add(engine.world, cuerpos.map((c) => c.b));

    const mouse = Mouse.create(caja);
    // matter-js escucha la ruedita: se la saco para que la página siga scrolleando
    const m = mouse as unknown as { element: HTMLElement; mousewheel: EventListener };
    m.element.removeEventListener("wheel", m.mousewheel);
    m.element.removeEventListener("mousewheel", m.mousewheel);
    m.element.removeEventListener("DOMMouseScroll", m.mousewheel);
    const mc = MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.2, render: { visible: false } } });
    Composite.add(engine.world, mc);
    Events.on(mc, "startdrag", () => caja.classList.add("sj-agarrando"));
    Events.on(mc, "enddrag", () => caja.classList.remove("sj-agarrando"));
  };

  new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting) arrancar();
    },
    { threshold: 0.35 },
  ).observe(caja);
  let ancho = caja.clientWidth;
  addEventListener("resize", () => {
    if (!arrancado || caja.clientWidth === ancho) return;
    ancho = caja.clientWidth;
    armarParedes();
    cuerpos.forEach(({ b }) => Body.setPosition(b, { x: clamp(b.position.x, 20, ancho - 20), y: Math.min(b.position.y, caja.clientHeight - 20) }));
  });

  return {
    paso(viento: number, dt: number) {
      if (!arrancado) return;
      // el viento empuja de izquierda a derecha y levanta un poco (con ráfagas)
      const f = viento * viento * 0.0026;
      for (const { b } of cuerpos) {
        Body.applyForce(b, b.position, {
          x: f * b.mass * (0.7 + Math.random() * 0.6),
          y: -f * b.mass * Math.random() * 0.9,
        });
      }
      Engine.update(engine, dt * 1000);
      for (const { b, el, w, h } of cuerpos) {
        el.style.transform = `translate(${(b.position.x - w / 2).toFixed(1)}px, ${(b.position.y - h / 2).toFixed(1)}px) rotate(${b.angle.toFixed(3)}rad)`;
      }
    },
  };
}
