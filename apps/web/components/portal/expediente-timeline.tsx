"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle2, AlertCircle, FileText } from "lucide-react";

interface Project {
  id: string;
  title: string;
  expediente?: {
    status: string;
    observations?: Array<{
      id: string;
      type: string;
      description: string;
      status: string;
    }>;
  } | null;
}

interface ExpedienteTimelineProps {
  projects: Project[];
}

const expedienteStatuses: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "En Borrador", color: "text-gray-400" },
  PENDING_DOCS: { label: "Pendiente Documentos", color: "text-yellow-400" },
  SUBMITTED: { label: "Presentado", color: "text-blue-400" },
  IN_REVIEW: { label: "En Revisión", color: "text-gold" },
  OBSERVADO: { label: "Observado", color: "text-orange-400" },
  RESOLVED: { label: "Resuelto", color: "text-green-400" },
  APPROVED: { label: "Aprobado", color: "text-green-500" },
  REJECTED: { label: "Rechazado", color: "text-red-400" },
};

export function ExpedienteTimeline({ projects }: ExpedienteTimelineProps) {
  const projectsWithExpediente = projects.filter((p) => p.expediente);

  if (projectsWithExpediente.length === 0) {
    return (
      <Card className="bg-navy-mid border-gold/10">
        <CardHeader>
          <CardTitle className="text-white font-serif">
            Estado de Expedientes
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Clock className="w-12 h-12 text-white/20 mx-auto mb-3" />
          <p className="text-white/50">
            No hay expedientes activos
          </p>
          <p className="text-sm text-white/30 mt-1">
            Los trámites en proceso aparecerán aquí
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-navy-mid border-gold/10">
      <CardHeader>
        <CardTitle className="text-white font-serif">
          Estado de Expedientes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {projectsWithExpediente.slice(0, 3).map((project) => {
          const expediente = project.expediente!;
          const status = expedienteStatuses[expediente.status] || {
            label: expediente.status,
            color: "text-white",
          };

          const hasObservations = expediente.observations && expediente.observations.length > 0;
          const pendingObservations = expediente.observations?.filter(
            (o) => o.status === "PENDING" || o.status === "IN_PROGRESS"
          ).length || 0;

          return (
            <div
              key={project.id}
              className="p-4 bg-white/5 rounded-lg border border-gold/10"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-medium text-white">{project.title}</h4>
                  <p className="text-sm text-white/50">
                    Expediente {project.id.slice(-6)}
                  </p>
                </div>
                <span className={`text-sm font-medium ${status.color}`}>
                  {status.label}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full rounded-full ${
                    expediente.status === "APPROVED"
                      ? "bg-green-500"
                      : expediente.status === "OBSERVADO"
                      ? "bg-orange-400"
                      : "bg-gold"
                  }`}
                  style={{
                    width:
                      expediente.status === "DRAFT"
                        ? "10%"
                        : expediente.status === "PENDING_DOCS"
                        ? "25%"
                        : expediente.status === "SUBMITTED"
                        ? "40%"
                        : expediente.status === "IN_REVIEW"
                        ? "60%"
                        : expediente.status === "OBSERVADO"
                        ? "70%"
                        : expediente.status === "RESOLVED"
                        ? "85%"
                        : expediente.status === "APPROVED"
                        ? "100%"
                        : "50%",
                  }}
                />
              </div>

              {/* Observations */}
              {hasObservations && (
                <div className="flex items-center gap-2 text-sm">
                  {pendingObservations > 0 ? (
                    <>
                      <AlertCircle className="w-4 h-4 text-orange-400" />
                      <span className="text-orange-400">
                        {pendingObservations} observación
                        {pendingObservations > 1 ? "es" : ""} pendiente
                        {pendingObservations > 1 ? "s" : ""}
                      </span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span className="text-green-400">
                        Todas las observaciones resueltas
                      </span>
                    </>
                  )}
                </div>
              )}

              {/* Document indicator */}
              <div className="flex items-center gap-2 mt-2 text-sm text-white/40">
                <FileText className="w-4 h-4" />
                <span>Ver detalles del expediente</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
