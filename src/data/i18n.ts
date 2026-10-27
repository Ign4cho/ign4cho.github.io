// Español e inglés. El contenido en español está en perfil.ts; acá van las
// traducciones (por id) y los helpers que usan las vistas. `contenido(lang)`
// devuelve los mismos datos de perfil.ts ya traducidos.

import { perfil, experiencia, proyectos, estudios, charlas, vistas, AREAS, HOY, type Area } from "./perfil";

export type Lang = "es" | "en";
export const LANGS: Lang[] = ["es", "en"];

/** Elige el texto según el idioma: t(lang, "Hola", "Hi"). */
export const t = (lang: Lang, es: string, en: string) => (lang === "en" ? en : es);

/** Idioma de la página según su ruta (/en/… = inglés). */
export const langDe = (url: URL): Lang => (/^\/en(\/|$)/.test(url.pathname) ? "en" : "es");

/** Link a una vista o página interna en el idioma pedido: ruta("en", "linaje/") → /en/linaje/ */
export function ruta(lang: Lang, href: string) {
  const base = import.meta.env.BASE_URL;
  return `${base}${lang === "en" ? "en/" : ""}${href}`;
}

/** La misma página en el otro idioma, a partir de la ruta actual. */
export function otraRuta(pathname: string, lang: Lang) {
  const sinEn = pathname.replace(/^\/en(\/|$)/, "/");
  return lang === "en" ? sinEn : `/en${sinEn === "/" ? "/" : sinEn}`;
}

const AREAS_EN: Record<Area, string> = { datos: "Data", web: "Web", qa: "QA", soporte: "IT support" };

const PERFIL_EN = {
  rol: "Data analyst and web developer",
  ubicacion: "San Juan, Argentina",
  disponibilidad: "Available for freelance work",
};

const EXPERIENCIA_EN: Record<string, { empresa?: string; rol: string; descripcion: string; tags?: string[] }> = {
  datyo: {
    rol: "Data analyst",
    descripcion:
      "Data consultancy. I maintain the SQL Server warehouse of the main account, migrate transformations from stored procedures to dbt with tests and lineage, integrate the Humand (HR) API and build productivity dashboards in Power BI.",
  },
  freelance: {
    rol: "Web developer",
    descripcion:
      "espacioamine.com with a blog and its own admin panel, three interactive design experiments on the same content and a multi-tenant online store.",
  },
  wes: {
    rol: "Software quality internship",
    descripcion: "Black-box functional testing, test case design and API validation with Postman.",
    tags: ["Postman", "Test cases"],
  },
  infocontrol: {
    rol: "Business Intelligence internship",
    descripcion: "Looker Studio dashboards, KPI definition, data flow automation and process documentation.",
  },
  unsj_computos: {
    empresa: "UNSJ · Computing Center",
    rol: "Internship at the Rectorate",
    descripcion: "Computer maintenance and support with network maintenance.",
    tags: ["Hardware", "Networks"],
  },
};

const PROYECTOS_EN: Record<string, { titulo: string; estado: string; descripcion: string; extra?: string[] }> = {
  tienda_online: {
    titulo: "Elargot: online stores with Meta tracking",
    estado: "Live demo",
    descripcion:
      "Multi-tenant SaaS e-commerce platform for local shops to sell online: catalog, cart and MercadoPago checkout, admin panel, eight templates with swappable palettes and Meta tracking (Pixel + Conversions API) set up out of the box. Fastify + PostgreSQL backend and Astro storefront.",
    extra: ["Demo store", "Landing"],
  },
  espacioamine: {
    titulo: "Espacioamine.com",
    estado: "Live",
    descripcion:
      "Website for a digital marketing agency: services, team, partners and a blog with its own admin panel. Astro, Tailwind and Alpine.js.",
  },
  experimentos_amine: {
    titulo: "Amine: three design experiments",
    estado: "Live",
    descripcion:
      "The content of espacioamine.com told three ways: a zine that unfolds in 3D as you scroll (Three.js), a work desk with draggable objects (GSAP) and an editorial magazine.",
    extra: ["3D zine", "Desk", "Editorial"],
  },
  tesis_sube: {
    titulo: "Public transport transfers with Markov chains",
    estado: "Bachelor's thesis",
    descripcion:
      "Modeling transfer patterns of the SUBE card system in Greater San Juan with discrete-time Markov chains, over fifteen months of data (about 28 million transactions per month): batch reduction, per-card transfer reconstruction, transition matrix between lines, stationary distribution and a check of the first-order assumption. The image shows the transfer network between lines.",
  },
};

const ESTUDIOS_EN = [
  { titulo: "Bachelor's degree in Information Systems" },
  { titulo: "University Technician in Information Systems" },
  { titulo: "English exams: First Language English (2018) and English as a Second Language (2017)" },
];

const CHARLAS_EN = [
  {
    titulo:
      "Simulation-based calibration of the Markov order test on sparse contingency tables: an empirical analysis of one million public transport transfers",
    evento: "1st Joint Meeting SBM-UMA · Scientific Communications, Statistics, Probability and Data Science session",
    lugar: "Universidad Nacional de Mar del Plata",
  },
];

const VISTAS_EN: Record<string, { nombre: string; detalle: string }> = {
  bento: { nombre: "Bento", detalle: "Everything in one grid, at a glance" },
  linaje: { nombre: "dbt lineage", detalle: "My career as a graph of models" },
  clasica: { nombre: "Classic", detalle: "Dark, to read straight through" },
  dashboard: { nombre: "Dashboard", detalle: "The portfolio as a Power BI report" },
  terminal: { nombre: "SQL terminal", detalle: "Queries over the portfolio" },
  pliego: { nombre: "3D zine", detalle: "A two-ink zine that unfolds as you scroll" },
  mesa: { nombre: "Desk", detalle: "Drag the objects, open what you like" },
  editorial: { nombre: "Editorial", detalle: "Plain magazine, made for recruiters" },
  sanjuan: { nombre: "San Juan", detalle: "The Zonda wind blows everything around" },
};

/** Todo el contenido de perfil.ts en el idioma pedido. */
export function contenido(lang: Lang) {
  if (lang === "es") return { perfil, experiencia, proyectos, estudios, charlas, vistas, AREAS };
  return {
    perfil: { ...perfil, ...PERFIL_EN },
    experiencia: experiencia.map((e) => ({ ...e, ...EXPERIENCIA_EN[e.id] })),
    proyectos: proyectos.map((p) => {
      const tr = PROYECTOS_EN[p.id];
      return {
        ...p,
        ...tr,
        extra: p.extra?.map((x, i) => ({ ...x, label: tr?.extra?.[i] ?? x.label })),
      };
    }),
    estudios: estudios.map((e, i) => ({ ...e, ...ESTUDIOS_EN[i] })),
    charlas: charlas.map((c, i) => ({ ...c, ...CHARLAS_EN[i] })),
    vistas: vistas.map((v) => ({ ...v, ...VISTAS_EN[v.id] })),
    AREAS: AREAS_EN,
  };
}

const MESES_ES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
const MESES_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** «Sep 2026 — actualidad» / «Sep 2026 — present» */
export function periodoL(lang: Lang, desde: string, hasta: string | null) {
  const m = lang === "en" ? MESES_EN : MESES_ES;
  const f = (ym: string) => `${m[Number(ym.slice(5, 7)) - 1]} ${ym.slice(0, 4)}`;
  return `${f(desde)} — ${hasta ? f(hasta) : t(lang, "actualidad", "present")}`;
}

/** «12 meses» / «12 months» */
export const mesesL = (lang: Lang, n: number) => `${n} ${n === 1 ? t(lang, "mes", "month") : t(lang, "meses", "months")}`;

export { HOY };
