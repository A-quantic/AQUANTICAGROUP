import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { DashboardStats } from "@/components/portal/dashboard-stats";
import { RecentProjects } from "@/components/portal/recent-projects";
import { ExpedienteTimeline } from "@/components/portal/expediente-timeline";

export const metadata: Metadata = {
  title: "Portal de Clientes | Gestión de Proyectos Inmobiliarios",
  description: "Accede a tu portal de cliente AQUANTICA GROUP. Gestiona tus proyectos de saneamiento inmobiliario, revisa documentos y sigue el estado de tus trámites SUNARP y COFOPRI.",
  robots: {
    index: false,
    follow: false,
  },
};

async function getDashboardData(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        clientProfile: {
          include: {
            projects: {
              take: 5,
              orderBy: { createdAt: "desc" },
              include: {
                expediente: true,
              },
            },
          },
        },
      },
    });
    return user;
  } catch (error) {
    console.error("Database error:", error);
    return null;
  }
}

export default async function PortalPage() {
  const { userId } = auth();
  
  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-2xl font-serif font-bold text-white mb-4">
          Portal de Clientes
        </h1>
        <p className="text-muted-foreground mb-6">
          Por favor inicia sesión para acceder a tu portal
        </p>
        <a 
          href="/sign-in" 
          className="px-6 py-3 bg-gold text-navy font-medium rounded-lg hover:bg-gold/90 transition-colors"
        >
          Iniciar Sesión
        </a>
      </div>
    );
  }

  const user = await getDashboardData(userId);
  
  // Si no hay usuario en la base de datos, mostrar estado vacío
  if (!user) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white">
            Bienvenido a tu Portal
          </h1>
          <p className="text-muted-foreground mt-1">
            Tu cuenta está activada. Pronto podrás ver tus proyectos aquí.
          </p>
        </div>
        <div className="p-8 bg-navy/50 rounded-xl border border-gold/20 text-center">
          <p className="text-white/60 mb-4">
            No tienes proyectos registrados aún.
          </p>
          <a 
            href="#contacto" 
            className="px-6 py-3 bg-gold text-navy font-medium rounded-lg hover:bg-gold/90 transition-colors inline-block"
          >
            Iniciar un Proyecto
          </a>
        </div>
      </div>
    );
  }
  
  const projects = user?.clientProfile?.projects || [];
  const activeProjects = projects.filter((p: any) => 
    ["EVALUATION", "QUOTED", "APPROVED", "IN_PROGRESS"].includes(p.status)
  );
  const completedProjects = projects.filter((p: any) => p.status === "COMPLETED");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-white">
          Bienvenido, <span className="text-gold">{user?.firstName}</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Aquí puedes ver el estado de tus proyectos y expedientes
        </p>
      </div>

      <DashboardStats 
        totalProjects={projects.length}
        activeProjects={activeProjects.length}
        completedProjects={completedProjects.length}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentProjects projects={projects} />
        <ExpedienteTimeline projects={projects} />
      </div>
    </div>
  );
}
