import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailValues {
  to: string;
  subject: string;
  text: string;
}

export async function sendEmail({ to, subject, text }: SendEmailValues) {
  // You'll have to configure auth.ts in order to use this
  await resend.emails.send({
    from: "verification@codingthecode.site",
    to,
    subject,
    text,
  });
}
