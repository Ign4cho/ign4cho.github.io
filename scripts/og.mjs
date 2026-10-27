#!/usr/bin/env node
// Imágenes de vista previa (Open Graph) de cada vista: captura 1200 × 630 de la
// vista en español y la guarda en public/og/<id>.png (las usa HeadComun).
// Necesita el sitio corriendo: `npm run build && npm run preview`, y en otra
// terminal `npm run og` (o `node scripts/og.mjs --url http://localhost:4330/`).

import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const i = process.argv.indexOf("--url");
const url = (i !== -1 ? process.argv[i + 1] : "http://localhost:4321/").replace(/\/?$/, "/");

// Las vistas salen de perfil.ts (id y href), sin importar TypeScript.
const perfil = readFileSync(join(raiz, "src/data/perfil.ts"), "utf8");
const vistas = [...perfil.matchAll(/\{ id: "(\w+)", nombre: "[^"]+", detalle: "[^"]+", href: "([^"]*)" \}/g)].map((m) => ({ id: m[1], href: m[2] }));
if (!vistas.length) throw new Error("No encontré las vistas en perfil.ts");

mkdirSync(join(raiz, "public/og"), { recursive: true });
// Sin el selector de vista ni la animación de entrada de la mesa.
const limpiar = "document.querySelectorAll('.vs-wrap, .ix, .desk-hint').forEach((e) => e.remove())";

for (const v of vistas) {
  const out = join(raiz, "public/og", `${v.id}.png`);
  const r = spawnSync(
    process.execPath,
    [join(raiz, "scripts/shot.mjs"), "--out", out, "--url", url + v.href, "--w", "1200", "--h", "630", "--mobile", "false", "--wait", "3500", "--eval", limpiar],
    { stdio: "inherit" },
  );
  if (r.status !== 0) process.exitCode = 1;
}
