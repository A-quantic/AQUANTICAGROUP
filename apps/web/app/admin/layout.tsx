"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

// Lista de emails de administradores
const ADMIN_EMAILS = [
  "admin@aquantica-group.com",
  "gerencia@aquantica-group.com",
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  
  useEffect(() => {
    if (!isLoaded) return;
    
    if (!userId) {
      router.push("/sign-in");
      return;
    }

    // Verificar si es admin
    const email = user?.emailAddresses[0]?.emailAddress;
    const isAdmin = ADMIN_EMAILS.includes(email || "");
    
    if (!isAdmin) {
      // Si no es admin, redirigir al portal
      router.push("/portal");
    }
  }, [isLoaded, userId, user, router]);
  
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="text-gold text-lg">Cargando...</div>
      </div>
    );
  }
  
  if (!userId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-navy">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
