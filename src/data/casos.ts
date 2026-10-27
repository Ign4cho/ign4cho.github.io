// Casos de estudio: una página por proyecto (pages/casos/[id].astro), con el
// problema, las decisiones y el resultado. El id es el de `proyectos` en
// perfil.ts. La tesis no muestra resultados hasta la defensa.

import type { Lang } from "./i18n";

type Txt = Record<Lang, string>;

export interface Caso {
  id: string;
  problema: Txt;
  decisiones: { titulo: Txt; detalle: Txt }[];
  resultado: Txt[];
  aprendizaje?: Txt;
  /** Pasos del proceso de datos, para el diagrama (solo la tesis). */
  proceso?: Txt[];
}

export const casos: Caso[] = [
  {
    id: "tienda_online",
    problema: {
      es: "Los comercios chicos de San Juan venden por Instagram y WhatsApp: sin carrito, sin cobro online y sin saber qué anuncio de Meta trajo cada venta. Las plataformas grandes cobran en dólares y no traen MercadoPago ni el tracking configurados para el mercado local.",
      en: "Small shops in San Juan sell through Instagram and WhatsApp: no cart, no online payments and no way to know which Meta ad brought each sale. The big platforms charge in dollars and don't ship with MercadoPago or tracking set up for the local market.",
    },
    decisiones: [
      {
        titulo: { es: "Una plataforma, muchas tiendas", en: "One platform, many stores" },
        detalle: {
          es: "Multitienda con aislamiento por tienda en cada consulta. Cada comercio cobra en su propia cuenta de MercadoPago, así la plataforma nunca toca el dinero.",
          en: "Multi-tenant, with store isolation on every query. Each shop gets paid into its own MercadoPago account, so the platform never handles the money.",
        },
      },
      {
        titulo: { es: "Reglas que no se negocian", en: "Non-negotiable rules" },
        detalle: {
          es: "Dinero en centavos, webhooks idempotentes, secretos validados con Zod, logs sin datos personales, tests en todo lo que toca pagos y cero `any` en TypeScript.",
          en: "Money in cents, idempotent webhooks, secrets validated with Zod, logs without personal data, tests on everything that touches payments and zero `any` in TypeScript.",
        },
      },
      {
        titulo: { es: "Tracking de Meta de fábrica", en: "Meta tracking out of the box" },
        detalle: {
          es: "Pixel en el navegador y Conversions API desde el servidor, deduplicados, con un registro propio de eventos sin datos personales.",
          en: "Browser Pixel plus server-side Conversions API, deduplicated, with its own event log that stores no personal data.",
        },
      },
      {
        titulo: { es: "Primero lo que se ve", en: "Demo first" },
        detalle: {
          es: "Ocho plantillas con paletas intercambiables para mostrarle a cada comercio su tienda antes de cerrar nada.",
          en: "Eight templates with swappable palettes, so every shop can see its own store before committing to anything.",
        },
      },
    ],
    resultado: [
      { es: "Demo pública con las ocho plantillas y checkout de MercadoPago.", en: "Public demo with all eight templates and MercadoPago checkout." },
      { es: "La plataforma llegó a producción con un comercio real en agosto de 2026.", en: "The platform reached production with a real shop in August 2026." },
      {
        es: "Corrida de QA de caja negra contra producción (octubre de 2026): 86 casos aprobados y ninguno fallado.",
        en: "Black-box QA run against production (October 2026): 86 cases passed, none failed.",
      },
    ],
    aprendizaje: {
      es: "Como negocio quedó en pausa, pero el producto está entero: es el proyecto donde más practiqué arquitectura, pagos y QA juntos.",
      en: "It's on hold as a business, but the product is complete: it's the project where I practiced architecture, payments and QA together the most.",
    },
  },
  {
    id: "espacioamine",
    problema: {
      es: "Una agencia de marketing de San Juan necesitaba un sitio propio que mostrara servicios, equipo y aliados, con un blog que pudieran actualizar sin depender de mí y el contacto directo por WhatsApp.",
      en: "A marketing agency in San Juan needed its own site showing services, team and partners, with a blog they could update without depending on me, and direct contact through WhatsApp.",
    },
    decisiones: [
      {
        titulo: { es: "Requisitos por escrito", en: "Written requirements" },
        detalle: {
          es: "Un documento de requisitos versionado antes de diseñar, para acordar alcance y prioridades con la clienta.",
          en: "A versioned requirements document before any design, to agree on scope and priorities with the client.",
        },
      },
      {
        titulo: { es: "Sitio estático y liviano", en: "Static and lightweight" },
        detalle: {
          es: "Astro con Tailwind y Alpine.js: carga rápida, hosting barato en Hostinger y nada que mantener en el servidor.",
          en: "Astro with Tailwind and Alpine.js: fast loading, cheap Hostinger hosting and nothing to maintain on the server.",
        },
      },
      {
        titulo: { es: "Blog con panel propio", en: "Blog with its own panel" },
        detalle: {
          es: "El «Blogcito» tiene un panel de administración para cargar notas con autor y fecha.",
          en: "The «Blogcito» has an admin panel to publish posts with author and date.",
        },
      },
    ],
    resultado: [
      { es: "Online en espacioamine.com con el rediseño de octubre de 2026.", en: "Live at espacioamine.com with the October 2026 redesign." },
      { es: "La base para los tres experimentos de diseño sobre el mismo contenido.", en: "The base for three design experiments on the same content." },
    ],
    aprendizaje: {
      es: "Un build de prueba con `noindex` llegó a producción. Desde entonces cada build se verifica antes de subir y las versiones de prueba viven en subdominios.",
      en: "A test build with `noindex` reached production. Since then every build is checked before upload and test versions live on subdomains.",
    },
  },
  {
    id: "experimentos_amine",
    problema: {
      es: "¿Cuánto cambia un sitio si se cuenta lo mismo de otra forma? Quería probar recursos que no entran en un sitio institucional: 3D en el navegador, objetos con física y diseño editorial.",
      en: "How much does a site change if the same content is told another way? I wanted to try things that don't fit an institutional site: 3D in the browser, objects with physics and editorial design.",
    },
    decisiones: [
      {
        titulo: { es: "Tres sitios independientes", en: "Three independent sites" },
        detalle: {
          es: "Cada experimento es su propio proyecto Astro en un subdominio, con `noindex` para no competir con el sitio principal en Google.",
          en: "Each experiment is its own Astro project on a subdomain, with `noindex` so it doesn't compete with the main site on Google.",
        },
      },
      {
        titulo: { es: "Pliego: 3D que no deja a nadie afuera", en: "Zine: 3D that leaves nobody out" },
        detalle: {
          es: "Three.js con WebGPU y caída a WebGL2. Con «reducir movimiento» o sin WebGL se muestra el pliego abierto y quieto.",
          en: "Three.js with WebGPU and a WebGL2 fallback. With «reduce motion» or no WebGL, the zine shows open and still.",
        },
      },
      {
        titulo: { es: "Mesa: arrastrar sin perder nada", en: "Desk: drag without losing anything" },
        detalle: {
          es: "GSAP Draggable con inercia. Las posiciones se guardan relativas al tamaño de la mesa, así nada queda afuera al girar el teléfono.",
          en: "GSAP Draggable with inertia. Positions are stored relative to the desk size, so nothing ends up off-screen when the phone rotates.",
        },
      },
      {
        titulo: { es: "Revisión con navegador automatizado", en: "Automated browser review" },
        detalle: {
          es: "Capturas de 375 a 1920 px con viewport fijo. Así apareció una capa invisible del menú que bloqueaba los clics en la editorial.",
          en: "Screenshots from 375 to 1920 px with a fixed viewport. That's how an invisible menu layer blocking clicks on the editorial showed up.",
        },
      },
    ],
    resultado: [
      { es: "Los tres sitios online desde el 25 de octubre de 2026.", en: "All three sites live since October 25, 2026." },
      { es: "El pliego corre a 60 fps con WebGPU en 1920 × 1080 y en 390 × 844.", en: "The zine runs at 60 fps with WebGPU at 1920 × 1080 and 390 × 844." },
      { es: "Los motores del pliego y de la mesa se reutilizan en este portfolio.", en: "The zine and desk engines are reused in this portfolio." },
    ],
  },
  {
    id: "tesis_sube",
    problema: {
      es: "La tarjeta SUBE registra solo cuándo y en qué línea sube cada pasajero: no hay bajadas ni trasbordos explícitos. La pregunta es qué patrones de trasbordo entre líneas se pueden inferir con esos datos en el Gran San Juan.",
      en: "The SUBE card only records when and on which line each passenger boards: there are no exits or explicit transfers. The question is which transfer patterns between lines can be inferred from that data in Greater San Juan.",
    },
    decisiones: [
      {
        titulo: { es: "Cadenas de Markov de tiempo discreto", en: "Discrete-time Markov chains" },
        detalle: {
          es: "Cada secuencia de viajes de una tarjeta se trata como una cadena; las líneas son los estados.",
          en: "Each card's sequence of trips is treated as a chain; the lines are the states.",
        },
      },
      {
        titulo: { es: "Quince meses por lotes", en: "Fifteen months in batches" },
        detalle: {
          es: "Unos 28 millones de transacciones por mes no entran en memoria: se reducen por lotes antes de reconstruir los viajes de cada tarjeta.",
          en: "About 28 million transactions per month don't fit in memory: they're reduced in batches before rebuilding each card's trips.",
        },
      },
      {
        titulo: { es: "Comprobar el supuesto, no darlo por hecho", en: "Test the assumption instead of assuming it" },
        detalle: {
          es: "Se verifica que la cadena sea de orden 1 antes de interpretar la matriz de transición y la distribución estacionaria.",
          en: "The chain is checked to be first-order before interpreting the transition matrix and the stationary distribution.",
        },
      },
    ],
    resultado: [
      {
        es: "Propuesta aceptada sin correcciones por la Comisión de Licenciatura (agosto de 2026).",
        en: "Proposal accepted without corrections by the degree committee (August 2026).",
      },
      { es: "Los resultados se publican después de la defensa.", en: "Results will be published after the defense." },
    ],
    proceso: [
      { es: "Transacciones SUBE crudas", en: "Raw SUBE transactions" },
      { es: "Reducción por lotes", en: "Batch reduction" },
      { es: "Viajes ordenados por tarjeta", en: "Trips sorted per card" },
      { es: "Trasbordos entre líneas", en: "Transfers between lines" },
      { es: "Matriz de transición P", en: "Transition matrix P" },
      { es: "Distribución estacionaria π", en: "Stationary distribution π" },
      { es: "Prueba de orden 1", en: "First-order test" },
    ],
  },
];
