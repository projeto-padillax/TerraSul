import ConfigPageForm from "@/components/admin/configPage";
import { getConfiguracaoPagina } from "@/lib/actions/config";


export default async function SiteConfig() {
  const config = await getConfiguracaoPagina();
  
  return (
    <main className="py-12">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
              Configurações do Site
            </h1>
            <p className="text-lg text-gray-600">
              Configure as informações principais do seu site imobiliário
            </p>
          </div>
        </div>
        <ConfigPageForm defaultValues={config ?? undefined}/>
      </div>
    </main>
  );
}
