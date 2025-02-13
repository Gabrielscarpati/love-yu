import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { EMAIL_CONFIG } from "../../config/email";

const transporter = nodemailer.createTransport({
  host: EMAIL_CONFIG.host,
  port: EMAIL_CONFIG.port,
  secure: EMAIL_CONFIG.port === 465,
  auth: {
    user: EMAIL_CONFIG.user,
    pass: EMAIL_CONFIG.pass,
  },
});

interface EmailData {
  coupleNames: string;
  websiteUrl: string;
  updateUrl: string;
}

export async function POST(req: Request) {
  try {
    const { toEmail, data } = await req.json() as { toEmail: string, data: EmailData };

    await transporter.sendMail({
      from: EMAIL_CONFIG.from,
      to: toEmail,
      subject: 'Your Love Yu Website Has Been Created!',
      text: `
        Hello ${data.coupleNames}!

        Your Love Yu website has been created successfully.

        View your website: ${data.websiteUrl}
        Update your website: ${data.updateUrl}

        Thank you for using Love Yu!
      `,
      html: `
        <h1>Hello ${data.coupleNames}!</h1>
        <p>Your Love Yu website has been created successfully.</p>
        <p>
          <a href="${data.websiteUrl}">View your website</a><br>
          <a href="${data.updateUrl}">Update your website</a>
        </p>
        <p>Thank you for using Love Yu!</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
