// Verify credentials and connectivity without sending an email.
import nodemailer from 'nodemailer';
const env = process.env;
try {
  await nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT || 587),
    secure: env.SMTP_SECURE === 'true',
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  }).verify();
  console.log('SMTP authentication verified (no email sent)');
} catch (error) {
  console.error('SMTP verification failed:', error.code, error.responseCode);
  process.exit(1);
}
