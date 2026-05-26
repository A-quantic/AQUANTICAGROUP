import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { ReactQueryProvider } from "@/lib/react-query-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "AQUANTICA — Plataforma de Gestión Inmobiliaria y Saneamiento Legal",
  description: "Infraestructura digital para gestión y saneamiento inmobiliario en Perú. Saneamiento físico legal, SUNARP, COFOPRI, licencias de construcción.",
  keywords: "saneamiento físico legal, SUNARP, COFOPRI, licencia construcción, independización predios, planos arquitectónicos, Perú",
  openGraph: {
    title: "AQUANTICA — Saneamiento Inmobiliario en Perú",
    description: "Transformamos propiedades irregularizadas en activos legales y comercializables.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#c9a84c",
          colorBackground: "#0a1628",
          colorText: "#ffffff",
        },
      }}
    >
      <html lang="es">
        <body className="min-h-screen">
          <ReactQueryProvider>
            {children}
          </ReactQueryProvider>
          <Toaster 
            position="top-right" 
            toastOptions={{
              style: {
                background: '#11213f',
                color: '#ffffff',
                border: '1px solid rgba(201, 168, 76, 0.2)',
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
