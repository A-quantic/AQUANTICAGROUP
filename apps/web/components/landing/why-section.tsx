"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Lightbulb, Users, TrendingUp, Shield, Check } from "lucide-react";

const values = [
  {
    icon: Lightbulb,
    title: "Ideas que Cobran Vida",
    description: "Transformamos tus ideas en soluciones reales y sostenibles.",
  },
  {
    icon: Users,
    title: "Acompañamiento Personalizado",
    description: "Te guiamos en cada etapa con transparencia y compromiso.",
  },
  {
    icon: TrendingUp,
    title: "Crecemos Contigo",
    description: "Cada proyecto es una oportunidad para generar impacto positivo.",
  },
  {
    icon: Shield,
    title: "Calidad desde el Inicio",
    description: "Altos estándares en cada detalle, sin importar el tamaño.",
  },
];

const pillars = [
  { title: "Calidad", description: "Profesionales especializados" },
  { title: "Innovación", description: "Tecnología de vanguardia" },
  { title: "Sostenibilidad", description: "Responsabilidad ambiental" },
  { title: "Compromiso", description: "Cumplimiento garantizado" },
];

export function WhySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="nosotros" className="relative py-24 bg-navy" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          >
            <p className="flex items-center gap-3 text-gold text-xs tracking-[0.25em] uppercase mb-4">
              <span className="w-7 h-px bg-gold" />
              Nuestro enfoque
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
              Creamos futuro,
              <br />
              <span className="text-gold">construimos sueños</span>
            </h2>
            <p className="text-white/50 leading-relaxed mb-10">
              Transformamos propiedades irregularizadas en activos legales y
              comercializables. Te guiamos en cada etapa del saneamiento con
              tecnología de punta y un equipo de especialistas.
            </p>

            {/* Values Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {values.map((value, i) => (
                <motion.div
                  key={value.title}
                  className="border border-gold/15 p-5 hover:border-gold hover:bg-gold/5 transition-all group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1 }}
                >
                  <value.icon className="w-7 h-7 text-gold mb-3" />
                  <h4 className="font-serif font-bold text-white mb-1 group-hover:text-gold transition-colors">
                    {value.title}
                  </h4>
                  <p className="text-xs text-white/50 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
          >
            {/* Pillars */}
            <div className="grid grid-cols-2 border border-gold/15 mb-8">
              {pillars.map((pillar, i) => (
                <div
                  key={pillar.title}
                  className={`p-6 text-center hover:bg-gold/5 transition-colors ${
                    i < 2 ? "border-b border-gold/10" : ""
                  } ${i % 2 === 0 ? "border-r border-gold/10" : ""}`}
                >
                  <div className="w-2 h-2 bg-gold mx-auto mb-3 rotate-45" />
                  <h4 className="font-serif font-bold text-gold mb-1">
                    {pillar.title}
                  </h4>
                  <p className="text-xs text-white/50">{pillar.description}</p>
                </div>
              ))}
            </div>

            {/* Quote */}
            <motion.div
              className="border border-gold/20 bg-gold/5 p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
            >
              <p className="font-serif text-xl sm:text-2xl font-semibold text-white italic leading-relaxed mb-4">
                &ldquo;Soluciones integrales, resultados que trascienden.&rdquo;
              </p>
              <p className="text-xs text-gold uppercase tracking-widest">
                — Equipo AQUANTICA
              </p>
            </motion.div>

            {/* AI Badge */}
            <motion.div
              className="mt-8 flex items-center gap-4 p-4 border border-gold/20 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
            >
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-gold"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-serif font-bold text-white">AURA</h4>
                <p className="text-xs text-white/50">
                  IA especializada en normativa inmobiliaria peruana
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
