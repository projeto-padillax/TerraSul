
import Header from "@/components/site/header";
import Footer from "@/components/site/footer";
import BreadCrumb from "@/components/site/filteredBreadcrumb";
import Image from "next/image";
import { Suspense } from "react";
import EspecialList from "@/components/site/especialList";

type Params = { id: string };

export default async function EspecialPage({ params }: { params: Promise<Params> }) {
    const { id } = await params;
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <div className="shadow-lg">
                <Header />
            </div>
            <main className="flex-1">
                <section className="relative w-full py-8">

                    <div className="mx-auto w-[90%] max-w-7xl">
                        <div className="h-6 rounded-sm select-none mb-7">
                            <Suspense>
                                <BreadCrumb />
                            </Suspense>
                        </div>
                        <div className="relative w-full h-[200px] md:h-[240px] rounded-lg overflow-hidden">
                            <Image
                                src="/Anuncie seu imovel.jpg"
                                alt="Ambiente de sala com sofá"
                                fill
                                priority
                                sizes="100vw"
                                className="object-cover"
                            />
                            {/* Sombra lateral da esquerda para direita */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
                            <div className="absolute inset-y-0 left-0 flex items-center z-10 px-6">
                                <h1 className="text-white text-2xl ml-10 md:text-4xl font-semibold">
                                    Seleção Especial
                                </h1>
                            </div>
                        </div>
                        <EspecialList id={id} />
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
