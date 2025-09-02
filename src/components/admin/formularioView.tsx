"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LinkIcon, MessageCircle, Phone } from "lucide-react";
import { FormularioPlain } from "@/lib/actions/formularios";


type Props = { lead: FormularioPlain };

function formatDateTime(d?: Date | string | null) {
    if (!d) return null;
    const dt = typeof d === "string" ? new Date(d) : d;
    if (Number.isNaN(dt.getTime())) return null;
    return dt.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function formatOnlyDate(d?: Date | string | null) {
    if (!d) return null;
    const dt = typeof d === "string" ? new Date(d) : d;
    if (Number.isNaN(dt.getTime())) return null;
    return dt.toLocaleDateString("pt-BR");
}

function humanizeEnum(value?: string | null) {
    if (!value) return null;
    return value
        .toString()
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/(^\w{1})|(\s+\w{1})/g, (l) => l.toUpperCase());
}

export default function FormularioView({ lead }: Props) {
    const router = useRouter();

    const infoPrincipal: { label: string; value: React.ReactNode | null }[] = [
        { label: "Data de Envio", value: formatDateTime(lead.dataEnvio) },
        { label: "Formulário", value: humanizeEnum(lead.tipo) },
        { label: "Interesse", value: humanizeEnum(lead.interesse) },
        {
            label: "Imóvel",
            value:
                lead.urlRespondida && /\/imovel\//i.test(lead.urlRespondida) ? (
                    <a
                        href={lead.urlRespondida}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline inline-flex items-center gap-1"
                        title={lead.urlRespondida}
                    >
                        Abrir link <LinkIcon className="h-4 w-4" />
                    </a>
                ) : lead.codigoImovel
                    ? `Código ${lead.codigoImovel}`
                    : null,
        },
        { label: "Origem", value: humanizeEnum(lead.origem) },
    ];

    // EXTRAS (agora vem logo após PRINCIPAIS)
    const extras: { label: string; value: React.ReactNode | null }[] = [
        { label: "Turno da Visita", value: lead.turnoVisita || null },
        { label: "Data da Visita", value: formatOnlyDate(lead.DataVisita) },
        { label: "Condomínio", value: lead.condominio || null },
        { label: "Assunto", value: lead.assunto || null },
        { label: "Valor Desejado", value: lead.valorDesejado?.toString() || null },
    ];

    // CONTATO (agora depois dos EXTRAS)
    const contato: { label: string; value: React.ReactNode | null }[] = [
        { label: "Nome", value: lead.nome || null },
        { label: "E-mail", value: lead.email || null },
        { label: "Telefone", value: lead.telefone || null },
    ];

    return (
        <main className="py-12">
            <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10">
                {/* Header */}
                <div className="mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
                        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                            Visualizar Lead
                        </h1>
                        <p className="text-lg text-gray-600">
                            Visualize as informações recebidas do formulário.
                        </p>
                    </div>
                </div>

                <Card className="border border-gray-200 rounded-xl shadow-sm bg-white">
                    <CardContent className="p-8 space-y-6">
                        {/* PRINCIPAIS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                            {[...infoPrincipal, ...extras]
                                .filter((row) => row.value)
                                .map((row) => (
                                    <div key={row.label} className="flex gap-2">
                                        <span className="font-semibold text-gray-800">{row.label}:</span>
                                        <span className="text-gray-900">{row.value}</span>
                                    </div>
                                ))}
                        </div>

                        {/* CONTATO */}
                        {contato.some((c) => c.value) && (
                            <>
                                <div className="border-t border-gray-200 my-2" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                                    {contato
                                        .filter((row) => row.value)
                                        .map((row) => (
                                            <div key={row.label} className="flex gap-2 items-center">
                                                <span className="font-semibold text-gray-800">{row.label}:</span>

                                                {row.label === "Telefone" ? (
                                                    <span className="text-gray-900 flex items-center gap-2">
                                                        {row.value}
                                                        {/* Ligar */}
                                                        <a
                                                            href={`tel:${String(lead.telefone)}`}
                                                            className="text-blue-600 hover:text-blue-800"
                                                            title="Ligar"
                                                        >
                                                            <Phone className="h-4 w-4" />
                                                        </a>
                                                        {/* WhatsApp */}
                                                        <a
                                                            href={`https://wa.me/${String(lead.telefone).replace(/\D/g, "")}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-green-600 hover:text-green-800"
                                                            title="WhatsApp"
                                                        >
                                                            <MessageCircle className="h-4 w-4" />
                                                        </a>
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-900">{row.value}</span>
                                                )}
                                            </div>
                                        ))}
                                </div>
                            </>
                        )}

                        {lead.mensagem && (
                            <>
                                <div className="pt-2">
                                    <div className="font-semibold text-gray-800 mb-1">Mensagem:</div>
                                    <p className="text-gray-900 whitespace-pre-wrap">{lead.mensagem}</p>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                <div className="flex justify-start mt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/admin/leads")}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Voltar
                    </Button>
                </div>
            </div>
        </main>
    );
}
