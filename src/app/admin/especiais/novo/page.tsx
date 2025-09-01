import EspecialForm from "@/components/admin/especialForm";
import { getCorretoresAtivosParaSelect } from "@/lib/actions/corretores";


export default async function NovoEspecialPage(){
    const corretores = await getCorretoresAtivosParaSelect();

    return (
        <EspecialForm corretores={corretores} />
    )
}