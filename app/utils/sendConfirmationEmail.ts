// app/utils/sendConfirmationEmail.ts
export interface EmailData {
  subject: string;
  body: string;
}

export async function sendConfirmationEmail(toEmail: string, data: EmailData) {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toEmail, data }),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }
  } catch (error) {
    console.error('Error sending email:', error);
    // Optionally handle the error without interrupting the flow
  }
}
