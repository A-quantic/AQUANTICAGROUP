import { NextResponse } from "next/server";
import { prisma } from "@aquantica/database";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, service, message } = body;

    // Create lead in database
    const lead = await prisma.lead.create({
      data: {
        firstName: name.split(" ")[0],
        lastName: name.split(" ").slice(1).join(" "),
        email,
        phone,
        serviceType: service || "CONSULTA_GENERAL",
        message,
        source: "WEBSITE",
        status: "NEW",
      },
    });

    // Trigger AI classification (async)
    // This would call the FastAPI backend
    fetch(`${process.env.API_URL}/api/leads/classify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId: lead.id }),
    }).catch(console.error);

    // Revalidate landing page
    revalidatePath("/");

    return NextResponse.json(
      {
        success: true,
        leadId: lead.id,
        message: "Lead created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create lead" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json({ leads });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}
