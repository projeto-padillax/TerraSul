import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Power, PowerOff, Trash2 } from "lucide-react"

interface ActionButtonsProps {
    addButtonText: string
    addButtonHref: string
    onAtivar: () => void
    onDesativar: () => void
    onExcluir: () => void
}

export function ActionButtons({
    addButtonText,
    addButtonHref,
    onAtivar,
    onDesativar,
    onExcluir,
}: ActionButtonsProps) {
    return (
        <div className="mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex flex-wrap gap-3">
                    <Link href={addButtonHref}>
                        <Button
                            size="lg"
                            className="bg-blue-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg shadow-sm transition-colors duration-200 cursor-pointer"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            {addButtonText}
                        </Button>
                    </Link>

                    <Button
                        size="lg"
                        variant="outline"
                        onClick={onAtivar}
                        className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 px-6 py-3 rounded-lg transition-colors duration-200 bg-transparent cursor-pointer"
                    >
                        <Power className="h-4 w-4 mr-2" />
                        Ativar
                    </Button>

                    <Button
                        size="lg"
                        variant="outline"
                        onClick={onDesativar}
                        className="border-amber-300 text-amber-700 hover:bg-amber-50 px-6 py-3 rounded-lg transition-colors duration-200 bg-transparent cursor-pointer"
                    >
                        <PowerOff className="h-4 w-4 mr-2" />
                        Desativar
                    </Button>

                    <Button
                        size="lg"
                        variant="outline"
                        onClick={onExcluir}
                        className="border-red-300 text-red-700 hover:bg-red-50 px-6 py-3 rounded-lg transition-colors duration-200 bg-transparent cursor-pointer"
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                    </Button>
                </div>
            </div>
        </div>
    )
}