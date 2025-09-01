import ChamadaForm from "@/components/admin/chamadaForm";

export default function NovoChamadaPage() {
    return (
        <main className="py-12">
            <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10">
                <div className="mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
                        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                            Nova Chamada na Home
                        </h1>
                        <p className="text-lg text-gray-600">
                            Crie uma nova chamada para a página inicial
                        </p>
                    </div>
                </div>
                <ChamadaForm mode="create" />
            </div>
        </main>
    );
}