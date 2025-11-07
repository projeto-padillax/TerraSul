'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { createFormulario } from '@/lib/actions/formularios'

const schema = z.object({
    nome: z.string().min(1, 'Informe seu nome'),
    celular: z.string().min(8, 'Informe um telefone válido'),
    email: z.email('Email inválido'),
    mensagem: z.string().min(5),
})

interface MaisInformacoesFormProps {
    codigoImovel: string
    codigoCorretor?: string;
}

type FormData = z.infer<typeof schema>

export default function MaisInformacoesForm({ codigoImovel, codigoCorretor }: MaisInformacoesFormProps) {
    const [isPending, startTransition] = useTransition()

    const defaultMsg = `Gostaria de mais detalhes sobre o imóvel código ${codigoImovel}. Aguardo.`

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { mensagem: defaultMsg },
    })

    const onSubmit = (data: FormData) => {
        startTransition(async () => {
            try {
                await createFormulario({
                    tipo: 'INFORMACOES',
                    nome: data.nome,
                    email: data.email,
                    telefone: data.celular,
                    mensagem: data.mensagem,
                    codigoImovel,
                    urlRespondida: typeof window !== 'undefined' ? window.location.href : '',
                }, codigoCorretor)
                toast.success('Mensagem enviada com sucesso!')
                reset({ nome: '', celular: '', email: '', mensagem: defaultMsg })
            } catch (e) {
                console.error(e)
                toast.error('Erro ao enviar mensagem.')
            }
        })
    }

    const baseInput =
        'w-full bg-transparent outline-none border-0 focus:ring-0 placeholder:text-[#9aa2b1] text-sm text-gray-900'
    const cell = 'p-4 sm:p-2'
    const label = 'block text-[11px] font-semibold tracking-wide text-][#303030] uppercase mb-1'

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="text-sm">
            <div className="rounded-md border border-gray-400 overflow-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-400">
                    <div className={cell}>
                        <label className={label}>Nome</label>
                        <input {...register('nome')} className={baseInput} />
                        {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
                    </div>

                    <div className={cell}>
                        <label className={label}>Celular</label>
                        <input
                            {...register('celular')}
                            className={baseInput}
                        />
                        {errors.celular && <p className="text-red-500 text-xs mt-1">{errors.celular.message}</p>}
                    </div>
                </div>

                <div className="border-t border-gray-400">
                    <div className={cell}>
                        <label className={label}>E-mail</label>
                        <input {...register('email')} className={baseInput} />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                </div>

                <div className="border-t border-gray-400">
                    <div className={cell}>
                        <textarea
                            {...register('mensagem')}
                            className={`${baseInput} resize-none min-h-[50px]`}
                        />
                        {errors.mensagem && (
                            <p className="text-red-500 text-xs mt-1">{errors.mensagem.message}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Botão */}
            <button
                type="submit"
                disabled={isPending}
                aria-label="enviar_agendar"
                className="mt-3 w-full cursor-pointer bg-site-primary hover:bg-site-primary-hover text-white font-medium text-sm py-3 px-4 rounded-xl flex items-center gap-2 justify-center transition"
            >
                {isPending ? (
                    <div className="h-4 w-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
                ) : (
                    <>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            className="opacity-70 w-[20px] h-[20px] sm:w-[20px] sm:h-[20px]"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M10.4214 19.447C10.3964 19.447 10.3724 19.447 10.3474 19.447C10.3124 19.436 10.2794 19.419 10.2434 19.416C9.67339 19.374 9.22039 19.108 8.87439 18.667C8.44739 18.125 8.0334 17.572 7.6294 17.013C7.4884 16.817 7.33339 16.735 7.09039 16.739C6.19539 16.76 5.30339 16.715 4.42539 16.52C3.02639 16.213 1.99639 15.45 1.45239 14.092C1.07739 13.154 0.966394 12.17 0.957394 11.174C0.943394 9.54102 0.944394 7.90702 0.957394 6.27402C0.961394 5.82002 1.00139 5.36202 1.07139 4.91402C1.25339 3.75902 1.69639 2.72602 2.56839 1.91102C3.36739 1.16402 4.33939 0.792017 5.40139 0.621017C5.69239 0.575017 5.98539 0.545019 6.27739 0.507019C9.02739 0.507019 11.7774 0.507019 14.5274 0.507019C14.5874 0.520019 14.6464 0.535013 14.7054 0.546013C15.2024 0.632013 15.7114 0.675012 16.1934 0.812012C17.7044 1.23801 18.7794 2.17302 19.3584 3.64902C19.6754 4.45702 19.8054 5.30202 19.8114 6.16402C19.8224 7.76602 19.8324 9.36902 19.8074 10.971C19.7984 11.56 19.7394 12.158 19.6144 12.731C19.2134 14.575 18.1334 15.835 16.3064 16.412C15.4804 16.673 14.6304 16.762 13.7704 16.739C13.4554 16.73 13.2594 16.833 13.0824 17.089C12.7364 17.591 12.3564 18.069 11.9904 18.558C11.7014 18.944 11.3424 19.234 10.8714 19.362C10.7244 19.399 10.5714 19.417 10.4214 19.447ZM10.3834 1.83302C10.3834 1.82702 10.3834 1.82102 10.3834 1.81502C9.26139 1.81502 8.13839 1.81302 7.01739 1.81602C6.32639 1.81802 5.63939 1.86202 4.96839 2.05602C3.95639 2.34902 3.1794 2.92702 2.7334 3.89902C2.4354 4.54602 2.29339 5.23602 2.28439 5.94302C2.26439 7.62002 2.26539 9.29701 2.27139 10.973C2.27339 11.415 2.30739 11.862 2.35639 12.301C2.42739 12.929 2.58239 13.538 2.92239 14.082C3.36239 14.788 4.05939 15.098 4.83239 15.264C5.62039 15.434 6.42439 15.433 7.22539 15.43C7.79439 15.427 8.25039 15.658 8.59339 16.11C8.82739 16.422 9.05839 16.733 9.29239 17.044C9.49739 17.315 9.69239 17.593 9.91039 17.852C10.2144 18.215 10.5484 18.207 10.8644 17.851C10.9014 17.81 10.9354 17.767 10.9684 17.722C11.3344 17.234 11.7154 16.756 12.0624 16.255C12.4664 15.672 12.9964 15.394 13.7094 15.425C14.4074 15.452 15.1024 15.387 15.7774 15.192C16.6204 14.951 17.3334 14.519 17.8084 13.754C18.2704 13.009 18.4654 12.182 18.4814 11.323C18.5114 9.70301 18.5004 8.08101 18.5014 6.45901C18.5024 5.77901 18.4384 5.10601 18.2414 4.45001C17.9584 3.50701 17.4124 2.77801 16.5204 2.33501C15.8464 2.00101 15.1224 1.84801 14.3764 1.83701C13.0464 1.82101 11.7144 1.83302 10.3834 1.83302Z"
                                fill="white"
                            />

                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M13.9172 8.19004C14.4012 8.20204 14.7862 8.59704 14.7782 9.07104C14.7702 9.56604 14.3652 9.94903 13.8652 9.93603C13.3792 9.92403 12.9982 9.51704 13.0162 9.02804C13.0342 8.55204 13.4352 8.17804 13.9172 8.19004Z"
                                fill="white"
                            />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M6.89906 8.19002C7.38906 8.20502 7.77006 8.61002 7.75106 9.09502C7.73106 9.58302 7.32906 9.95201 6.83406 9.93601C6.35106 9.92001 5.97006 9.50802 5.99106 9.02102C6.00906 8.54802 6.41606 8.17602 6.89906 8.19002Z"
                                fill="white"
                            />

                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M10.376 9.93801C9.88698 9.93501 9.49798 9.539 9.50198 9.052C9.50698 8.576 9.89899 8.191 10.381 8.19C10.869 8.189 11.269 8.586 11.264 9.067C11.26 9.555 10.865 9.94101 10.376 9.93801Z"
                                fill="white"
                            />

                        </svg>
                        Enviar mensagem
                    </>
                )}
            </button>
        </form>

    )
}
