const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const QRCode = require('qrcode');

admin.initializeApp();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'luv.stories.co@gmail.com',
    pass: 'wsazbqwskwggxqnp'
  },
  debug: true // Enable debug logging
});

// Add verification step
transporter.verify(function(error, success) {
  if (error) {
    console.error('SMTP verification error:', error);
  } else {
    console.log('SMTP server is ready to take our messages');
  }
});

exports.sendEmailOnWebsiteCreate = functions.firestore
  .document('websites/{docId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    console.log('Website data:', data); // Debug log

    const websiteId = context.params.docId;
    const recipientEmail = data.email;

    if (!recipientEmail) {
      console.error('No email field in document:', data);
      return null;
    }

    const websiteUrl = `https://luv-stories.com/${websiteId}`;

    // Generate the QR code as a Buffer
    const qrCodeBuffer = await QRCode.toBuffer(websiteUrl);

    const mailOptions = {
      from: {
        name: 'Website Manager',
        address: 'luv.stories.co@gmail.com'
      },
      to: recipientEmail,
      subject: 'Your Luv-Story Website is Ready!',
      html: `
        <h1>Your Love Story Website is Ready!</h1>
        <p>Your digital love note is ready—scan the QR code below to access it.</p>
        <p>You can also view your website at: 
          <a href="${websiteUrl}">${websiteUrl}</a>
        </p>
        <p>Scan this QR code to visit your website:</p>
        <!-- The "cid:qrCode" must match the cid field in attachments below -->
        <img src="cid:qrCode" alt="Website QR Code" style="width: 200px; height: 200px;"/>
        <p>Share your love story with others using this QR code or link!</p>
      `,
      attachments: [
        {
          filename: 'qrcode.png',
          content: qrCodeBuffer,
          cid: 'qrCode' // Must match "cid:qrCode" in the HTML
        }
      ],
      headers: {
        'Priority': 'high'
      }
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', {
        messageId: info.messageId,
        response: info.response,
        recipient: recipientEmail
      });
    } catch (err) {
      console.error('Error sending email:', {
        error: err.message,
        stack: err.stack,
        recipient: recipientEmail
      });
      // Rethrow to mark the function as failed
      throw err;
    }

    return null;
  });
