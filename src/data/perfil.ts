// Contenido único del portfolio: todas las vistas (clásica, dashboard, linaje,
// terminal) leen de acá. Para actualizar el portfolio, editar este archivo.

export type Area = "datos" | "web" | "qa" | "soporte";

export const AREAS: Record<Area, string> = {
  datos: "Datos",
  web: "Web",
  qa: "QA",
  soporte: "Soporte IT",
};

export const perfil = {
  nombre: "Ignacio Colomé",
  alias: "Nacho",
  rol: "Analista de datos y desarrollador web",
  ubicacion: "San Juan, Argentina",
  email: "nachocolome@gmail.com",
  github: "https://github.com/Ign4cho",
  linkedin: "https://www.linkedin.com/in/ignacio-colome/",
  inicio: 2020, // ingreso a Sistemas de Información (UNSJ)
  disponibilidad: "Disponible para trabajos freelance",
};

export interface Experiencia {
  id: string; // nombre de modelo en la vista de linaje
  empresa: string;
  rol: string;
  desde: string; // YYYY-MM
  hasta: string | null; // null: actualidad
  area: Area;
  descripcion: string;
  tags: string[];
  destacada: boolean; // aparece en la vista clásica
}

export const experiencia: Experiencia[] = [
  {
    id: "datyo",
    empresa: "Datyo",
    rol: "Analista de datos",
    desde: "2026-09",
    hasta: null,
    area: "datos",
    descripcion:
      "Consultora de datos. Mantengo el warehouse en SQL Server de la cuenta principal, migro las transformaciones de procedimientos almacenados a dbt con tests y linaje, integro la API de Humand (RR.HH.) y armo los tableros de productividad en Power BI.",
    tags: ["dbt", "SQL Server", "Power BI", "Python"],
    destacada: true,
  },
  {
    id: "freelance",
    empresa: "Freelance",
    rol: "Desarrollador web",
    desde: "2025-12",
    hasta: null,
    area: "web",
    descripcion:
      "Sitio de espacioamine.com con blog y panel de administración, tres experimentos de diseño interactivos sobre el mismo contenido y una tienda online multitenant.",
    tags: ["Astro", "Tailwind CSS", "GSAP", "Three.js", "Node.js"],
    destacada: true,
  },
  {
    id: "wes",
    empresa: "WES",
    rol: "Pasantía en calidad de software",
    desde: "2025-06",
    hasta: "2025-07",
    area: "qa",
    descripcion: "Pruebas funcionales de caja negra, diseño de casos de prueba y validación de APIs con Postman.",
    tags: ["Postman", "Casos de prueba"],
    destacada: true,
  },
  {
    id: "infocontrol",
    empresa: "Infocontrol",
    rol: "Pasantía de Business Intelligence",
    desde: "2024-08",
    hasta: "2024-10",
    area: "datos",
    descripcion: "Dashboards en Looker Studio, definición de KPIs, automatización de flujos de datos y documentación de procesos.",
    tags: ["Looker Studio", "KPIs"],
    destacada: true,
  },
  {
    id: "unsj_computos",
    empresa: "UNSJ · Centro de Cómputos",
    rol: "Pasantía en el Rectorado",
    desde: "2023-06",
    hasta: "2024-03",
    area: "soporte",
    descripcion: "Mantenimiento de equipos informáticos y asistencia en el mantenimiento de redes.",
    tags: ["Hardware", "Redes"],
    destacada: false,
  },
];

export interface Proyecto {
  id: string;
  titulo: string;
  area: Area;
  anio: number;
  estado: string;
  descripcion: string;
  stack: string[];
  imagen: string | null; // relativa a public/
  codigo: string | null; // null: repositorio privado
  sitio: string | null;
  extra?: { label: string; href: string }[];
  destacado: boolean; // aparece en la vista clásica
}

export const proyectos: Proyecto[] = [
  {
    id: "tienda_online",
    titulo: "Elargot: tiendas online con tracking de Meta",
    area: "web",
    anio: 2026,
    estado: "Demo publicada",
    descripcion:
      "Plataforma e-commerce SaaS multitenant para que comercios locales vendan online: catálogo, carrito y checkout con MercadoPago, panel de administración, ocho plantillas con paletas intercambiables y tracking de Meta (Pixel + Conversions API) configurado de fábrica. Backend Fastify + PostgreSQL y storefront Astro.",
    stack: ["Astro", "Node.js", "Fastify", "PostgreSQL", "MercadoPago"],
    imagen: "demo-elargot.jpg",
    codigo: null,
    sitio: "https://demo.elargot.com",
    extra: [
      { label: "Tienda demo", href: "https://demo.elargot.com" },
      { label: "Landing", href: "https://elargot.com" },
    ],
    destacado: true,
  },
  {
    id: "espacioamine",
    titulo: "Espacioamine.com",
    area: "web",
    anio: 2026,
    estado: "Publicado",
    descripcion:
      "Sitio institucional para una agencia de marketing digital: servicios, equipo, aliados y un blog con panel de administración propio. Astro, Tailwind y Alpine.js.",
    stack: ["Astro", "Tailwind CSS", "Alpine.js"],
    imagen: "demo-agency.png",
    codigo: "https://github.com/Ign4cho/amine-web",
    sitio: "https://espacioamine.com",
    destacado: true,
  },
  {
    id: "experimentos_amine",
    titulo: "Amine: tres experimentos de diseño",
    area: "web",
    anio: 2026,
    estado: "Publicado",
    descripcion:
      "El mismo contenido de espacioamine.com contado de tres formas: un fanzine que se despliega en 3D con el scroll (Three.js), una mesa de trabajo con objetos arrastrables (GSAP) y una revista editorial.",
    stack: ["Astro", "Three.js", "GSAP", "TypeScript"],
    imagen: "demo-amine-experimentos.jpg",
    codigo: "https://github.com/Ign4cho/amine-web/tree/preview-octubre/experimentos",
    sitio: "https://fold.espacioamine.com",
    extra: [
      { label: "Pliego 3D", href: "https://fold.espacioamine.com" },
      { label: "Mesa", href: "https://mesa.espacioamine.com" },
      { label: "Editorial", href: "https://editorial.espacioamine.com" },
    ],
    destacado: true,
  },
  {
    id: "tesis_sube",
    titulo: "Trasbordos del transporte público con cadenas de Markov",
    area: "datos",
    anio: 2026,
    estado: "Trabajo Final de Licenciatura",
    descripcion:
      "Modelado de los patrones de trasbordo del sistema SUBE en el Gran San Juan con cadenas de Markov de tiempo discreto, sobre quince meses de datos (unos 28 millones de transacciones por mes): reducción por lotes, reconstrucción de trasbordos por tarjeta, matriz de transición entre líneas, distribución estacionaria y verificación del supuesto de orden 1. En la imagen, la red de trasbordos entre líneas.",
    stack: ["Python", "pandas", "numpy", "scipy", "networkx"],
    imagen: "demo-tesis-red.jpg",
    codigo: null,
    sitio: null,
    destacado: true,
  },
];

export interface Habilidad {
  nombre: string;
  area: Area | "general";
}

export const habilidades: Habilidad[] = [
  { nombre: "SQL", area: "datos" },
  { nombre: "dbt", area: "datos" },
  { nombre: "SQL Server", area: "datos" },
  { nombre: "Power BI", area: "datos" },
  { nombre: "Looker Studio", area: "datos" },
  { nombre: "Python", area: "datos" },
  { nombre: "pandas", area: "datos" },
  { nombre: "Astro", area: "web" },
  { nombre: "Tailwind CSS", area: "web" },
  { nombre: "Alpine.js", area: "web" },
  { nombre: "TypeScript", area: "web" },
  { nombre: "Node.js", area: "web" },
  { nombre: "GSAP", area: "web" },
  { nombre: "Three.js", area: "web" },
  { nombre: "Postman", area: "qa" },
  { nombre: "Casos de prueba", area: "qa" },
  { nombre: "Git", area: "general" },
];

export const estudios = [
  {
    institucion: "Universidad Nacional de San Juan",
    titulo: "Licenciatura en Sistemas de Información",
    desde: 2020,
  },
  {
    institucion: "Universidad Nacional de San Juan",
    titulo: "Técnico Universitario en Sistemas de Información",
    desde: 2020,
  },
  {
    institucion: "Cambridge Assessment International Education",
    titulo: "Exámenes de inglés: First Language English (2018) y English as a Second Language (2017)",
    desde: 2017,
  },
];

export const charlas = [
  {
    titulo:
      "Calibración por simulación del contraste de orden markoviano en tablas de contingencia ralas: análisis empírico sobre un millón de trasbordos del transporte público",
    evento: "I Encuentro Conjunto SBM-UMA · Comunicaciones Científicas, sesión Estadística, Probabilidades y Ciencias de Datos",
    lugar: "Universidad Nacional de Mar del Plata",
    fecha: "2026-09",
    coautor: "Leonel Ganga",
  },
];

// Vistas del portfolio, en el orden del selector.
export const vistas = [
  { id: "linaje", nombre: "Linaje dbt", detalle: "La carrera como grafo de modelos", href: "" },
  { id: "clasica", nombre: "Clásica", detalle: "Oscura, para leer de corrido", href: "clasica/" },
  { id: "dashboard", nombre: "Dashboard", detalle: "El portfolio como informe de Power BI", href: "dashboard/" },
  { id: "terminal", nombre: "Terminal SQL", detalle: "Consultas sobre el portfolio", href: "terminal/" },
];

/** Mes del build, YYYY-MM: «actualidad» en las fechas. */
export const HOY = new Date().toISOString().slice(0, 7);

/** Meses entre dos fechas YYYY-MM, inclusive (hasta null = HOY). */
export function meses(desde: string, hasta: string | null) {
  const [y1, m1] = desde.split("-").map(Number);
  const [y2, m2] = (hasta ?? HOY).split("-").map(Number);
  return (y2 - y1) * 12 + (m2 - m1) + 1;
}

const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
/** «Sep 2026 — actualidad» */
export function periodo(desde: string, hasta: string | null) {
  const f = (ym: string) => `${MESES[Number(ym.slice(5, 7)) - 1]} ${ym.slice(0, 4)}`;
  return `${f(desde)} — ${hasta ? f(hasta) : "actualidad"}`;
}
