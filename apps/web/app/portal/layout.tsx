"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PortalSidebar } from "@/components/portal/portal-sidebar";
import { PortalHeader } from "@/components/portal/portal-header";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (isLoaded && !userId) {
      router.push("/sign-in");
    }
  }, [isLoaded, userId, router]);
  
  // Mostrar loading mientras verifica auth
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="text-gold text-lg">Cargando portal...</div>
      </div>
    );
  }
  
  // No renderizar nada si no hay usuario (redirección en progreso)
  if (!userId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-navy">
      <PortalHeader />
      <div className="flex">
        <PortalSidebar />
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
