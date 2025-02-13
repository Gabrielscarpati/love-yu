// app/create/page.tsx
"use client"; // marks this file as a client component

import React from 'react';

interface EmailData {
  coupleNames: string;
  websiteUrl: string;
  updateUrl: string;
}

async function sendConfirmationEmail(toEmail: string, data: EmailData) {
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
    // Optionally handle the error (e.g., show a message to the user)
  }
}

export default function CreatePage() {
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Assume these values are collected from your form
    const toEmail = "gabrielbrsc15@gmail.com";
    const emailData: EmailData = {
      coupleNames: "John & Jane",
      websiteUrl: "https://loveyou-9e3bf.web.app/abc123",
      updateUrl: "https://loveyou-9e3bf.web.app/abc123/edit"
    };

    // After creating the website in Firebase, send the email confirmation.
    await sendConfirmationEmail(toEmail, emailData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Your form fields go here */}
      <button type="submit">Create Website</button>
    </form>
  );
}
