#!/usr/bin/env node
// Clips de los proyectos para el hover de la vista clásica: abre cada sitio en
// Edge/Chrome headless (CDP, como shot.mjs), baja la página de a poco sacando un
// cuadro por paso y arma un mp4 con ffmpeg en public/clips/<id>.mp4.
//
//   npm run clips                 # todos
//   node scripts/clips.mjs elargot  # uno (id de perfil.ts o alias de abajo)
//
// Requiere ffmpeg en el PATH.

import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITIOS = [
  { id: "tienda_online", alias: "elargot", url: "https://demo.elargot.com/?template=onyx&color=orange" },
  { id: "espacioamine", alias: "amine", url: "https://espacioamine.com" },
  { id: "experimentos_amine", alias: "pliego", url: "https://fold.espacioamine.com", pausa: 90 },
];
const W = 1280;
const H = 800;
const CUADROS = 132; // 5,5 s a 24 fps
const FPS = 24;

const pedido = process.argv[2];
const lista = pedido ? SITIOS.filter((s) => s.id === pedido || s.alias === pedido) : SITIOS;
if (!lista.length) throw new Error(`No conozco «${pedido}». Opciones: ${SITIOS.map((s) => s.alias).join(", ")}`);

const browser = [
  process.env.EDGE_PATH,
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
].filter(Boolean).find((p) => existsSync(p));
if (!browser) throw new Error("No encontré Edge/Chrome. Definí EDGE_PATH.");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);
mkdirSync(join(raiz, "public/clips"), { recursive: true });

for (const sitio of lista) {
  const port = 9200 + Math.floor(Math.random() * 700);
  const proc = spawn(browser, [
    "--headless=new", "--disable-gpu", "--no-sandbox", "--hide-scrollbars", "--no-first-run", "--disable-extensions",
    "--autoplay-policy=no-user-gesture-required",
    `--user-data-dir=${join(tmpdir(), `cdp-clip-${port}`)}`, `--remote-debugging-port=${port}`, "about:blank",
  ], { stdio: "ignore" });
  const dir = mkdtempSync(join(tmpdir(), `clip-${sitio.alias}-`));
  let id = 0;
  try {
    let wsUrl;
    for (let i = 0; i < 60 && !wsUrl; i++) {
      try {
        const r = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" });
        if (r.ok) wsUrl = (await r.json()).webSocketDebuggerUrl;
      } catch { /* todavía no levantó */ }
      if (!wsUrl) await sleep(200);
    }
    if (!wsUrl) throw new Error("CDP no respondió");
    const ws = new WebSocket(wsUrl);
    await new Promise((res, rej) => { ws.addEventListener("open", res, { once: true }); ws.addEventListener("error", rej, { once: true }); });
    const cmd = (method, params = {}) => new Promise((resolve, reject) => {
      const n = ++id;
      const onMsg = (ev) => {
        const m = JSON.parse(ev.data);
        if (m.id !== n) return;
        ws.removeEventListener("message", onMsg);
        m.error ? reject(new Error(`${method}: ${m.error.message}`)) : resolve(m.result);
      };
      ws.addEventListener("message", onMsg);
      ws.send(JSON.stringify({ id: n, method, params }));
    });
    const evaluate = async (expression) => (await cmd("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true })).result?.value;

    await cmd("Page.enable");
    await cmd("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: 1, mobile: false, screenWidth: W, screenHeight: H });
    const cargada = new Promise((res) => {
      const t = setTimeout(res, 30000);
      ws.addEventListener("message", (ev) => { if (JSON.parse(ev.data).method === "Page.loadEventFired") { clearTimeout(t); res(); } });
    });
    await cmd("Page.navigate", { url: sitio.url });
    await cargada;
    await evaluate("document.fonts.ready.then(() => true)");
    await sleep(2500);
    console.log(`${sitio.alias}: cargado, grabando…`);

    const alto = await evaluate("document.documentElement.scrollHeight - innerHeight");
    const recorrido = Math.min(alto, H * 3.2);
    for (let f = 0; f < CUADROS; f++) {
      // quieto el primer medio segundo y el último, bajando en el medio
      const x = Math.min(1, Math.max(0, (f - 12) / (CUADROS - 30)));
      await evaluate(`window.scrollTo(0, ${Math.round(ease(x) * recorrido)})`);
      await sleep(sitio.pausa ?? 40);
      const { data } = await cmd("Page.captureScreenshot", { format: "jpeg", quality: 85 });
      await writeFile(join(dir, `f${String(f).padStart(4, "0")}.jpg`), Buffer.from(data, "base64"));
    }
    ws.close();

    const out = join(raiz, "public/clips", `${sitio.id}.mp4`);
    const r = spawnSync("ffmpeg", [
      "-loglevel", "error", "-y", "-framerate", String(FPS), "-i", join(dir, "f%04d.jpg"),
      "-vf", "scale=720:-2", "-c:v", "libx264", "-preset", "slow", "-crf", "30", "-pix_fmt", "yuv420p",
      "-movflags", "+faststart", "-an", out,
    ], { stdio: "inherit" });
    if (r.status !== 0) throw new Error("ffmpeg falló");
    console.log("OK ->", out);
  } catch (e) {
    console.error(`Error en ${sitio.alias}:`, e.message);
    process.exitCode = 1;
  } finally {
    try { proc.kill(); } catch {}
    rmSync(dir, { recursive: true, force: true });
  }
}
