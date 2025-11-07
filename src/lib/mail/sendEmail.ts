import { FormularioInput } from "../actions/formularios";
import { Resend } from 'resend';

export async function sendEmailFormulario(data: FormularioInput, isCodigo78?: boolean) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const htmlBody = `
  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; color: #333;">
    <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">

      <div style="display: flex; align-items: center; gap: 12px; border-bottom: 2px solid #eee; padding-bottom: 16px; margin-bottom: 24px;">
        <img src="https://www.terrasulimoveis.com.br/fav.svg" alt="Logo TerraSul" width="40" height="40" style="display: block;" />
        <h2 style="margin: 0; color: #eda141; font-size: 20px;">Novo Formulário Recebido</h2>
      </div>

      <table style="width: 100%; border-collapse: collapse;">
        <tbody>
          <tr><td style="padding: 8px 0;"><strong>Tipo:</strong></td><td style="padding: 8px 0;">${data.tipo}</td></tr>
          <tr><td style="padding: 8px 0;"><strong>Nome:</strong></td><td style="padding: 8px 0;">${data.nome}</td></tr>
          <tr><td style="padding: 8px 0;"><strong>Email:</strong></td><td style="padding: 8px 0;">${data.email}</td></tr>
          <tr><td style="padding: 8px 0;"><strong>Telefone:</strong></td><td style="padding: 8px 0;">${data.telefone}</td></tr>

          ${data.mensagem ? `<tr><td style="padding: 8px 0;"><strong>Mensagem:</strong></td><td style="padding: 8px 0;">${data.mensagem}</td></tr>` : ''}
          ${data.DataVisita ? `<tr><td style="padding: 8px 0;"><strong>Data da Visita:</strong></td><td style="padding: 8px 0;">${data.DataVisita.toLocaleDateString('pt-BR')}</td></tr>` : ''}
          ${data.turnoVisita ? `<tr><td style="padding: 8px 0;"><strong>Turno da Visita:</strong></td><td style="padding: 8px 0;">${data.turnoVisita}</td></tr>` : ''}
          ${data.codigoImovel ? `<tr><td style="padding: 8px 0;"><strong>Código do Imóvel:</strong></td><td style="padding: 8px 0;">${data.codigoImovel}</td></tr>` : ''}
          ${data.condominio ? `<tr><td style="padding: 8px 0;"><strong>Condomínio:</strong></td><td style="padding: 8px 0;">${data.condominio}</td></tr>` : ''}
          ${data.assunto ? `<tr><td style="padding: 8px 0;"><strong>Assunto:</strong></td><td style="padding: 8px 0;">${data.assunto}</td></tr>` : ''}
          ${data.valorDesejado ? `<tr><td style="padding: 8px 0;"><strong>Valor Desejado:</strong></td><td style="padding: 8px 0;">R$ ${data.valorDesejado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td></tr>` : ''}
          ${data.origem ? `<tr><td style="padding: 8px 0;"><strong>Origem:</strong></td><td style="padding: 8px 0;">${data.origem ?? 'Não informada'}</td></tr> ` : ''}
          ${data.interesse ? `<tr><td style="padding: 8px 0;"><strong>Interesse:</strong></td><td style="padding: 8px 0;">${data.interesse ?? 'Não informado'}</td></tr>` : ''}
          <tr><td style="padding: 8px 0;"><strong>URL Respondida:</strong></td><td style="padding: 8px 0;"><a href="${data.urlRespondida}" target="_blank" style="color: #eda141; text-decoration: none;">${data.urlRespondida}</a></td></tr>
        </tbody>
      </table>

      <p style="margin-top: 40px; font-size: 12px; color: #999;">Este e-mail foi gerado automaticamente pelo site TerraSul.</p>
    </div>
  </div>
`;


  const to =
    isCodigo78 || isCodigo78 == undefined
      ? process.env.MAIL_TO_DEFAULT
      : process.env.MAIL_TO_DEFAULT2;

  const from = process.env.MAIL_USER;

  try {
    const result = await resend.emails.send({
      from: `TerraSul <${from}>`,
      to: to!,
      cc: data.email,
      subject: 'Lead TerraSul',
      html: htmlBody,
    });

    console.log('E-mail enviado:', result);
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
  }

}
