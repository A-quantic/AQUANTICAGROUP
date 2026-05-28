import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Phone, FileText, Clock, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Saneamiento Físico Legal de Propiedades | AQUANTICA GROUP",
  description: "Servicio profesional de saneamiento físico legal de propiedades en Perú. Regularización de terrenos, saneamiento de títulos, inscripción SUNARP, saneamiento COFOPRI. Expertos en propiedades irregularizadas.",
  keywords: ["saneamiento físico legal", "saneamiento propiedades Perú", "regularización terrenos", "saneamiento SUNARP", "saneamiento COFOPRI", "títulos de propiedad", "inscripción registral"],
  openGraph: {
    title: "Saneamiento Físico Legal de Propiedades | AQUANTICA GROUP",
    description: "Transformamos propiedades irregularizadas en activos legales con nuestro servicio de saneamiento físico legal.",
  },
};

const features = [
  "Diagnóstico legal gratuito de la propiedad",
  "Análisis de títulos y documentación",
  "Regularización ante SUNARP",
  "Gestión COFOPRI para predios informales",
  "Levantamiento de medidas cautelares",
  "Inscripción de predios independizados",
];

const process = [
  {
    icon: FileText,
    title: "Evaluación Documental",
    description: "Revisamos todos los documentos de la propiedad y identificamos obstáculos legales.",
  },
  {
    icon: Shield,
    title: "Estrategia Legal",
    description: "Diseñamos un plan de acción personalizado para regularizar tu propiedad.",
  },
  {
    icon: Clock,
    title: "Gestión Ágil",
    description: "Tramitamos todos los documentos ante las entidades correspondientes.",
  },
];

export default function SaneamientoLegalPage() {
  return (
    <main className="min-h-screen bg-navy">
      {/* Header */}
      <div className="bg-navy-mid border-b border-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/#servicios">
            <Button variant="ghost" className="text-white/70 hover:text-gold hover:bg-gold/5">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Servicios
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Saneamiento Físico Legal de Propiedades
            </h1>
            <p className="text-xl text-white/70 leading-relaxed mb-8">
              Transformamos propiedades irregularizadas en activos legales y comercializables. 
              Nuestro equipo de abogados especializados en derecho inmobiliario gestiona todo el proceso 
              ante SUNARP, COFOPRI y entidades municipales.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/#contacto">
                <Button size="lg" className="bg-gold text-navy hover:bg-gold/90">
                  <Phone className="w-4 h-4 mr-2" />
                  Consulta Gratis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-navy-mid/30 border-y border-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-white mb-12 text-center">
            ¿Qué incluye nuestro servicio?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 rounded-lg bg-navy/50 border border-gold/10"
              >
                <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <span className="text-white/80">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-white mb-12 text-center">
            Nuestro Proceso
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {process.map((step, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl bg-navy-mid/30 border border-gold/10"
              >
                <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-8 h-8 text-gold" />
                </div>
                <h3 className="font-serif text-xl font-bold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-white/60">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-gold/10 to-transparent border-t border-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl font-bold text-white mb-4">
            ¿Tienes una propiedad irregularizada?
          </h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            Contáctanos hoy para una evaluación gratuita. Te ayudamos a convertir tu propiedad en un activo legal.
          </p>
          <Link href="/#contacto">
            <Button size="lg" className="bg-gold text-navy hover:bg-gold/90">
              <Phone className="w-4 h-4 mr-2" />
              Iniciar Saneamiento
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
