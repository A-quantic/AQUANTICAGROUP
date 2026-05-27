"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, MapPin, Clock, Send, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

const contactInfo = [
  {
    icon: Phone,
    label: "WhatsApp / Teléfono",
    value: "977 498 144",
    href: "https://wa.me/51977498144",
  },
  {
    icon: MapPin,
    label: "Oficina",
    value: "Jr. Lima 354 – Edificio Murakami, Piso 7, Oficina 704",
    href: null,
  },
  {
    icon: Clock,
    label: "Horario",
    value: "Lun – Sáb: 9:00 am – 6:00 pm",
    href: null,
  },
];

const services = [
  "Saneamiento Físico Legal",
  "Independización de Predios",
  "Diseño Arquitectónico",
  "Planificación y Obra",
  "Levantamiento Topográfico",
  "Compra y Venta",
  "Consulta general",
];

export function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSuccess(true);
        toast.success("¡Mensaje enviado! Te contactaremos en menos de 24 horas.");
      } else {
        throw new Error("Error al enviar");
      }
    } catch (error) {
      toast.error("Hubo un error. Por favor intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contacto"
      className="relative py-24 bg-navy-mid border-t border-gold/10"
      ref={ref}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        >
          <p className="flex items-center gap-3 text-gold text-xs tracking-[0.25em] uppercase mb-4">
            <span className="w-7 h-px bg-gold" />
            Contáctanos
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
            ¡Cotiza tu proyecto <span className="text-gold">hoy!</span>
          </h2>
          <p className="text-white/50 max-w-xl">
            Asesoría profesional sin compromiso. Respondemos en menos de 24h con
            una propuesta personalizada.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
          >
            {contactInfo.map((item) => (
              <div key={item.label} className="flex items-start gap-4">
                <div className="w-10 h-10 border border-gold/20 flex items-center justify-center flex-shrink-0 hover:border-gold hover:bg-gold/10 transition-colors">
                  <item.icon className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-1">
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-gold transition-colors"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-white">{item.value}</p>
                  )}
                </div>
              </div>
            ))}

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/51977498144?text=Hola%20AQUANTICA,%20quiero%20cotizar%20mi%20proyecto"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 font-medium hover:bg-[#128C7E] transition-colors mt-4"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Escribir por WhatsApp
            </a>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
          >
            <Card className="bg-gold/5 border-gold/20">
              <CardContent className="p-8">
                {isSuccess ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-white mb-2">
                      ¡Mensaje enviado!
                    </h3>
                    <p className="text-white/50 text-sm mb-6">
                      Gracias por contactarnos. Nuestro equipo se comunicará
                      contigo a la brevedad.
                    </p>
                    <a
                      href="https://wa.me/51977498144"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-gold text-navy px-6 py-2 font-medium hover:bg-gold-light transition-colors"
                    >
                      También por WhatsApp
                    </a>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-white mb-1">
                        Cuéntanos tu <span className="text-gold">proyecto</span>
                      </h3>
                      <p className="text-sm text-white/50">
                        Respondemos en menos de 24 horas
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nombre *</Label>
                        <Input
                          id="name"
                          required
                          placeholder="Tu nombre completo"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="bg-white/5 border-gold/20 focus:border-gold"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                          id="phone"
                          placeholder="987 654 321"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          className="bg-white/5 border-gold/20 focus:border-gold"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Correo electrónico *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        placeholder="tu@correo.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="bg-white/5 border-gold/20 focus:border-gold"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="service">Servicio de interés</Label>
                      <select
                        id="service"
                        value={formData.service}
                        onChange={(e) =>
                          setFormData({ ...formData, service: e.target.value })
                        }
                        className="w-full h-9 px-3 bg-white/5 border border-gold/20 rounded-md text-white text-sm focus:border-gold focus:outline-none"
                      >
                        <option value="" disabled className="bg-navy">
                          Selecciona un servicio…
                        </option>
                        {services.map((s) => (
                          <option key={s} value={s} className="bg-navy">
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Cuéntanos tu proyecto</Label>
                      <textarea
                        id="message"
                        rows={4}
                        placeholder="Describe brevemente qué necesitas…"
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-white/5 border border-gold/20 rounded-md text-white text-sm focus:border-gold focus:outline-none resize-vertical"
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="gold"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Enviando…
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Enviar consulta
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
