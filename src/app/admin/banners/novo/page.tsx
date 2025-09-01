import BannerForm from "@/components/admin/bannerForm";

export default function NovoBannerPage() {
    return (
        <main className="py-12">
            <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10">
                <div className="mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
                        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                            Novo Banner na Home
                        </h1>
                        <p className="text-lg text-gray-600">
                            Crie um novo banner para a página inicial
                        </p>
                    </div>
                </div>
                <BannerForm mode="create" />
            </div>
        </main>
    )
}