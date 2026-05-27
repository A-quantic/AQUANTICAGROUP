"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, ChevronDown } from "lucide-react";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.23, 1, 0.32, 1],
    },
  },
};

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-navy">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_85%_at_75%_50%,rgba(201,168,76,0.07)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-mid to-navy" />
      </div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(201,168,76,0.9) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.9) 1px, transparent 1px)`,
          backgroundSize: "55px 55px",
        }}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 2.5 + 0.8,
              height: Math.random() * 2.5 + 0.8,
              left: `${Math.random() * 100}%`,
              background:
                Math.random() > 0.45
                  ? `rgba(201,168,76,${Math.random() * 0.45 + 0.18})`
                  : `rgba(255,255,255,${Math.random() * 0.12 + 0.03})`,
            }}
            animate={{
              y: ["110vh", "-60px"],
              opacity: [0, 1, 0.4, 0],
            }}
            transition={{
              duration: Math.random() * 14 + 9,
              repeat: Infinity,
              delay: Math.random() * 12,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-32"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-3xl">
          <motion.p
            variants={itemVariants}
            className="flex items-center gap-3 text-gold text-xs tracking-[0.25em] uppercase mb-6"
          >
            <span className="w-9 h-px bg-gold" />
            Saneamiento Físico Legal · SUNARP · COFOPRI
          </motion.p>

          <motion.h1
            variants={itemVariants}
            className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.06] mb-6"
          >
            Saneamos tu propiedad{" "}
            <span className="text-gold block">en 90 días</span>
          </motion.h1>

          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 text-gold-light text-xs tracking-widest uppercase px-4 py-2 mb-8"
          >
            <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
            Infraestructura digital para gestión inmobiliaria en Perú
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-lg text-white/60 font-light leading-relaxed max-w-xl mb-10"
          >
            En AQUANTICA transformamos propiedades irregularizadas en activos legales y comercializables. 
            Especialistas en independización, titulación y licencias de construcción con respaldo de IA documental.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-4"
          >
            <Link href="#contacto">
              <Button
                variant="gold"
                size="lg"
                className="group"
              >
                <Phone className="w-4 h-4 mr-2" />
                Cotiza tu proyecto
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="#servicios">
              <Button
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:border-gold hover:text-gold"
              >
                Ver servicios
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-8 sm:gap-12 mt-16 pt-8 border-t border-gold/20"
          >
            {[
              { num: "500+", label: "Expedientes gestionados" },
              { num: "98%", label: "Éxito en saneamiento" },
              { num: "15+", label: "Años de experiencia" },
              { num: "24h", label: "Respuesta garantizada" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="font-serif text-3xl sm:text-4xl font-bold text-gold">
                  {stat.num}
                </div>
                <div className="text-xs text-white/50 uppercase tracking-wider mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <div className="w-px h-12 bg-gradient-to-b from-gold to-transparent" />
        <span className="text-[10px] text-white/40 uppercase tracking-widest">
          Scroll
        </span>
      </motion.div>
    </section>
  );
}
