import { AdminDashboard } from "@/components/admin/dashboard";

export default function AdminPage() {
  return (
    // <AuthGuard>
      <div className="min-h-screen bg-gray-100">
        <main className="py-8">
          <AdminDashboard />
        </main>
      </div>
    // </AuthGuard>
  )
}