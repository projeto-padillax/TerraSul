"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Save, ArrowLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"

import { Corretor as CorretorORM } from "@prisma/client"
import { createCorretor, updateCorretor } from "@/lib/actions/corretores"

import z from "zod"
import { CorretorFormFields } from "./corretorFormField"
import { useTransition } from "react"

const corretorSchema = z.object({
    status: z.boolean(),
    name: z.string().min(1, "Nome é obrigatório."),
    email: z.email("Email inválido."),
    telefone: z.string().min(8, "Telefone é obrigatório."),
    CRECI: z.string().min(1, "CRECI é obrigatório."),
})

export type CorretorInput = z.infer<typeof corretorSchema>

type CorretorFormProps = {
    corretor?: CorretorORM
}

export default function CorretorForm({ corretor }: CorretorFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition();

    const isEditing = Boolean(corretor);
    const pageTitle = isEditing ? "Editar Corretor" : "Novo Corretor";
    const pageSubtitle = isEditing
        ? `Edite as informações do corretor ${corretor?.name}`
        : "Crie um novo corretor";

    const form = useForm<CorretorInput>({
        resolver: zodResolver(corretorSchema),
        defaultValues: {
            status: corretor?.status ?? true,
            name: corretor?.name ?? "",
            email: corretor?.email ?? "",
            telefone: corretor?.telefone ?? "",
            CRECI: corretor?.CRECI ?? "",
        },
    })

    const onSubmit = (values: CorretorInput) => {
        startTransition(async () => {
            try {
                if (isEditing) {
                    await updateCorretor({
                        ...values,
                        id: corretor!.id,
                    });
                    toast.success("Corretor editado com sucesso!");
                } else {
                    await createCorretor(values);
                    toast.success("Corretor criado com sucesso!");
                }

                router.push("/admin/corretores");
            } catch (error) {
                console.error(error);
                const errorMessage = error instanceof Error
                    ? error.message
                    : `Erro ao ${isEditing ? 'editar' : 'criar'} corretor`;
                toast.error(errorMessage);
            }
        });
    };

    const handleBack = () => {
        router.push("/admin/corretores");
    };

    return (
        <main className="py-12">
            <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10">
                <div className="mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
                        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                            {pageTitle}
                        </h1>
                        <p className="text-lg text-gray-600">
                            {pageSubtitle}
                        </p>
                    </div>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <Card>
                            <CardContent className="p-8 space-y-8">
                                <CorretorFormFields form={form} />
                            </CardContent>
                        </Card>

                        <Card className="border border-gray-200 rounded-xl shadow-sm bg-white mt-6">
                            <CardContent className="p-6">
                                <div className="flex gap-4">
                                    <Button
                                        type="submit"
                                        size="lg"
                                        disabled={isPending}
                                    >
                                        {isPending ? (
                                            <>
                                                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                {isEditing ? "Salvando..." : "Criando..."}
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4 mr-2" />
                                                {isEditing ? "Salvar" : "Criar"}
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleBack}
                                        size="lg"
                                        disabled={isPending}
                                    >
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Voltar
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </form>
                </Form>
            </div>
        </main >

    )
}
