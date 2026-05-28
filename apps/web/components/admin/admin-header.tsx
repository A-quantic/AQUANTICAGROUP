"use client";

import { useAuth, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export function AdminHeader() {
  const { userId } = useAuth();

  return (
    <header className="border-b border-gold/10 bg-navy-mid sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="font-serif text-xl font-bold text-gold tracking-wider">
              AQUANTICA
            </span>
            <span className="text-white/60 text-sm">| Admin</span>
          </Link>

          <div className="flex items-center gap-4">
            {userId ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <Link
                href="/sign-in"
                className="text-sm text-white/60 hover:text-gold transition-colors"
              >
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
