import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { ReactQueryProvider } from "@/lib/react-query-provider";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0a1628",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://aquanticagroup.com"),
  title: {
    default: "AQUANTICA GROUP | Saneamiento Inmobiliario y Gestión Legal en Perú",
    template: "%s | AQUANTICA GROUP",
  },
  description: "AQUANTICA GROUP - Expertos en saneamiento físico legal de propiedades en Perú. Servicios de SUNARP, COFOPRI, independización de predios, licencias de construcción, planos arquitectónicos y gestión inmobiliaria integral. Transformamos propiedades irregularizadas en activos legales.",
  keywords: [
    "Aquantica Group",
    "Aquantica Inmobiliaria",
    "Aquantica Grupo",
    "Grupo Aquantica",
    "saneamiento físico legal",
    "saneamiento inmobiliario Perú",
    "SUNARP",
    "COFOPRI",
    "independización de predios",
    "licencia de construcción",
    "planos arquitectónicos",
    "gestión inmobiliaria",
    "propiedades irregularizadas",
    "regularización de terrenos",
    "inmobiliaria Lima",
    "asesoría inmobiliaria",
    "trámites inmobiliarios",
    "escrituras públicas",
    "partidas registrales",
    "bienes raíces Perú",
  ],
  authors: [{ name: "AQUANTICA GROUP" }],
  creator: "AQUANTICA GROUP",
  publisher: "AQUANTICA GROUP",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: "https://aquanticagroup.com",
    siteName: "AQUANTICA GROUP",
    title: "AQUANTICA GROUP | Saneamiento Inmobiliario y Gestión Legal",
    description: "Expertos en saneamiento físico legal de propiedades en Perú. SUNARP, COFOPRI, independización de predios y gestión inmobiliaria integral.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AQUANTICA GROUP - Saneamiento Inmobiliario en Perú",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AQUANTICA GROUP | Saneamiento Inmobiliario Perú",
    description: "Expertos en saneamiento físico legal, SUNARP, COFOPRI y gestión inmobiliaria integral.",
    images: ["/twitter-image.jpg"],
    creator: "@aquanticagroup",
  },
  alternates: {
    canonical: "https://aquanticagroup.com",
    languages: {
      "es-PE": "https://aquanticagroup.com",
      "es": "https://aquanticagroup.com",
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
  category: "Inmobiliaria",
  classification: "Servicios Legales e Inmobiliarios",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: undefined,
        variables: {
          colorBackground: "#0a1628",
          colorPrimary: "#c9a84c",
          colorText: "#ffffff",
          colorTextSecondary: "#ffffff80",
          colorInputBackground: "#11213f",
          colorInputText: "#ffffff",
          colorDanger: "#ef4444",
          borderRadius: "0.5rem",
        },
        elements: {
          card: "bg-[#0a1628] border border-[#c9a84c]/20 shadow-2xl",
          headerTitle: "text-white font-serif",
          headerSubtitle: "text-white/60",
          formFieldLabel: "text-white/80",
          formFieldInput: "bg-[#11213f] border-white/20 text-white placeholder:text-white/40",
          formButtonPrimary: "bg-[#c9a84c] text-[#0a1628] hover:bg-[#c9a84c]/90",
          formButtonReset: "text-white/60 hover:text-white",
          footerActionLink: "text-[#c9a84c] hover:text-[#c9a84c]/80",
          identityPreviewText: "text-white",
          identityPreviewEditButton: "text-[#c9a84c]",
          formFieldErrorText: "text-red-400",
          formFieldWarningText: "text-yellow-400",
          alertText: "text-white",
          alert: "bg-[#11213f] border border-white/20",
          socialButtonsBlockButton: "bg-white/10 border border-white/20 text-white hover:bg-white/20",
          socialButtonsBlockButtonText: "text-white",
          dividerLine: "bg-white/20",
          dividerText: "text-white/60",
          formFieldSuccessText: "text-green-400",
          otpCodeFieldInput: "bg-[#11213f] border-white/20 text-white",
          selectButton: "bg-[#11213f] border-white/20 text-white",
          selectOptionsContainer: "bg-[#11213f] border border-white/20",
          selectOption: "text-white hover:bg-white/10",
          phoneInputBox: "bg-[#11213f] border-white/20",
          phoneInputBoxInput: "text-white",
        },
      }}
    >
      <html lang="es">
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@graph": [
                  {
                    "@type": "Organization",
                    "@id": "https://aquanticagroup.com/#organization",
                    name: "AQUANTICA GROUP",
                    url: "https://aquanticagroup.com",
                    logo: {
                      "@type": "ImageObject",
                      url: "https://aquanticagroup.com/logo.png",
                      width: 512,
                      height: 512,
                    },
                    description: "Expertos en saneamiento físico legal de propiedades en Perú",
                    sameAs: [
                      "https://www.facebook.com/aquanticagroup",
                      "https://www.linkedin.com/company/aquanticagroup",
                      "https://www.instagram.com/aquanticagroup",
                    ],
                    contactPoint: {
                      "@type": "ContactPoint",
                      telephone: "+51-1-234-5678",
                      contactType: "customer service",
                      areaServed: "PE",
                      availableLanguage: ["Spanish"],
                    },
                  },
                  {
                    "@type": "WebSite",
                    "@id": "https://aquanticagroup.com/#website",
                    url: "https://aquanticagroup.com",
                    name: "AQUANTICA GROUP",
                    publisher: {
                      "@id": "https://aquanticagroup.com/#organization",
                    },
                    potentialAction: {
                      "@type": "SearchAction",
                      target: {
                        "@type": "EntryPoint",
                        urlTemplate: "https://aquanticagroup.com/buscar?q={search_term_string}",
                      },
                      "query-input": "required name=search_term_string",
                    },
                  },
                  {
                    "@type": "LocalBusiness",
                    "@id": "https://aquanticagroup.com/#localbusiness",
                    name: "AQUANTICA GROUP",
                    image: "https://aquanticagroup.com/logo.png",
                    url: "https://aquanticagroup.com",
                    telephone: "+51-1-234-5678",
                    address: {
                      "@type": "PostalAddress",
                      streetAddress: "Av. Principal 123",
                      addressLocality: "Lima",
                      addressRegion: "Lima",
                      postalCode: "15001",
                      addressCountry: "PE",
                    },
                    geo: {
                      "@type": "GeoCoordinates",
                      latitude: -12.0464,
                      longitude: -77.0428,
                    },
                    openingHoursSpecification: {
                      "@type": "OpeningHoursSpecification",
                      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                      opens: "09:00",
                      closes: "18:00",
                    },
                    priceRange: "$$",
                    areaServed: {
                      "@type": "Country",
                      name: "Perú",
                    },
                    serviceType: [
                      "Saneamiento físico legal",
                      "Gestión inmobiliaria",
                      "Trámites SUNARP",
                      "Trámites COFOPRI",
                      "Independización de predios",
                    ],
                  },
                  {
                    "@type": "Service",
                    "@id": "https://aquanticagroup.com/#service",
                    serviceType: "Saneamiento Inmobiliario",
                    provider: {
                      "@id": "https://aquanticagroup.com/#localbusiness",
                    },
                    areaServed: {
                      "@type": "Country",
                      name: "Perú",
                    },
                    description: "Servicios profesionales de saneamiento físico legal de propiedades en Perú",
                    offers: {
                      "@type": "Offer",
                      description: "Consulta inicial gratuita",
                    },
                  },
                ],
              }),
            }}
          />
        </head>
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
