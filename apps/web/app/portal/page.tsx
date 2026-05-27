import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { DashboardStats } from "@/components/portal/dashboard-stats";
import { RecentProjects } from "@/components/portal/recent-projects";
import { ExpedienteTimeline } from "@/components/portal/expediente-timeline";

async function getDashboardData(userId: string) {
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
}

export default async function PortalPage() {
  const { userId } = auth();
  
  if (!userId) return null;

  const user = await getDashboardData(userId);
  
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
