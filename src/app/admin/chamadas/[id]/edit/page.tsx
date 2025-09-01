import { notFound } from "next/navigation";
import { findChamada } from "@/lib/actions/chamada";
import ChamadaForm from "@/components/admin/chamadaForm";

interface EditChamadasPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditChamadasPage({ params }: EditChamadasPageProps) {
    const chamadaId = await params.then(p => parseInt(p.id));
    if (isNaN(chamadaId)) {
        notFound();
    }

    try {
        const chamada = await findChamada(chamadaId);
        if (!chamada) {
            notFound();
        }
        return (
            <main className="py-12">
                <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10">
                    <div className="mb-8">
                        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
                            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                                Editar Chamada
                            </h1>
                            <p className="text-lg text-gray-600">
                                {`Edite as informações da chamada #${chamada.ordem}`}
                            </p>
                        </div>
                    </div>
                    <ChamadaForm chamada={chamada} mode="edit" />
                </div>
            </main>
        );

    } catch (error) {
        console.error("Erro ao carregar chamada:", error);
        notFound();
    }
}