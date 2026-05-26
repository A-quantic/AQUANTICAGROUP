"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@aquantica/ui/card";
import { Button } from "@aquantica/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Plus } from "lucide-react";

interface Project {
  id: string;
  code: string;
  title: string;
  status: string;
  type: string;
  expediente?: {
    status: string;
  } | null;
}

interface RecentProjectsProps {
  projects: Project[];
}

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

export function RecentProjects({ projects }: RecentProjectsProps) {
  if (projects.length === 0) {
    return (
      <Card className="bg-navy-mid border-gold/10">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gold" />
          </div>
          <h3 className="font-serif text-xl font-bold text-white mb-2">
            No tienes proyectos aún
          </h3>
          <p className="text-white/50 mb-4">
            Comienza tu primer trámite de saneamiento hoy
          </p>
          <Link href="/portal/proyectos/nuevo">
            <Button variant="gold">Crear Proyecto</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-navy-mid border-gold/10">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white font-serif">
          Proyectos Recientes
        </CardTitle>
        <Link href="/portal/proyectos">
          <Button variant="ghost" size="sm" className="text-gold">
            Ver todos
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {projects.slice(0, 5).map((project) => (
          <Link
            key={project.id}
            href={`/portal/proyectos/${project.id}`}
            className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-gold">{project.code}</span>
                <Badge
                  variant="secondary"
                  className={statusColors[project.status]}
                >
                  {statusLabels[project.status] || project.status}
                </Badge>
              </div>
              <h4 className="font-medium text-white group-hover:text-gold transition-colors">
                {project.title}
              </h4>
              <p className="text-sm text-white/50">{project.type}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-gold transition-colors" />
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
