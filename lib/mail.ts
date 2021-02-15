import { createTransport, getTestMessageUrl } from "nodemailer";

const transport = createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  }
});

function makeANiceEmail(text: string): string {
  return `
    <div style="
      border: 1px solid black;
      padding: 20px
      font-family: sans-serif;
      line-height: 2;
      font-size: 20px
      ">
      <h2>Hello There!</h2>
      <p>${text}</p>
      <p>😘, Ruslan</p>
      </div>
  `;
}

export interface MailResponse {
  accepted?: (string)[] | null;
  rejected?: (null)[] | null;
  envelopeTime: number;
  messageTime: number;
  messageSize: number;
  response: string;
  envelope: Envelope;
  messageId: string;
}
export interface Envelope {
  from: string;
  to?: (string)[] | null;
}

export async function sendPasswirdResetEmail(
  resetToken: string,
  to: string
): Promise<void> {
  // email a token
  const info = (await transport.sendMail({
    to,
    from: 'zubenkoruslan@gmail.com',
    subject: 'Your passowrd reset token',
    html: makeANiceEmail(`Your Password reset tokeen is here!
    
    <a href="${process.env.FRONTEND_URL}/reset?token=${resetToken}">
      Click here ot reset
    </a>
    `),
  })) as MailResponse;
  if(process.env.MAIL_USER.includes('ethereal.email')) {
    console.log(`Message Sent! Preview it at ${getTestMessageUrl(info)}`);
    
  }
}