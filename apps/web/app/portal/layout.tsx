import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PortalSidebar } from "@/components/portal/portal-sidebar";
import { PortalHeader } from "@/components/portal/portal-header";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();
  
  if (!userId) {
    redirect("/sign-in");
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
