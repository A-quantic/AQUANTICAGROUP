import { prisma } from "../src";
import { UserRole, AdminDept, ServiceType, ProjectType } from "@prisma/client";

async function main() {
  console.log("🌱 Starting database seed...");

  // Create initial admin user (to be linked with Clerk later)
  const admin = await prisma.user.create({
    data: {
      email: "admin@aquantica-group.com",
      clerkId: "placeholder_admin_clerk_id",
      firstName: "Administrador",
      lastName: "AQUANTICA",
      role: UserRole.SUPER_ADMIN,
      adminProfile: {
        create: {
          department: AdminDept.MANAGEMENT,
          position: "Director General",
        },
      },
    },
  });

  console.log("✅ Created admin user:", admin.email);

  // Create service catalog
  const services = [
    {
      name: "Saneamiento Físico Legal",
      description: "Regularización y saneamiento de propiedades en SUNARP, COFOPRI y municipalidades",
      type: ServiceType.SANEAMIENTO_FISICO_LEGAL,
    },
    {
      name: "Independización de Predios",
      description: "Trámites de independización y subdivisión de lotes",
      type: ServiceType.INDEPENDIZACION,
    },
    {
      name: "Diseño Arquitectónico",
      description: "Planos arquitectónicos funcionales y modernos",
      type: ServiceType.DISENO_ARQUITECTONICO,
    },
    {
      name: "Planificación y Obra",
      description: "Licencias de construcción, ejecución y supervisión",
      type: ServiceType.PLANIFICACION_OBRA,
    },
    {
      name: "Levantamiento Topográfico",
      description: "Mediciones precisas para documentación técnica",
      type: ServiceType.LEVANTAMIENTO_TOPOGRAFICO,
    },
    {
      name: "Compra y Venta",
      description: "Asesoría integral en transacciones inmobiliarias",
      type: ServiceType.COMPRA_VENTA,
    },
  ];

  console.log("✅ Service catalog ready:", services.length, "services");

  console.log("🎉 Database seed completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
