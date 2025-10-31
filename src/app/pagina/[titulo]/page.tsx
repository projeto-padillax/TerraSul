import { notFound } from "next/navigation";
import Header from "@/components/site/header";
import Footer from "@/components/site/footer";
import { getPaginaByUrl } from "@/lib/actions/contentPages";
import "@/app/html-padrao.css";
import BreadCrumb from "@/components/site/filteredBreadcrumb";

interface DynamicPageProps {
  params: Promise<{ titulo: string }>;
}

export default async function DynamicPage({ params }: DynamicPageProps) {
  const tituloOriginal = await params.then((p) => p.titulo);
  const formatPageUrl = (titulo: string) => {
    return `${process.env.NEXT_PUBLIC_BASE_URL || ""}/pagina/${slugify(
      titulo
    )}`;
  };

  function slugify(text: string): string {
    return text
      .normalize("NFD") // separa acentos das letras
      .replace(/[\u0300-\u036f]/g, "") // remove acentos
      .replace(/[^a-zA-Z0-9\s-]/g, "") // remove caracteres especiais
      .trim() // remove espaços no início e fim
      .replace(/\s+/g, "-") // troca espaços por hífens
  }
  const titulo = formatPageUrl(tituloOriginal);
  const pageData = await getPaginaByUrl(titulo);
  if (!pageData) notFound();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 bg-white">
        <div className="w-full py-3">
          <div className="max-w-7xl mx-auto px-4">
            <div className="h-6 rounded-sm select-none">
              <BreadCrumb />
            </div>
          </div>
        </div>

        {pageData.imagem ? (
          <section className="relative w-full pt-6 pb-4">
            <div className="max-w-7xl mx-auto px-4">
              <div className="relative w-full h-[200px] md:h-[240px] rounded-lg overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.938813025210084) 0%, rgba(0,0,0,0) 40%),url(${pageData.imagem})`,
                  }}
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-y-0 left-0 flex items-center z-10 px-6">
                  <h1 className="text-white text-2xl md:text-4xl font-semibold">
                    {pageData.titulo}
                  </h1>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="pt-6 pb-4">
            <div className="max-w-4xl mx-auto px-4">
              <h1 className="text-2xl md:text-4xl font-semibold text-gray-900">
                {pageData.titulo}
              </h1>
            </div>
          </section>
        )}

        <section className="pt-4 md:pt-6 pb-12">
          <div className="max-w-4xl mx-auto px-4">
            <div className="html-padrao">
              <article
                dangerouslySetInnerHTML={{ __html: pageData.conteudo ?? "" }}
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
