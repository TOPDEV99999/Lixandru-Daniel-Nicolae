// Simple test to check if Gmail SMTP works
require('dotenv').config();

const nodemailer = require('nodemailer');

console.log('Testing Gmail SMTP configuration...');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Not set');
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'Set (length: ' + process.env.EMAIL_PASSWORD.length + ')' : 'Not set');
console.log('EMAIL_FROM:', process.env.EMAIL_FROM || 'Not set');

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  console.error('❌ ERROR: Email credentials not set in .env file');
  console.log('Please add to .env:');
  console.log('EMAIL_USER=uhajucewog80@gmail.com');
  console.log('EMAIL_PASSWORD=your-16-char-app-password');
  process.exit(1);
}

async function testEmail() {
  try {
    console.log('\nCreating transporter...');
    
    // Try different configurations
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,  // Try TLS port instead of SSL (465)
      secure: false, // Use TLS
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
      }
    });

    console.log('Sending test email...');
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: 'uhajucewog80@gmail.com',
      subject: 'Test Email from Portfolio Backend',
      text: 'This is a test email from your portfolio backend system.',
      html: '<h1>Test Email</h1><p>This is a test email from your portfolio backend system.</p>'
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ SUCCESS: Email sent!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
    
  } catch (error) {
    console.error('❌ ERROR sending email:');
    console.error('Message:', error.message);
    
    if (error.code === 'EAUTH') {
      console.error('\n🔒 AUTHENTICATION ERROR:');
      console.error('1. Make sure you have 2-Step Verification enabled on Google');
      console.error('2. Generate an App Password (not your regular password)');
      console.error('3. Use the 16-character App Password in .env file');
      console.error('4. App Password should have NO spaces');
    } else if (error.code === 'EENVELOPE') {
      console.error('\n📧 ENVELOPE ERROR: Check email addresses');
    } else {
      console.error('\nError code:', error.code);
    }
  }
}

testEmail();