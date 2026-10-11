import "server-only";

/**
 * Email delivery. If SMTP_* env vars are set, send via nodemailer (dynamic import,
 * optional dependency). Otherwise operate in "dev mail" mode: the caller shows the
 * magic link directly on screen.
 */
export function mailConfigured(): boolean {
  return !!process.env.SMTP_HOST;
}

export async function sendMail(to: string, subject: string, text: string, html: string): Promise<void> {
  if (!mailConfigured()) {
    console.log(`[dev-mail] To: ${to}\nSubject: ${subject}\n${text}`);
    return;
  }
  // Opaque module name so the bundler doesn't try to statically resolve the
  // optional nodemailer dependency; only loaded when SMTP is configured.
  const mod = "nodemailer";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nodemailer: any = await import(mod);
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
