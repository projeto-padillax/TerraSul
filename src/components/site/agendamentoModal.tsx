"use client";

import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, isSaturday, isSunday, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { createFormulario } from "@/lib/actions/formularios";

const schema = z.object({
  nome: z.string().min(2, "Informe seu nome"),
  email: z.email("E-mail inválido"),
  celular: z.string().min(8, "Informe um número válido"),
  data: z.date(),
  mensagem: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

function getDiasUteis(inicio: Date, qtd: number) {
  const datas: Date[] = [];
  let d = inicio;
  while (datas.length < qtd) {
    if (!isSaturday(d) && !isSunday(d)) datas.push(d);
    d = addDays(d, 1);
  }
  return datas;
}

function labelDia(date: Date) {
  const full = format(date, "EEEE", { locale: ptBR }); 
  const semFeira = full.replace(/-feira/i, "");
  return semFeira.trim().toLocaleUpperCase("pt-BR");
}

interface AgendamentoModalProps {
  open: boolean;
  onClose: () => void;
  codigoImovel: string;
  codigoCorretor?: string;
}

export default function AgendamentoModal({ open, onClose, codigoImovel, codigoCorretor }: AgendamentoModalProps) {
  const [isPending, startTransition] = useTransition();

  const DAYS_PER_PAGE = 6; 
  const STEP = 6;            
  const MAX_AHEAD_DAYS = 21; 

  const [startOffset, setStartOffset] = useState(1);
  const datas = useMemo(
    () => getDiasUteis(addDays(new Date(), startOffset), DAYS_PER_PAGE),
    [startOffset]
  );

  const canGoBack = startOffset > 1;
  const canGoForward = startOffset + STEP <= MAX_AHEAD_DAYS;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: "",
      email: "",
      celular: "",
      data: datas[0],
      mensagem: "",
    },
  });

  const [dataSelecionada, setDataSelecionada] = useState<Date>(datas[0]);

  useEffect(() => {
    if (datas[0]) {
      setDataSelecionada(datas[0]);
      setValue("data", datas[0]);
    }
  }, [datas, setValue]);

  if (!open) return null;

  const onSubmit = (data: FormData) => {
    startTransition(async () => {
      try {
        await createFormulario({
          tipo: "VISITA",
          nome: data.nome,
          email: data.email,
          telefone: data.celular,
          urlRespondida: window.location.href,
          DataVisita: data.data,
          mensagem: data.mensagem,
          origem: "ORGANICO",
          codigoImovel,
        },codigoCorretor);

        toast.success("Agendamento enviado com sucesso!");
        reset({ nome: "", email: "", celular: "", data: datas[0], mensagem: "" });
        onClose();
      } catch (e) {
        console.error(e);
        toast.error("Erro ao enviar agendamento.");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <button onClick={onClose} className="absolute right-4 top-4">
          <X className="h-5 w-5" />
        </button>

        <h2 className="mb-4 text-center text-2xl font-extrabold">Solicitar Visita</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 lead" id="formulario_agendamento_modal">
          <div className="relative">
            <label className="pointer-events-none absolute left-3 top-1.5 text-[12px] font-semibold text-black">
              NOME
            </label>
            <input
              {...register("nome")}
              className="w-full rounded-md border border-gray-400 bg-white px-3 pt-5 pb-2 text-sm text-gray-900
                         focus:border-site-primary-hover focus:outline-none focus:ring-2 focus:ring-[#4f7dc3]/20"
            />
            {errors.nome && <p className="mt-1 text-xs text-red-500">{errors.nome.message}</p>}
          </div>

          <div className="relative">
            <label className="pointer-events-none absolute left-3 top-1.5 text-[12px] font-semibold text-black">
              E-MAIL
            </label>
            <input
              {...register("email")}
              className="w-full rounded-md border border-gray-400 bg-white px-3 pt-5 pb-2 text-sm text-gray-900
                         focus:border-site-primary-hover focus:outline-none focus:ring-2 focus:ring-[#4f7dc3]/20"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div className="relative">
            <label className="pointer-events-none absolute left-3 top-1.5 text-[12px] font-semibold text-black">
              CELULAR
            </label>
            <input
              {...register("celular")}
              className="w-full rounded-md border border-gray-400 bg-white px-3 pt-5 pb-2 text-sm text-gray-900
                         focus:border-site-primary-hover focus:outline-none focus:ring-2 focus:ring-[#4f7dc3]/20"
            />
            {errors.celular && <p className="mt-1 text-xs text-red-500">{errors.celular.message}</p>}
          </div>

          <div className="pt-1">
            <p className="text-sm font-semibold">Datas</p>
            <p className="mb-2 text-xs text-gray-500">Escolha uma das datas.</p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStartOffset((v) => Math.max(1, v - STEP))}
                className={[
                  "shrink-0 rounded-md border border-gray-400 px-2 py-2 hover:bg-gray-50",
                  canGoBack ? "" : "invisible",
                ].join(" ")}
                aria-label="Datas anteriores"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="grid flex-1 grid-cols-3 gap-2">
                {datas.map((data, idx) => {
                  const dia = labelDia(data);
                  const diaNum = format(data, "dd/MM");
                  const selecionado = dataSelecionada.toDateString() === data.toDateString();
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setDataSelecionada(data);
                        setValue("data", data);
                      }}
                      className={[
                        "min-w-[80px] rounded-md px-3 py-2 text-center text-[12px] font-semibold",
                        "border transition-colors",
                        selecionado
                          ? "bg-site-primary border-site-primary-hover text-white"
                          : "bg-white border-gray-400 text-black hover:bg-gray-50",
                      ].join(" ")}
                    >
                      <div className="leading-4">{dia}</div>
                      <div className="mt-1 text-[15px] font-semibold">{diaNum}</div>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setStartOffset((v) => Math.min(v + STEP, MAX_AHEAD_DAYS))}
                className={[
                  "shrink-0 rounded-md border border-gray-400 px-2 py-2 hover:bg-gray-50",
                  canGoForward ? "" : "invisible",
                ].join(" ")}
                aria-label="Próximas datas"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {errors.data && <p className="mt-1 text-xs text-red-500">{errors.data.message}</p>}
          </div>

          <div className="relative">
            <label className="pointer-events-none absolute left-3 top-1.5 text-[12px] font-semibold text-black">
              MENSAGEM (OPCIONAL)
            </label>
            <textarea
              {...register("mensagem")}
              className="min-h-[100px] w-full resize-none rounded-md border border-gray-400 bg-white px-3 pt-6 pb-2
                         text-sm text-gray-900 focus:border-site-primary-hover focus:outline-none focus:ring-2 focus:ring-[#4f7dc3]/20"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-md bg-site-primary py-3 font-bold text-white hover:bg-site-primary-hover disabled:opacity-70"
          >
            {isPending ? "Enviando..." : "ENVIAR"}
          </button>
        </form>
      </div>
    </div>
  );
}
