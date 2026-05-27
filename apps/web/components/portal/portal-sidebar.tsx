"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/components/ui/utils";
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  MessageSquare,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";

const navItems = [
  {
    title: "Dashboard",
    href: "/portal",
    icon: LayoutDashboard,
  },
  {
    title: "Mis Proyectos",
    href: "/portal/proyectos",
    icon: FolderOpen,
  },
  {
    title: "Documentos",
    href: "/portal/documentos",
    icon: FileText,
  },
  {
    title: "Chat con AURA",
    href: "/portal/chat",
    icon: MessageSquare,
  },
  {
    title: "Configuración",
    href: "/portal/configuracion",
    icon: Settings,
  },
  {
    title: "Ayuda",
    href: "/portal/ayuda",
    icon: HelpCircle,
  },
];

export function PortalSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-gold/10 bg-navy-mid min-h-[calc(100vh-64px)]">
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-lg",
                isActive
                  ? "bg-gold/10 text-gold"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gold/10">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Volver al sitio
        </Link>
      </div>
    </aside>
  );
}
