import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Phone, Building, FileText, ClipboardCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Licencias de Construcción | AQUANTICA GROUP",
  description: "Trámite de licencias de construcción en Perú. Licencia de edificación, licencia de demolición, licencia de remodelación. Gestión ante municipios y entidades competentes.",
  keywords: ["licencia de construcción", "licencia de edificación", "licencia de demolición", "licencia de remodelación", "trámite municipal construcción", "planos aprobados", "declaratoria de fábrica"],
  openGraph: {
    title: "Licencias de Construcción | AQUANTICA GROUP",
    description: "Gestionamos todas las licencias de construcción ante municipios. Edificación, demolición y remodelación.",
  },
};

const features = [
  "Elaboración de planos arquitectónicos firmados",
  "Declaratoria de fábrica y edificación",
  "Licencia de edificación municipal",
  "Licencia de demolición",
  "Licencia de remodelación",
  "Gestión de indebido procedimiento",
];

export default function LicenciasConstruccionPage() {
  return (
    <main className="min-h-screen bg-navy">
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

      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Licencias de Construcción
            </h1>
            <p className="text-xl text-white/70 leading-relaxed mb-8">
              Gestión profesional de licencias de construcción ante municipios de Lima y provincias. 
              Tramitamos licencias de edificación, demolición, remodelación y declaratorias de fábrica 
              para tu proyecto inmobiliario.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/#contacto">
                <Button size="lg" className="bg-gold text-navy hover:bg-gold/90">
                  <Phone className="w-4 h-4 mr-2" />
                  Cotizar Trámite
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-navy-mid/30 border-y border-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-white mb-12 text-center">
            Tipos de Licencias que Gestionamos
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
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

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <Building className="w-12 h-12 text-gold mx-auto mb-4" />
              <h3 className="font-serif text-xl font-bold text-white mb-2">Edificación</h3>
              <p className="text-white/60">Licencias para construcción nueva de edificaciones</p>
            </div>
            <div className="p-6">
              <FileText className="w-12 h-12 text-gold mx-auto mb-4" />
              <h3 className="font-serif text-xl font-bold text-white mb-2">Declaratoria</h3>
              <p className="text-white/60">Declaratoria de fábrica para edificaciones existentes</p>
            </div>
            <div className="p-6">
              <ClipboardCheck className="w-12 h-12 text-gold mx-auto mb-4" />
              <h3 className="font-serif text-xl font-bold text-white mb-2">Regularización</h3>
              <p className="text-white/60">Licencias de indebido procedimiento para obras irregulares</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
