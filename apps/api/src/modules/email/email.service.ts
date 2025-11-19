import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

@Injectable()
export class EmailService {
  private resend: Resend;
  private readonly logger = new Logger(EmailService.name);
  private readonly defaultFrom: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');

    if (!apiKey) {
      this.logger.warn('RESEND_API_KEY not configured. Emails will be logged only.');
      this.resend = null as any;
    } else {
      this.resend = new Resend(apiKey);
    }

    this.defaultFrom = this.configService.get<string>(
      'EMAIL_FROM',
      'Publicadis <noreply@publicadis.com>',
    );
  }

  async sendEmail(options: SendEmailOptions): Promise<void> {
    if (!this.resend) {
      this.logger.log(`[DEV MODE] Email would be sent to ${options.to}:`);
      this.logger.log(`Subject: ${options.subject}`);
      this.logger.log(`HTML: ${options.html.substring(0, 200)}...`);
      return;
    }

    try {
      await this.resend.emails.send({
        from: options.from || this.defaultFrom,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
        replyTo: options.replyTo,
      });

      this.logger.log(`Email sent successfully to ${options.to}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${options.to}:`, error);
      throw error;
    }
  }

  async sendWelcomeEmail(to: string, firstName: string): Promise<void> {
    const html = this.getWelcomeTemplate(firstName);

    return this.sendEmail({
      to,
      subject: '¡Bienvenido a Publicadis! 🎉',
      html,
    });
  }

  async sendVerificationEmail(
    to: string,
    verificationUrl: string,
  ): Promise<void> {
    const html = this.getVerificationTemplate(verificationUrl);

    return this.sendEmail({
      to,
      subject: 'Verifica tu email en Publicadis',
      html,
    });
  }

  async sendPasswordResetEmail(
    to: string,
    resetUrl: string,
  ): Promise<void> {
    const html = this.getPasswordResetTemplate(resetUrl);

    return this.sendEmail({
      to,
      subject: 'Restablece tu contraseña en Publicadis',
      html,
    });
  }

  async sendNewListingNotification(
    to: string,
    listingTitle: string,
    listingUrl: string,
  ): Promise<void> {
    const html = this.getNewListingTemplate(listingTitle, listingUrl);

    return this.sendEmail({
      to,
      subject: 'Tu anuncio fue publicado exitosamente',
      html,
    });
  }

  async sendMessageNotification(
    to: string,
    senderName: string,
    messagePreview: string,
    conversationUrl: string,
  ): Promise<void> {
    const html = this.getMessageNotificationTemplate(
      senderName,
      messagePreview,
      conversationUrl,
    );

    return this.sendEmail({
      to,
      subject: `Nuevo mensaje de ${senderName}`,
      html,
    });
  }

  async sendSubscriptionConfirmation(
    to: string,
    planName: string,
    amount: number,
  ): Promise<void> {
    const html = this.getSubscriptionConfirmationTemplate(planName, amount);

    return this.sendEmail({
      to,
      subject: `Suscripción confirmada: ${planName}`,
      html,
    });
  }

  // Email Templates
  private getWelcomeTemplate(firstName: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; }
            .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>¡Bienvenido a Publicadis!</h1>
            </div>
            <div class="content">
              <p>Hola ${firstName},</p>
              <p>¡Gracias por unirte a Publicadis! Estamos emocionados de tenerte con nosotros.</p>
              <p>Con Publicadis puedes:</p>
              <ul>
                <li>✨ Crear tu página de negocio profesional gratis</li>
                <li>📢 Publicar anuncios en nuestro marketplace</li>
                <li>🤝 Conectar con miles de clientes potenciales</li>
                <li>📊 Ver analytics de tus anuncios y página</li>
              </ul>
              <p>¿Listo para empezar?</p>
              <a href="https://publicadis.com/dashboard" class="button">Ir a mi Dashboard</a>
              <p>Si tienes alguna pregunta, estamos aquí para ayudarte.</p>
            </div>
            <div class="footer">
              <p>© 2025 Publicadis. Hecho con ❤️ en Perú</p>
              <p><a href="https://publicadis.com/ayuda">Centro de Ayuda</a> | <a href="https://publicadis.com/privacidad">Privacidad</a></p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private getVerificationTemplate(verificationUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #10b981; color: white; padding: 30px; text-align: center; }
            .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; }
            .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Verifica tu Email</h1>
            </div>
            <div class="content">
              <p>Hola,</p>
              <p>Para completar tu registro en Publicadis, por favor verifica tu dirección de email haciendo clic en el botón de abajo:</p>
              <a href="${verificationUrl}" class="button">Verificar Email</a>
              <p>O copia y pega este enlace en tu navegador:</p>
              <p style="color: #6b7280; word-break: break-all;">${verificationUrl}</p>
              <p>Este enlace expirará en 24 horas.</p>
              <p>Si no creaste esta cuenta, puedes ignorar este email.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private getPasswordResetTemplate(resetUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #ef4444; color: white; padding: 30px; text-align: center; }
            .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; }
            .button { display: inline-block; background: #ef4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Restablece tu Contraseña</h1>
            </div>
            <div class="content">
              <p>Hola,</p>
              <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en Publicadis.</p>
              <p>Haz clic en el botón de abajo para crear una nueva contraseña:</p>
              <a href="${resetUrl}" class="button">Restablecer Contraseña</a>
              <p>O copia y pega este enlace:</p>
              <p style="color: #6b7280; word-break: break-all;">${resetUrl}</p>
              <p>Este enlace expirará en 1 hora.</p>
              <p><strong>Si no solicitaste este cambio, ignora este email.</strong> Tu contraseña permanecerá sin cambios.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private getNewListingTemplate(title: string, url: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #10b981; color: white; padding: 30px; text-align: center; }
            .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; }
            .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>¡Tu anuncio está publicado! 🎉</h1>
            </div>
            <div class="content">
              <p>Hola,</p>
              <p>Tu anuncio "<strong>${title}</strong>" ha sido publicado exitosamente en Publicadis.</p>
              <p>Ahora miles de personas podrán verlo y contactarte.</p>
              <a href="${url}" class="button">Ver mi anuncio</a>
              <p><strong>Consejos para obtener más respuestas:</strong></p>
              <ul>
                <li>✅ Agrega fotos de calidad</li>
                <li>✅ Escribe una descripción detallada</li>
                <li>✅ Responde rápido a los mensajes</li>
                <li>✅ Comparte tu anuncio en redes sociales</li>
              </ul>
              <p>¡Buena suerte con tu anuncio!</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private getMessageNotificationTemplate(
    senderName: string,
    preview: string,
    url: string,
  ): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #3b82f6; color: white; padding: 30px; text-align: center; }
            .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; }
            .message-preview { background: #f3f4f6; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0; }
            .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Nuevo Mensaje 💬</h1>
            </div>
            <div class="content">
              <p>Hola,</p>
              <p>Tienes un nuevo mensaje de <strong>${senderName}</strong>:</p>
              <div class="message-preview">
                <p>${preview}</p>
              </div>
              <a href="${url}" class="button">Responder Mensaje</a>
              <p><small>Responde rápido para aumentar tus posibilidades de cerrar el trato.</small></p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private getSubscriptionConfirmationTemplate(
    planName: string,
    amount: number,
  ): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #10b981; color: white; padding: 30px; text-align: center; }
            .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; }
            .plan-details { background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>¡Suscripción Confirmada! ✅</h1>
            </div>
            <div class="content">
              <p>Hola,</p>
              <p>Tu suscripción al plan <strong>${planName}</strong> ha sido confirmada.</p>
              <div class="plan-details">
                <p><strong>Plan:</strong> ${planName}</p>
                <p><strong>Monto:</strong> S/${amount}/mes</p>
                <p><strong>Próximo cobro:</strong> ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('es-PE')}</p>
              </div>
              <p>Ahora tienes acceso a todas las funciones premium de Publicadis.</p>
              <p>Si tienes alguna pregunta, contáctanos en soporte@publicadis.com</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}
