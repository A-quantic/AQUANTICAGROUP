import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Phone, Home, Ruler, FileCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Independización de Predios | AQUANTICA GROUP",
  description: "Servicio especializado en independización de predios en Perú. Fraccionamiento de terrenos, subdivisión de lotes, segregación de inmuebles. Gestión completa ante SUNARP y municipios.",
  keywords: ["independización de predios", "fraccionamiento de terrenos", "subdivisión de lotes", "segregación de inmuebles", "SUNARP independización", "partida registral independizada"],
  openGraph: {
    title: "Independización de Predios | AQUANTICA GROUP",
    description: "Especialistas en independización de predios. Fraccionamos tu terreno de forma legal y eficiente.",
  },
};

const features = [
  "Estudio de viabilidad legal y técnica",
  "Elaboración de planos de fraccionamiento",
  "Gestión municipal de licencias",
  "Inscripción de nuevas partidas registrales",
  "Asesoría en deslinde y amojonamiento",
  "Regularización de lote irregulares",
];

export default function IndependizacionPage() {
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
              Independización de Predios
            </h1>
            <p className="text-xl text-white/70 leading-relaxed mb-8">
              Especialistas en fraccionamiento y subdivisión legal de terrenos en Perú. 
              Gestionamos todo el proceso de independización ante SUNARP y entidades municipales 
              para crear nuevas partidas registrales independientes.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/#contacto">
                <Button size="lg" className="bg-gold text-navy hover:bg-gold/90">
                  <Phone className="w-4 h-4 mr-2" />
                  Consultar Ahora
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-navy-mid/30 border-y border-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-white mb-12 text-center">
            Servicios de Independización
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

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <Home className="w-12 h-12 text-gold mx-auto mb-4" />
              <h3 className="font-serif text-xl font-bold text-white mb-2">Fraccionamiento</h3>
              <p className="text-white/60">División de un terreno en lotes independientes con acceso propio</p>
            </div>
            <div className="p-6">
              <Ruler className="w-12 h-12 text-gold mx-auto mb-4" />
              <h3 className="font-serif text-xl font-bold text-white mb-2">Deslinde</h3>
              <p className="text-white/60">Establecimiento legal de límites y amojonamiento de predios</p>
            </div>
            <div className="p-6">
              <FileCheck className="w-12 h-12 text-gold mx-auto mb-4" />
              <h3 className="font-serif text-xl font-bold text-white mb-2">Inscripción</h3>
              <p className="text-white/60">Registro de nuevas partidas independientes en SUNARP</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
