import nodemailer from 'nodemailer'
import { FormularioInput } from "../actions/formularios";

export async function sendEmailFormulario(data: FormularioInput, isCodigo78: boolean) {
  const transporter = nodemailer.createTransport({
    port: 587,
    host: process.env.MAIL_HOST,
    secure: false, // TLS → usar false para 587
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const htmlBody = `
  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; color: #333;">
    <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
      <h2 style="margin-top: 0; color: #0061bc;">Novo Formulário Recebido</h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
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
          <tr><td style="padding: 8px 0;"><strong>URL Respondida:</strong></td><td style="padding: 8px 0;"><a href="${data.urlRespondida}" target="_blank" style="color: #0061bc;">${data.urlRespondida}</a></td></tr>
        </tbody>
      </table>

      <p style="margin-top: 40px; font-size: 12px; color: #999;">Este e-mail foi gerado automaticamente pelo site Terra Sul.</p>
    </div>
  </div>
`;

  if (isCodigo78 || isCodigo78 == undefined){
    await transporter.sendMail({
    from: `"Lead Terra Sul" <${process.env.MAIL_USER}>`,
    to: process.env.MAIL_TO_DEFAULT,
    subject: `Lead Terra Sul`,
    html: htmlBody,
  });
  }
  else{
    await transporter.sendMail({
      from: `"Lead Terra Sul" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_TO_DEFAULT2,
      subject: `Lead Terra Sul`,
      html: htmlBody,
    });
  }
}
