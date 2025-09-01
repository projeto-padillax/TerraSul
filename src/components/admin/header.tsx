"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import Link from "next/link";
import { logoutUser } from "@/lib/auth/logout";

interface AdminHeaderProps {
  userName: string;
  userRole: "ADMIN" | "CORRETOR" | "SUPERADMIN";
}

export function AdminHeader({ userName, userRole }: AdminHeaderProps) {
  const router = useRouter();

    const handleLogout = async () => {
    try {
      await logoutUser();
      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <header className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/admin">
            <h1
              className="text-xl font-semibold cursor-pointer"
              onClick={() => router.push("/admin")}
            >
              Painel de Controle
            </h1>
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="text-sm">Bem-vindo, {userName} ({userRole})</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent border-gray-600 text-white hover:bg-gray-700"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
