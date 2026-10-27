import React, { useState } from "react";

const CategoryIcons = {
  "Desarrollo Web": (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-6 h-6 text-[var(--sec)] opacity-70"
    >
      <path d="M21 3C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H21ZM20 11H4V19H20V11ZM20 5H4V9H20V5ZM11 6V8H9V6H11ZM7 6V8H5V6H7Z"></path>
    </svg>
  ),
  "QA / Testing": (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-6 h-6 text-[var(--sec)] opacity-70"
    >
      <path d="M3.78307 2.82598L12 1L20.2169 2.82598C20.6745 2.92766 21 3.33347 21 3.80217V13.7889C21 16.1277 19.7885 18.3039 17.7671 19.5285L12 23L6.23286 19.5285C4.21149 18.3039 3 16.1277 3 13.7889V3.80217C3 3.33347 3.32549 2.92766 3.78307 2.82598ZM12 15L16.5 10.5L15.0858 9.08579L12 12.1716L10.4142 10.5858L9 12L12 15Z"></path>
    </svg>
  ),
  "Datos y BI": (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-6 h-6 text-[var(--sec)] opacity-70"
    >
      <path d="M2 13H8V21H2V13ZM9 3H15V21H9V3ZM16 8H22V21H16V8Z"></path>
    </svg>
  ),
};

const SkillsList = ({ lang = "es" }: { lang?: "es" | "en" }) => {
  const [openItem, setOpenItem] = useState<string | null>(null);

  const en = lang === "en";
  // Las claves en español eligen el ícono; `nombres` las traduce.
  const nombres: Record<string, string> = en ? { "Datos y BI": "Data & BI", "Desarrollo Web": "Web development", "QA / Testing": "QA / Testing" } : {};
  const skills = en ? {
    "Datos y BI": [
      "Warehouse modeling with dbt and SQL Server",
      "Data tests, documentation and lineage",
      "API integrations and loads with Python and SQL",
      "Dashboards in Power BI and Looker Studio",
    ],
    "Desarrollo Web": [
      "Institutional sites and landing pages with Astro",
      "Interaction and animation: GSAP, Three.js, scroll",
      "E-commerce with Node.js and PostgreSQL",
    ],
    "QA / Testing": [
      "Functional (black-box) testing",
      "Test case design and execution",
      "API validation with Postman",
    ],
  } : {
    "Datos y BI": [
      "Modelado de warehouses con dbt y SQL Server",
      "Tests, documentación y linaje de datos",
      "Integración de APIs y cargas con Python y SQL",
      "Tableros en Power BI y Looker Studio",
    ],
    "Desarrollo Web": [
      "Sitios institucionales y landing pages con Astro",
      "Interacción y animación: GSAP, Three.js, scroll",
      "E-commerce con Node.js y PostgreSQL",
    ],
    "QA / Testing": [
      "Pruebas funcionales (caja negra)",
      "Diseño y ejecución de casos de prueba",
      "Validación de APIs con Postman",
    ],
  };

  const toggleItem = (item: string) => {
    setOpenItem(openItem === item ? null : item);
  };

  return (
    <div className="text-left pt-3 md:pt-9">
      <h3 className="text-[var(--white)] text-3xl md:text-4xl font-semibold md:mb-6">
        {en ? "What I do" : "¿Qué hago?"}
      </h3>
      <ul className="space-y-4 mt-4 text-lg">
        {Object.entries(skills).map(([category, items]) => (
          <li key={category} className="w-full">
            <div
              onClick={() => toggleItem(category)}
              className="md:w-[400px] w-full bg-[#1414149c] rounded-2xl text-left hover:bg-opacity-80 transition-all border border-[var(--white-icon-tr)] cursor-pointer overflow-hidden"
            >
              <div className="flex items-center gap-3 p-4">
                {CategoryIcons[category]}
                <div className="flex items-center gap-2 flex-grow justify-between">
                  <div className="min-w-0 max-w-[200px] md:max-w-none overflow-hidden">
                    <span className="block truncate text-[var(--white)] text-lg">
                      {nombres[category] ?? category}
                    </span>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={`w-6 h-6 text-[var(--white)] transform transition-transform flex-shrink-0 ${
                      openItem === category ? "rotate-180" : ""
                    }`}
                  >
                    <path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z"></path>
                  </svg>
                </div>
              </div>

              <div
                className={`transition-all duration-300 px-4 ${
                  openItem === category
                    ? "max-h-[500px] pb-4 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <ul className="space-y-2 text-[var(--white-icon)] text-sm">
                  {items.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <span className="pl-1">•</span>
                      <li className="pl-3">{item}</li>
                    </div>
                  ))}
                </ul>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SkillsList;
