import "server-only";
import nodemailer from "nodemailer";

/**
 * Send sign-in emails through SMTP. Local development can display links;
 * production requires email delivery and never exposes sign-in tokens.
 */
export function mailConfigured(): boolean {
  return !!process.env.SMTP_HOST;
}

export async function sendMail(to: string, subject: string, text: string, html: string): Promise<void> {
  if (!mailConfigured()) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SMTP must be configured in production");
    }
    console.log(`[dev-mail] To: ${to}\nSubject: ${subject}\n${text}`);
    return;
  }
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });
  await transport.sendMail({
    from: process.env.MAIL_FROM || "Practical AI Engineer <no-reply@localhost>",
    to,
    subject,
    text,
    html,
  });
}

export function baseUrl(): string {
  return process.env.BASE_URL || "http://localhost:3000";
}
