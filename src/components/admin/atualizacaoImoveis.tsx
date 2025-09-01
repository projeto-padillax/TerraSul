'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

const schema = z.object({
    codigo: z.string().min(1, 'Informe o código do imóvel'),
})

export default function AtualizacaoImoveis() {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            codigo: '',
        },
    })

    function onSubmit(data: { codigo: string }) {
        startTransition(async () => {
            try {
                const res = await fetch(`/api/vista/imoveis/${data.codigo}`, {
                    method: 'PUT',
                })

                const json = await res.json()

                if (!res.ok) {
                    toast.error(json.message || 'Erro ao atualizar imóvel')
                    return
                }

                toast.success(json.message || 'Imóvel atualizado com sucesso!')
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Erro inesperado'
                toast.error(errorMessage)
            }
        })
    }

    return (
        <div className="flex flex-col items-start max-w-4xl mx-auto mt-10">
            {/* Card */}
            <div className="w-full px-10 py-8 border rounded-xl shadow-sm bg-white">
                <div className="mb-6 space-y-2 text-sm text-gray-700">
                    <p className="font-semibold">Instruções:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>
                            Preencha o código do imóvel no JetImob para que ele seja atualizado.
                        </li>
                        <li>Caso o imóvel ainda não esteja cadastrado no site, ele será importado.</li>
                        <li>Caso ele já exista, será atualizado.</li>
                        <li>
                            Caso já tenha sido removido do Vista, será excluído do site.
                        </li>
                    </ul>
                    <p className="italic text-gray-500 mt-2">
                        O processo de consulta e atualização pode levar alguns instantes.
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="codigo"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-2">
                                    <Label className="text-gray-900 font-medium text-base w-20">
                                        Código:
                                    </Label>
                                    <FormControl>
                                        <Input placeholder="Ex: 21970" {...field} className="w-60" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'Atualizando...' : 'Atualizar'}
                        </Button>
                    </form>
                </Form>
            </div>

            {/* Botão de voltar */}
            <div className="flex justify-start mt-6">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/admin/leads')}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar
                </Button>
            </div>
        </div>
    )
}
