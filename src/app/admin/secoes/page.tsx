import Secoes from "@/components/admin/secoes";
import { getAllSecoes } from "@/lib/actions/secoes";

export default async function SecoesListPage() {
    const secoes = await getAllSecoes()
    
    return <Secoes secoes={secoes} />
}
