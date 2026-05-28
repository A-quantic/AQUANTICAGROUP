"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

// Lista de emails de administradores (esto debería venir de la base de datos o variables de entorno)
const ADMIN_EMAILS = [
  "admin@aquantica-group.com",
  "gerencia@aquantica-group.com",
  // Agregar más emails de admin aquí
];

export default function RedirectPage() {
  const { isLoaded, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.push("/sign-in");
      return;
    }

    const email = user.emailAddresses[0]?.emailAddress;
    const isAdmin = ADMIN_EMAILS.includes(email || "");

    // Redirigir según rol
    if (isAdmin) {
      router.push("/admin");
    } else {
      router.push("/portal");
    }
  }, [isLoaded, user, router]);

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-white/60">Redirigiendo...</p>
      </div>
    </div>
  );
}
