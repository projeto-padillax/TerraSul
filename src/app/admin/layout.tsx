import { AdminFooter } from "@/components/admin/footer";
import { AdminHeader } from "@/components/admin/header";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import React from "react";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getSession();

    if (!session) {
        redirect("/login");
    }
    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <AdminHeader userName={session.name} userRole={session.role}/>
            <main className="flex-1 py-4">
                {children}
            </main>
            <AdminFooter />
        </div>
    )
}