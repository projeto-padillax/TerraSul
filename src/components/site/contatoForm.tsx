"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { toast } from "sonner";
import { SendHorizonal } from "lucide-react";
import { createFormulario } from "@/lib/actions/formularios";

const schema = z.object({
  nome: z.string().min(1, "Informe seu nome"),
  email: z.email("Email inválido"),
  telefone: z.string().min(8, "Informe um telefone válido"),
  assunto: z.string().min(1, "Informe o assunto"),
  mensagem: z.string().min(5, "Escreva sua mensagem"),
});

type FormData = z.infer<typeof schema>;

export default function ContatoForm() {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    startTransition(async () => {
      try {
        await createFormulario({
          tipo: "CONTATO",
          nome: data.nome,
          email: data.email,
          telefone: data.telefone,
          assunto: data.assunto,
          mensagem: data.mensagem,
          urlRespondida:
            typeof window !== "undefined" ? window.location.href : "",
        });

        toast.success("Mensagem enviada com sucesso!");
        reset({ nome: "", email: "", telefone: "", assunto: "", mensagem: "" });
      } catch (err) {
        console.error(err);
        toast.error("Erro ao enviar mensagem.");
      }
    });
  };

  const baseInput =
    "w-full bg-transparent outline-none border-0 focus:ring-0 placeholder:text-[#9aa2b1] text-[15px]";
  const cell = "p-2 md:p-3";
  const label =
    "block text-[11px] font-semibold tracking-wide text-gray-800 uppercase mb-1";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="text-sm">
      <div className="rounded-lg border border-gray-500 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-500">
          <div className={cell}>
            <label className={label}>Nome</label>
            <input {...register("nome")} className={baseInput} />
            {errors.nome && (
              <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>
            )}
          </div>

          <div className={cell}>
            <label className={label}>E-mail</label>
            <input {...register("email")} className={baseInput} />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className={cell}>
            <label className={label}>Telefone</label>
            <input
              {...register("telefone", {
                onChange: (e) => {
                  let value = e.target.value.replace(/\D/g, ""); // remove tudo que não for número
                  if (value.length > 11) value = value.slice(0, 11); // limita a 11 dígitos

                  if (value.length > 6) {
                    value = value.replace(
                      /(\d{2})(\d{5})(\d{0,4})/,
                      "($1) $2-$3"
                    );
                  } else if (value.length > 2) {
                    value = value.replace(/(\d{2})(\d{0,5})/, "($1) $2");
                  } else {
                    value = value.replace(/(\d*)/, "($1");
                  }

                  e.target.value = value;
                },
              })}
              placeholder="(99) 99999-9999"
              className={baseInput}
            />
            {errors.telefone && (
              <p className="text-red-500 text-xs mt-1">
                {errors.telefone.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-500 border-t border-gray-500">
          <div className={`md:col-span-3 ${cell}`}>
            <label className={label}>Assunto</label>
            <input {...register("assunto")} className={baseInput} />
            {errors.assunto && (
              <p className="text-red-500 text-xs mt-1">
                {errors.assunto.message}
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-gray-500">
          <div className={cell}>
            <label className={label}>Mensagem</label>
            <textarea
              {...register("mensagem")}
              className={`${baseInput} resize-none min-h-[96px]`}
            />
            {errors.mensagem && (
              <p className="text-red-500 text-xs mt-1">
                {errors.mensagem.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <p className="text-xs text-[#6b7280]">
          Ao continuar, você está de acordo com os{" "}
          <span className="underline">Termos de Uso</span> e ciente do
          <span className="underline"> Aviso de Privacidade</span>.
        </p>

        <button
          type="submit"
          id="form_contato"
          disabled={isPending}
          className="inline-flex items-center cursor-pointer gap-3 px-6 py-3 rounded-md bg-site-primary hover:bg-site-primary-hover cursor-pointer text-white font-medium transition"
        >
          {isPending ? (
            <div className="h-4 w-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <>
              Enviar
              <SendHorizonal size={18} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
