"use client";

import { useState } from "react";
import { useProjects, useCreateProject } from "@/hooks/use-projects";
import { Button } from "@aquantica/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@aquantica/ui/card";
import { Input } from "@aquantica/ui/input";
import { Label } from "@aquantica/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, FolderOpen, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

const statusColors: Record<string, string> = {
  EVALUATION: "bg-yellow-500/20 text-yellow-400",
  QUOTED: "bg-blue-500/20 text-blue-400",
  APPROVED: "bg-green-500/20 text-green-400",
  IN_PROGRESS: "bg-gold/20 text-gold",
  COMPLETED: "bg-purple-500/20 text-purple-400",
  ON_HOLD: "bg-gray-500/20 text-gray-400",
};

const statusLabels: Record<string, string> = {
  EVALUATION: "En Evaluación",
  QUOTED: "Cotizado",
  APPROVED: "Aprobado",
  IN_PROGRESS: "En Progreso",
  COMPLETED: "Completado",
  ON_HOLD: "En Pausa",
};

const projectTypes = [
  { value: "SANEAMIENTO", label: "Saneamiento Físico Legal" },
  { value: "INDEPENDIZACION", label: "Independización de Predios" },
  { value: "DISENO", label: "Diseño Arquitectónico" },
  { value: "CONSTRUCCION", label: "Planificación y Obra" },
  { value: "LEVANTAMIENTO", label: "Levantamiento Topográfico" },
  { value: "COMPRAVENTA", label: "Compra y Venta" },
];

export default function ProyectosPage() {
  const { data: projects, isLoading } = useProjects();
  const createProject = useCreateProject();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "SANEAMIENTO",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createProject.mutateAsync(formData);
    setIsDialogOpen(false);
    setFormData({ title: "", description: "", type: "SANEAMIENTO" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white">
            Mis Proyectos
          </h1>
          <p className="text-white/50 mt-1">
            Gestiona tus trámites y expedientes
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gold">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Proyecto
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-navy-mid border-gold/20 text-white">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl">
                Crear Nuevo Proyecto
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título del proyecto *</Label>
                <Input
                  id="title"
                  required
                  placeholder="Ej: Saneamiento Casa Principal"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="bg-white/5 border-gold/20 focus:border-gold"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de servicio *</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full h-9 px-3 bg-white/5 border border-gold/20 rounded-md text-white text-sm focus:border-gold focus:outline-none"
                >
                  {projectTypes.map((type) => (
                    <option key={type.value} value={type.value} className="bg-navy">
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <textarea
                  id="description"
                  rows={3}
                  placeholder="Describe brevemente tu proyecto..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white/5 border border-gold/20 rounded-md text-white text-sm focus:border-gold focus:outline-none resize-vertical"
                />
              </div>
              <Button
                type="submit"
                variant="gold"
                className="w-full"
                disabled={createProject.isPending}
              >
                {createProject.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creando...
                  </>
                ) : (
                  "Crear Proyecto"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-gold animate-spin" />
        </div>
      ) : projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project: any) => (
            <Card
              key={project.id}
              className="bg-navy-mid border-gold/10 hover:border-gold/30 transition-colors"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="w-5 h-5 text-gold" />
                    <span className="text-xs text-gold">{project.code}</span>
                  </div>
                  <Badge
                    variant="secondary"
                    className={statusColors[project.status]}
                  >
                    {statusLabels[project.status] || project.status}
                  </Badge>
                </div>
                <CardTitle className="text-white font-serif text-lg mt-2">
                  {project.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white/50 line-clamp-2 mb-4">
                  {project.description || "Sin descripción"}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/40">
                    {new Date(project.createdAt).toLocaleDateString("es-PE")}
                  </span>
                  <Link href={`/portal/proyectos/${project.id}`}>
                    <Button variant="ghost" size="sm" className="text-gold">
                      Ver detalles
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-navy-mid border-gold/10">
          <CardContent className="py-12 text-center">
            <FolderOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              No tienes proyectos aún
            </h3>
            <p className="text-white/50 mb-4">
              Comienza creando tu primer proyecto de saneamiento
            </p>
            <Button variant="gold" onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Crear Proyecto
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
