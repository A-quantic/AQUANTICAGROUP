"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImagePlus, Loader2 } from "lucide-react";

export default function PublicarProyectoPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    description: "",
    serviceType: "",
    image: null as File | null,
  });
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Aquí iría la llamada a la API para guardar el proyecto
    // Por ahora simulamos un delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    alert("Proyecto publicado exitosamente");
    setLoading(false);
    
    // Reset form
    setFormData({
      title: "",
      location: "",
      description: "",
      serviceType: "",
      image: null,
    });
    setPreview(null);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-serif font-bold text-white mb-2">
        Publicar Proyecto
      </h1>
      <p className="text-white/60 mb-8">
        Comparte un nuevo proyecto para mostrar en el sitio web
      </p>

      <Card className="bg-navy-mid border-gold/10">
        <CardHeader>
          <CardTitle className="text-gold">Nuevo Proyecto</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white">Título del Proyecto</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ej: Titulación de Departamentos - Huancayo"
                className="bg-white/5 border-gold/20 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-white">Ubicación</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Ej: Huancayo, Junín"
                className="bg-white/5 border-gold/20 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="serviceType" className="text-white">Tipo de Servicio</Label>
              <select
                id="serviceType"
                value={formData.serviceType}
                onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-gold/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gold"
                required
              >
                <option value="" disabled>Seleccionar...</option>
                <option value="ingenieria">Ingeniería Civil</option>
                <option value="arquitectura">Arquitectura</option>
                <option value="construccion">Construcción</option>
                <option value="saneamiento">Saneamiento Físico Legal</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe el proyecto, alcance, duración, resultados..."
                className="bg-white/5 border-gold/20 text-white min-h-[120px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image" className="text-white">Imagen del Proyecto</Label>
              <div className="border-2 border-dashed border-gold/20 rounded-lg p-6 text-center hover:border-gold/40 transition-colors">
                {preview ? (
                  <div className="space-y-4">
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-h-48 mx-auto rounded-lg object-cover"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setPreview(null);
                        setFormData({ ...formData, image: null });
                      }}
                      className="border-gold/20 text-white hover:bg-gold/10"
                    >
                      Cambiar imagen
                    </Button>
                  </div>
                ) : (
                  <label className="cursor-pointer block">
                    <ImagePlus className="w-12 h-12 text-gold/60 mx-auto mb-2" />
                    <span className="text-white/60 text-sm">
                      Click para subir imagen
                    </span>
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gold text-navy hover:bg-gold/90"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Publicando...
                </>
              ) : (
                "Publicar Proyecto"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
