export const EMAIL_CONFIG = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: Number(process.env.EMAIL_PORT || '587'),
  user: process.env.EMAIL_USER || '',
  pass: process.env.EMAIL_PASS || '',
  from: process.env.EMAIL_FROM || 'your-email@gmail.com'
};