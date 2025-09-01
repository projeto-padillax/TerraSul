import SecaoForm from "@/components/admin/secaoForm";
import { getSecao } from "@/lib/actions/secoes";
import { notFound } from "next/navigation";

interface EditSecoesPage {
  params: Promise<{ id: string }>;
}

export default async function EditSecoesPage({
  params,
}: EditSecoesPage) {
  const secoesId = (await params).id;
  const secao = await getSecao(parseInt(secoesId));

  if (!secao) {
    return notFound();
  }

  return (
    <main className="py-12">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
              Edição de Seção do Site e SEO
            </h1>
            <p className="text-lg text-gray-600">
              Edite as informações das seções do site para auxiliar na indexação de mecanismos de pesquisa e SEO.
            </p>
          </div>
        </div>
        <SecaoForm secao={secao} mode="edit" />
      </div>
    </main>
  );
}