"use client";

import { Card, CardContent } from "@aquantica/ui/card";
import { FolderKanban, CheckCircle, Clock, AlertCircle } from "lucide-react";

interface DashboardStatsProps {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
}

export function DashboardStats({
  totalProjects,
  activeProjects,
  completedProjects,
}: DashboardStatsProps) {
  const stats = [
    {
      title: "Total Proyectos",
      value: totalProjects,
      icon: FolderKanban,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
    },
    {
      title: "En Progreso",
      value: activeProjects,
      icon: Clock,
      color: "text-gold",
      bgColor: "bg-gold/10",
    },
    {
      title: "Completados",
      value: completedProjects,
      icon: CheckCircle,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
    },
    {
      title: "Pendientes",
      value: Math.max(0, totalProjects - activeProjects - completedProjects),
      icon: AlertCircle,
      color: "text-orange-400",
      bgColor: "bg-orange-400/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="bg-navy-mid border-gold/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/50">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}
                >
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
