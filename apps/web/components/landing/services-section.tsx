"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { FileText, Home, Scale, Building, MapPin, PenTool } from "lucide-react";

const services = [
  {
    num: "01",
    icon: FileText,
    title: "Saneamiento Físico Legal",
    description:
      "Regularización de propiedades en SUNARP, COFOPRI y municipalidades. Titulación completa con respaldo legal.",
    features: ["Titulación COFOPRI", "Inscripción SUNARP", "Declaratoria de fábrica"],
  },
  {
    num: "02",
    icon: Scale,
    title: "Independización de Predios",
    description:
      "Trámites de independización, subdivisión y lotización con cumplimiento normativo completo.",
    features: ["Independización", "Subdivisión", "Loteamiento"],
  },
  {
    num: "03",
    icon: PenTool,
    title: "Diseño Arquitectónico",
    description:
      "Planos arquitectónicos funcionales y modernos para vivienda unifamiliar y multifamiliar.",
    features: ["Planos funcionales", "Diseño moderno", "Remodelaciones"],
  },
  {
    num: "04",
    icon: Building,
    title: "Planificación y Obra",
    description:
      "Licencias de construcción, ejecución de obras y supervisión profesional integral.",
    features: ["Licencia de construcción", "Ejecución de obras", "Supervisión"],
  },
  {
    num: "05",
    icon: MapPin,
    title: "Levantamiento Topográfico",
    description:
      "Mediciones precisas para documentación técnica y catastral de predios.",
    features: ["Mediciones GPS", "Planos catastrales", "Avalúos técnicos"],
  },
  {
    num: "06",
    icon: Home,
    title: "Compra y Venta",
    description:
      "Asesoría integral en transacciones inmobiliarias con respaldo legal completo.",
    features: ["Due diligence", "Contratos", "Escrituración"],
  },
];

export function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="servicios"
      className="relative py-24 bg-navy-mid"
      ref={ref}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          >
            <p className="flex items-center gap-3 text-gold text-xs tracking-[0.25em] uppercase mb-4">
              <span className="w-7 h-px bg-gold" />
              Nuestros servicios
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Soluciones completas para{" "}
              <span className="text-gold">tu propiedad</span>
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="text-white/50 max-w-xs text-sm"
          >
            Asesoría profesional sin compromiso. Resolvemos casos complejos de
            saneamiento.
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gold/10 border border-gold/10">
          {services.map((service, i) => (
            <motion.div
              key={service.num}
              className="bg-navy-mid p-8 group cursor-pointer relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                ease: [0.23, 1, 0.32, 1],
              }}
            >
              {/* Hover Line */}
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold transition-all duration-500 group-hover:w-full" />

              {/* Number */}
              <div className="font-serif text-5xl font-bold text-gold/10 mb-4 transition-colors group-hover:text-gold/30">
                {service.num}
              </div>

              {/* Icon */}
              <div className="w-11 h-11 border border-gold/30 flex items-center justify-center mb-5 transition-all group-hover:bg-gold/10 group-hover:border-gold">
                <service.icon className="w-5 h-5 text-gold" />
              </div>

              {/* Content */}
              <h3 className="font-serif text-xl font-bold text-white mb-3 group-hover:text-gold transition-colors">
                {service.title}
              </h3>
              <p className="text-sm text-white/50 mb-5 leading-relaxed">
                {service.description}
              </p>

              {/* Features */}
              <ul className="space-y-2">
                {service.features.map((feature) => (
                  <li
                    key={feature}
                    className="text-xs text-white/40 flex items-center gap-2 border-b border-white/5 pb-2 last:border-0"
                  >
                    <span className="text-gold">—</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
