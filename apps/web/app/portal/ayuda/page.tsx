"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  HelpCircle, 
  BookOpen, 
  MessageCircle, 
  FileText, 
  Video,
  ChevronDown,
  ChevronUp,
  Search
} from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "¿Cómo creo un nuevo proyecto?",
    answer: "Ve a la sección 'Proyectos' en el menú lateral, luego haz clic en 'Nuevo Proyecto' y completa el formulario con la información requerida.",
  },
  {
    question: "¿Cómo subo documentos?",
    answer: "Accede a tu proyecto, ve a la pestaña 'Documentos' y arrastra los archivos o haz clic en 'Subir Documento'. Aceptamos PDF, imágenes y documentos de Word.",
  },
  {
    question: "¿Cuánto tiempo toma un saneamiento?",
    answer: "El tiempo varía según la complejidad del caso. Generalmente toma entre 3 y 6 meses, pero te mantendremos informado de cada avance.",
  },
  {
    question: "¿Cómo contacto a mi asesor?",
    answer: "Usa el chat en la parte inferior derecha o envía un mensaje desde la sección 'Chat' en el menú lateral.",
  },
  {
    question: "¿Puedo ver el estado de mi expediente?",
    answer: "Sí, en tu proyecto encontrarás la pestaña 'Expediente' donde puedes ver el historial completo y los documentos asociados.",
  },
];

export default function AyudaPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-white">
          Centro de Ayuda
        </h1>
        <p className="text-muted-foreground mt-1">
          Encuentra respuestas y recursos para usar el portal
        </p>
      </div>

      {/* Buscador */}
      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
        <Input
          placeholder="Buscar en la ayuda..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-navy/50 border-gold/20 text-white placeholder:text-white/40"
        />
      </div>

      {/* Recursos rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-navy/50 border-gold/20 hover:border-gold/40 transition-colors cursor-pointer group">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-gold/10 group-hover:bg-gold/20 transition-colors">
                <BookOpen className="w-6 h-6 text-gold" />
              </div>
              <div>
                <h3 className="font-medium text-white">Guías</h3>
                <p className="text-sm text-white/60">Tutoriales paso a paso</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-navy/50 border-gold/20 hover:border-gold/40 transition-colors cursor-pointer group">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-gold/10 group-hover:bg-gold/20 transition-colors">
                <Video className="w-6 h-6 text-gold" />
              </div>
              <div>
                <h3 className="font-medium text-white">Videos</h3>
                <p className="text-sm text-white/60">Tutoriales en video</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-navy/50 border-gold/20 hover:border-gold/40 transition-colors cursor-pointer group">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-gold/10 group-hover:bg-gold/20 transition-colors">
                <MessageCircle className="w-6 h-6 text-gold" />
              </div>
              <div>
                <h3 className="font-medium text-white">Soporte</h3>
                <p className="text-sm text-white/60">Chat con asesores</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQs */}
      <Card className="bg-navy/50 border-gold/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-gold" />
            <CardTitle className="text-white">Preguntas Frecuentes</CardTitle>
          </div>
          <CardDescription className="text-white/60">
            Respuestas a las consultas más comunes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {filteredFaqs.length === 0 ? (
            <p className="text-white/60 text-center py-4">
              No se encontraron resultados para tu búsqueda
            </p>
          ) : (
            filteredFaqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gold/10 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gold/5 transition-colors"
                >
                  <span className="font-medium text-white">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-gold" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gold" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-4 pb-4">
                    <p className="text-white/80 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Contacto */}
      <Card className="bg-gradient-to-r from-gold/10 to-transparent border-gold/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-medium text-white mb-1">
                ¿No encontraste lo que buscabas?
              </h3>
              <p className="text-white/60">
                Nuestro equipo de soporte está disponible 24/7 para ayudarte
              </p>
            </div>
            <Button className="bg-gold text-navy hover:bg-gold/90 font-medium">
              <MessageCircle className="w-4 h-4 mr-2" />
              Contactar Soporte
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
