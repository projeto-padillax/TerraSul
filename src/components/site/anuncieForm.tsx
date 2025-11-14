"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createFormulario } from "@/lib/actions/formularios";
import { SendHorizonal } from "lucide-react";

const schema = z.object({
    nome: z.string().min(1, "Informe seu nome"),
    email: z.email("Email inválido"),
    telefone: z.string().min(8, "Informe um número válido"),
    endereco: z.string().min(3, "Informe o endereço"),
    bairro: z.string().min(1, "Informe o bairro"),
    cidade: z.string().min(1, "Informe a cidade"),
    valorDesejado: z
        .number("Insira o valor desejado")
        .positive("Número deve ser positivo"),
    descricao: z.string().min(5, "Descreva brevemente o imóvel"),
});

type FormData = z.infer<typeof schema>;

export default function AnuncieForm() {
    const [isPending, startTransition] = useTransition();

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = (data: FormData) => {
        startTransition(async () => {
            try {
                await createFormulario({
                    tipo: "ANUNCIEIMOVEL",
                    nome: data.nome,
                    email: data.email,
                    telefone: data.telefone,
                    mensagem: data.descricao,
                    urlRespondida: typeof window !== "undefined" ? window.location.href : "",
                    valorDesejado: data.valorDesejado,
                });

                toast.success("Enviado com sucesso! Em breve entraremos em contato.");
                reset();
            } catch (e) {
                console.error(e);
                toast.error("Não foi possível enviar. Tente novamente.");
            }
        });
    };

    const baseInput =
        "w-full bg-transparent outline-none border-0 focus:ring-0 placeholder:text-[#9aa2b1] text-[16px]";
    const cell =
        "p-3 md:p-2";
    const label =
        "block text-[11px] font-semibold tracking-wide text-[#111] uppercase mb-1";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="text-sm lead" id="formulario_anuncie_imovel">
            <div className="rounded-lg border border-gray-500 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-500">
                    <div className={cell}>
                        <label className={label}>Nome</label>
                        <input {...register("nome")} className={baseInput} />
                        {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
                    </div>

                    <div className={cell}>
                        <label className={label}>E-mail</label>
                        <input {...register("email")} className={baseInput} />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    <div className={cell}>
                        <label className={label}>Telefone</label>
                        <input {...register("telefone")} className={baseInput} />
                        {errors.telefone && <p className="text-red-500 text-xs mt-1">{errors.telefone.message}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-500 border-t border-gray-500">
                    <div className={cell}>
                        <label className={label}>Endereço</label>
                        <input {...register("endereco")} className={baseInput} />
                        {errors.endereco && <p className="text-red-500 text-xs mt-1">{errors.endereco.message}</p>}
                    </div>

                    <div className={cell}>
                        <label className={label}>Cidade</label>
                        <input {...register("cidade")} className={baseInput} />
                        {errors.cidade && <p className="text-red-500 text-xs mt-1">{errors.cidade.message}</p>}
                    </div>

                    <div className={cell}>
                        <label className={label}>Bairro</label>
                        <input {...register("bairro")} className={baseInput} />
                        {errors.bairro && <p className="text-red-500 text-xs mt-1">{errors.bairro.message}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-500 border-t border-gray-500">
                    <div className={cell}>
                        <label className={label}>Valor desejado</label>
                        <div className="flex items-center gap-2">
                            <span className="text-[#6b7280] text-sm">R$</span>
                            <input
                                type="number"
                                {...register("valorDesejado", { valueAsNumber: true })}
                                className={baseInput}
                            />
                        </div>
                        {errors.valorDesejado && (
                            <p className="text-red-500 text-xs mt-1">{errors.valorDesejado.message?.toString()}</p>
                        )}
                    </div>
                </div>

                <div className="border-t border-gray-500">
                    <div className={cell}>
                        <label className={label}>Detalhe o seu imóvel brevemente</label>
                        <textarea
                            {...register("descricao")}
                            className={`${baseInput} resize-none min-h-[80px]`}
                        />
                        {errors.descricao && <p className="text-red-500 text-xs mt-1">{errors.descricao.message}</p>}
                    </div>
                </div>
            </div>

            <div className="mt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-12">
                <p className="text-xs text-[#6b7280]">
                    Ao continuar, você está de acordo com os <span className="underline">Termos de Uso</span> e ciente da
                    <span className="underline"> Aviso de Privacidade</span>.
                </p>

                <button
                    type="submit"
                    id="form_anuncie"
                    disabled={isPending}
                    className="inline-flex items-center gap-3 px-10 py-3 rounded-md bg-site-primary hover:bg-site-primary-hover cursor-pointer text-white font-medium transition"
                >
                    {isPending ? "Enviando..." : "Enviar"}
                    <SendHorizonal size={18} />
                </button>
            </div>  
        </form>
    );
}
