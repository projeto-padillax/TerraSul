import { notFound } from "next/navigation";
import SlideForm from "@/components/admin/slideForm";
import { findSlide } from "@/lib/actions/slide";

interface EditSlidePageProps {
    params: Promise<{ id: string }>;
}

export default async function EditSlidePage({ params }: EditSlidePageProps) {
    const slideId = await params.then(p => parseInt(p.id));
    console.log(slideId)
    if (isNaN(slideId)) {
        notFound();
    }

    try {
        const slide = await findSlide(slideId);
        if (!slide) {
            notFound();
        }

        return (
            <main className="py-12">
                <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10">
                    <div className="mb-8">
                        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
                            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                                Editar Slide
                            </h1>
                            <p className="text-lg text-gray-600">
                                {`Edite as informações do slide #${slide.ordem}`}
                            </p>
                        </div>
                    </div>
                    <SlideForm slide={slide} mode="edit" />
                </div>
            </main>
        );

    } catch (error) {
        console.error("Erro ao carregar slide:", error);
        notFound();
    }
}