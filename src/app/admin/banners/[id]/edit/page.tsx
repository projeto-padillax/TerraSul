import { notFound } from "next/navigation";
import { findBanner } from "@/lib/actions/banner";
import BannerForm from "@/components/admin/bannerForm";

interface EditBannerPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditBannerPage({ params }: EditBannerPageProps) {
    const bannerId = await params.then(p => parseInt(p.id));
    if (isNaN(bannerId)) {
        notFound();
    }

    try {
        const banner = await findBanner(bannerId);
        if (!banner) {
            notFound();
        }

        return (
            <main className="py-12">
                <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10">
                    <div className="mb-8">
                        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
                            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                                Editar Banner
                            </h1>
                            <p className="text-lg text-gray-600">
                                Edite as informações do banner
                            </p>
                        </div>
                    </div>
                    <BannerForm banner={banner} mode="edit" />
                </div>
            </main>
        );

    } catch (error) {
        console.error("Erro ao carregar banner:", error);
        notFound();
    }
}