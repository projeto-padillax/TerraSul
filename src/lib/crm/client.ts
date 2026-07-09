const CRM_WEBHOOK_URL =
  process.env.TERRASUL_WEBHOOK_URL ?? "";

// ---------------------------------------------------------------------------
// Tipos do payload (por formulário/source)
// ---------------------------------------------------------------------------

export type CrmSource =
  | "whatsapp_btn"
  | "mais_info"
  | "contato"
  | "solicitar_visita"
  | "simular_financiamento";

interface CrmLeadBase {
  submission_id: string;
  name: string;
  phone: string;
  email: string;
}

export interface WhatsappLead extends CrmLeadBase {
  source: "whatsapp_btn";
  property_code?: string;
}

export interface MaisInfoLead extends CrmLeadBase {
  source: "mais_info";
  property_code: string;
}

export interface ContatoLead extends CrmLeadBase {
  source: "contato";
  subject: string;
  message: string;
}

export interface SolicitarVisitaLead extends CrmLeadBase {
  source: "solicitar_visita";
  property_code: string;
  preferred_date: string; // YYYY-MM-DD
  message?: string;
}

export interface SimularFinanciamentoLead extends CrmLeadBase {
  source: "simular_financiamento";
  property_code: string;
  property_price: string;
  entry_value: string;
  message?: string;
}

export type CrmLead =
  | WhatsappLead
  | MaisInfoLead
  | ContatoLead
  | SolicitarVisitaLead
  | SimularFinanciamentoLead;

// ---------------------------------------------------------------------------
// Configuração de confiabilidade
// ---------------------------------------------------------------------------

const MAX_ATTEMPTS = 5;
const BASE_DELAY_MS = 1000; // 1s, 2s, 4s, 8s, 16s (+ jitter)
const REQUEST_TIMEOUT_MS = 8000;

// ---------------------------------------------------------------------------
// Normalização / validação
// ---------------------------------------------------------------------------

/**
 * Normaliza um telefone brasileiro para E.164 (+55DDDNÚMERO).
 * Aceita formatos locais como "(51)99999-9999", "51 99999-9999", etc.
 * Lança erro se não for possível normalizar.
 */
export function normalizePhoneE164(raw: string): string {
  if (!raw) throw new Error("phone vazio");

  let digits = raw.replace(/\D+/g, "");

  // Remove prefixo internacional "00"
  if (digits.startsWith("00")) digits = digits.slice(2);

  // Já veio com código do país (55) + 10/11 dígitos
  if (digits.startsWith("55") && (digits.length === 12 || digits.length === 13)) {
    return `+${digits}`;
  }

  // Número local com DDD (10 = fixo, 11 = celular)
  if (digits.length === 10 || digits.length === 11) {
    return `+55${digits}`;
  }

  throw new Error(`phone em formato inesperado (${digits.length} dígitos)`);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

class CrmValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CrmValidationError";
  }
}

/**
 * Valida o lead no lado do site (não confiar só no 400 do CRM) e devolve
 * um payload limpo, pronto para envio, com o telefone normalizado para E.164.
 */
function buildPayload(lead: CrmLead): Record<string, unknown> {
  const errors: string[] = [];

  if (
    ![
      "whatsapp_btn",
      "mais_info",
      "contato",
      "solicitar_visita",
      "simular_financiamento",
    ].includes(lead.source)
  ) {
    errors.push("source inválido");
  }
  if (!lead.submission_id?.trim()) errors.push("submission_id ausente");
  if (!lead.name?.trim()) errors.push("name ausente");
  if (!lead.phone?.trim()) errors.push("phone ausente");
  if (!lead.email?.trim()) errors.push("email ausente");
  else if (!EMAIL_RE.test(lead.email)) errors.push("email inválido");

  let phoneE164 = "";
  if (lead.phone?.trim()) {
    try {
      phoneE164 = normalizePhoneE164(lead.phone);
    } catch (e) {
      errors.push(`phone: ${(e as Error).message}`);
    }
  }

  const payload: Record<string, unknown> = {
    source: lead.source,
    submission_id: lead.submission_id,
    name: lead.name,
    phone: phoneE164,
    email: lead.email,
  };

  switch (lead.source) {
    case "mais_info":
      if (!lead.property_code?.trim()) errors.push("property_code obrigatório em mais_info");
      payload.property_code = lead.property_code;
      break;
    case "whatsapp_btn":
      // opcional: só inclui quando presente (botão dentro da página do imóvel)
      if (lead.property_code?.trim()) payload.property_code = lead.property_code;
      break;
    case "contato":
      if (!lead.subject?.trim()) errors.push("subject obrigatório em contato");
      if (!lead.message?.trim()) errors.push("message obrigatório em contato");
      payload.subject = lead.subject;
      payload.message = lead.message;
      break;
    case "solicitar_visita":
      if (!lead.property_code?.trim())
        errors.push("property_code obrigatório em solicitar_visita");
      if (!lead.preferred_date?.trim())
        errors.push("preferred_date obrigatório em solicitar_visita");
      else if (!/^\d{4}-\d{2}-\d{2}$/.test(lead.preferred_date))
        errors.push("preferred_date deve estar em YYYY-MM-DD");
      payload.property_code = lead.property_code;
      payload.preferred_date = lead.preferred_date;
      // message é opcional: só inclui quando presente
      if (lead.message?.trim()) payload.message = lead.message;
      break;
    case "simular_financiamento":
      if (!lead.property_code?.trim())
        errors.push("property_code obrigatório em simular_financiamento");
      if (!lead.property_price?.trim())
        errors.push("property_price obrigatório em simular_financiamento");
      if (!lead.entry_value?.trim())
        errors.push("entry_value obrigatório em simular_financiamento");
      payload.property_code = lead.property_code;
      payload.property_price = lead.property_price;
      payload.entry_value = lead.entry_value;
      // message é opcional: só inclui quando presente
      if (lead.message?.trim()) payload.message = lead.message;
      break;
  }

  if (errors.length > 0) {
    throw new CrmValidationError(errors.join("; "));
  }

  return payload;
}

// ---------------------------------------------------------------------------
// Logging com mascaramento de PII (nunca logar secret/PII em claro)
// ---------------------------------------------------------------------------

function maskEmail(email?: string): string {
  if (!email) return "";
  const [user, domain] = email.split("@");
  if (!domain) return "***";
  const head = user.slice(0, 2);
  return `${head}${"*".repeat(Math.max(user.length - 2, 1))}@${domain}`;
}

function maskPhone(phone?: string): string {
  if (!phone) return "";
  const digits = phone.replace(/\D+/g, "");
  if (digits.length <= 4) return "***";
  return `***${digits.slice(-4)}`;
}

/** Versão segura do payload para logs (sem PII em claro, sem secret). */
function safeLogPayload(p: Record<string, unknown>): Record<string, unknown> {
  return {
    ...p,
    phone: maskPhone(p.phone as string | undefined),
    email: maskEmail(p.email as string | undefined),
  };
}

// ---------------------------------------------------------------------------
// Envio
// ---------------------------------------------------------------------------

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Backoff exponencial com jitter: ~1s, 2s, 4s, 8s... +/- aleatório. */
function backoffDelay(attempt: number): number {
  const exp = BASE_DELAY_MS * 2 ** (attempt - 1);
  const jitter = Math.random() * BASE_DELAY_MS;
  return exp + jitter;
}

/**
 * Encaminha um lead ao CRM. Persistência local deve ter ocorrido ANTES (o
 * submission_id é a chave de idempotência). Não lança — sempre resolve;
 * falhas são logadas. Pensado para ser chamado de forma assíncrona (after()).
 */
export async function sendLeadToCrm(lead: CrmLead): Promise<void> {
  const secret = process.env.TERRASUL_WEBHOOK_SECRET;
  if (!secret) {
    // Config quebrada: não dá para enviar. Alertar e não retentar.
    console.error(
      "[crm][ALERT] TERRASUL_WEBHOOK_SECRET ausente — lead não enviado",
      { submission_id: lead.submission_id, source: lead.source }
    );
    return;
  }

  let payload: Record<string, unknown>;
  try {
    payload = buildPayload(lead);
  } catch (e) {
    if (e instanceof CrmValidationError) {
      // Validação local falhou: não chamar o CRM, registrar localmente.
      console.error("[crm] validação local falhou — não enviado", {
        submission_id: lead.submission_id,
        source: lead.source,
        errors: e.message,
      });
      return;
    }
    throw e;
  }

  const body = JSON.stringify(payload);

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const res = await fetch(CRM_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Webhook-Secret": secret,
        },
        body,
        signal: controller.signal,
      });

      if (res.status === 202) {
        console.log("[crm] lead enviado (202)", {
          submission_id: lead.submission_id,
          source: lead.source,
        });
        return;
      }

      if (res.status === 400 || res.status === 401) {
        // Erro permanente — NÃO retentar. Alertar (é bug/config nosso).
        console.error(`[crm][ALERT] erro permanente ${res.status} — não retentar`, {
          submission_id: lead.submission_id,
          payload: safeLogPayload(payload),
        });
        return;
      }

      // 5xx (ou qualquer outro) — falha temporária, retentar
      throw new Error(`status inesperado ${res.status}`);
    } catch (err) {
      const isLast = attempt === MAX_ATTEMPTS;
      console.error(
        `[crm] tentativa ${attempt}/${MAX_ATTEMPTS} falhou${isLast ? " (esgotado)" : ""}`,
        {
          submission_id: lead.submission_id,
          source: lead.source,
          error: (err as Error).message,
        }
      );
      if (isLast) return;
      await sleep(backoffDelay(attempt));
    } finally {
      clearTimeout(timeout);
    }
  }
}
