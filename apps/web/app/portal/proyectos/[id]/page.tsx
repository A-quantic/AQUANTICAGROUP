"use client";

import { useParams } from "next/navigation";
import { useProject, useProjectDocuments, useProjectTimeline } from "@/hooks/use-projects";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";

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

export default function ProyectoDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: project, isLoading: isLoadingProject } = useProject(id);
  const { data: documents, isLoading: isLoadingDocs } = useProjectDocuments(id);
  const { data: timeline, isLoading: isLoadingTimeline } = useProjectTimeline(id);

  if (isLoadingProject) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-white/50">Proyecto no encontrado</p>
        <Link href="/portal/proyectos">
          <Button variant="gold" className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a proyectos
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link href="/portal/proyectos">
            <Button variant="ghost" size="sm" className="text-white/60 mb-2">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Volver
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-serif font-bold text-white">
              {project.title}
            </h1>
            <Badge
              variant="secondary"
              className={statusColors[project.status]}
            >
              {statusLabels[project.status] || project.status}
            </Badge>
          </div>
          <p className="text-gold text-sm mt-1">{project.code}</p>
        </div>
      </div>

      {/* Description */}
      {project.description && (
        <Card className="bg-navy-mid border-gold/10">
          <CardContent className="p-4">
            <p className="text-white/80">{project.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-navy-mid border-gold/10">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="documents">
            Documentos ({documents?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Project Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-navy-mid border-gold/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50">Fecha inicio</p>
                    <p className="text-white font-medium">
                      {project.startDate
                        ? format(new Date(project.startDate), "dd MMM yyyy", {
                            locale: es,
                          })
                        : "Pendiente"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-navy-mid border-gold/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50">Deadline</p>
                    <p className="text-white font-medium">
                      {project.deadline
                        ? format(new Date(project.deadline), "dd MMM yyyy", {
                            locale: es,
                          })
                        : "No definido"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-navy-mid border-gold/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50">Tipo</p>
                    <p className="text-white font-medium">{project.type}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-navy-mid border-gold/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50">Documentos</p>
                    <p className="text-white font-medium">
                      {documents?.length || 0} subidos
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Expediente Status */}
          {project.expediente && (
            <Card className="bg-navy-mid border-gold/10">
              <CardHeader>
                <CardTitle className="text-white font-serif text-lg">
                  Estado del Expediente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Estado</span>
                    <Badge className={statusColors[project.expediente.status]}>
                      {statusLabels[project.expediente.status] ||
                        project.expediente.status}
                    </Badge>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold rounded-full"
                      style={{ width: "60%" }}
                    />
                  </div>

                  {project.expediente.observations &&
                    project.expediente.observations.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm text-white/60 mb-2">
                          Observaciones:
                        </p>
                        {project.expediente.observations.map(
                          (obs: any) => (
                            <div
                              key={obs.id}
                              className="flex items-start gap-2 p-3 bg-white/5 rounded-lg mb-2"
                            >
                              <AlertCircle className="w-4 h-4 text-orange-400 mt-0.5" />
                              <div>
                                <p className="text-sm text-white">
                                  {obs.description}
                                </p>
                                <p className="text-xs text-white/50">
                                  {obs.entity} • {obs.status}
                                </p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="documents">
          <Card className="bg-navy-mid border-gold/10">
            <CardHeader>
              <CardTitle className="text-white font-serif">
                Documentos del Proyecto
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingDocs ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-gold animate-spin" />
                </div>
              ) : documents && documents.length > 0 ? (
                <div className="space-y-2">
                  {documents.map((doc: any) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-gold" />
                        <span className="text-white">{doc.name}</span>
                      </div>
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="ghost" size="sm" className="text-gold">
                          Ver
                        </Button>
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/50 text-center py-8">
                  No hay documentos subidos aún
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card className="bg-navy-mid border-gold/10">
            <CardHeader>
              <CardTitle className="text-white font-serif">
                Historial del Proyecto
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingTimeline ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-gold animate-spin" />
                </div>
              ) : timeline && timeline.length > 0 ? (
                <div className="space-y-4">
                  {timeline.map((event: any) => (
                    <div key={event.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-gold rounded-full" />
                        <div className="w-px h-full bg-gold/30" />
                      </div>
                      <div className="pb-6">
                        <p className="text-sm text-gold">
                          {format(new Date(event.createdAt), "dd MMM yyyy", {
                            locale: es,
                          })}
                        </p>
                        <p className="text-white font-medium">{event.title}</p>
                        <p className="text-sm text-white/60">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/50 text-center py-8">
                  No hay eventos registrados
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
