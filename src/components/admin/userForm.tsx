"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Save, ArrowLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"

import { User as UserORM } from "@prisma/client"
import { createUser, updateUser } from "@/lib/actions/users"

import z from "zod"
import { UserFormFields } from "./userFormField"
import { useTransition } from "react"

const userSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório."),
    email: z
        .string().check(z.email()).refine((email) => email.toLowerCase().endsWith(".com") || email.endsWith(".br"), {
            message: "Email invalido",
        }),
    telefone: z.string().min(8, "Telefone é obrigatório."),
    status: z.boolean(),
    perfil: z.enum(["ADMIN", "CORRETOR", "SUPERADMIN"], {
        message: "Perfil deve ser ADMIN, CORRETOR ou SUPERADMIN.",
    }),
    login: z.string().min(1, "Login é obrigatório.").max(11, "Login deve ter no máximo 11 caracteres."),
    senha: z.string().min(6, "Senha deve ter ao menos 6 caracteres."),
})

export type UserInput = z.infer<typeof userSchema>

type UserFormProps = {
    user?: UserORM
}

export default function UserForm({ user }: UserFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition();

    const isEditing = Boolean(user);
    const pageTitle = isEditing ? "Editar User" : "Novo User";
    const pageSubtitle = isEditing
        ? `Edite as informações do user ${user?.name}`
        : "Crie um novo user";

    const form = useForm<UserInput>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            status: user?.status ?? true,
            name: user?.name ?? "",
            email: user?.email ?? "",
            telefone: user?.telefone ?? "",
            perfil: user?.perfil ?? "ADMIN",
            login: user?.login ?? "",
            senha: user?.senha ?? "",
        },
    })

    const onSubmit = (values: UserInput) => {
        startTransition(async () => {
            try {
                if (isEditing) {
                    await updateUser({
                        ...values,
                        id: user!.id,
                    });
                    toast.success("User editado com sucesso!");
                } else {
                    await createUser(values);
                    toast.success("User criado com sucesso!");
                }

                router.push("/admin/usuarios");
            } catch (error) {
                console.error(error);
                const errorMessage = error instanceof Error
                    ? error.message
                    : `Erro ao ${isEditing ? 'editar' : 'criar'} usuário`;
                toast.error(errorMessage);
            }
        });
    };

    const handleBack = () => {
        router.push("/admin/usuarios");
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
                                <UserFormFields form={form} />
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
