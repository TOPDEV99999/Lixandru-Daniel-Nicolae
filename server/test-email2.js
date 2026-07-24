// Test Gmail SMTP with different configurations
require('dotenv').config();

const nodemailer = require('nodemailer');

console.log('Testing Gmail SMTP with different configurations...\n');

const configs = [
  {
    name: 'Gmail Service (Port 465 - SSL)',
    config: {
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    }
  },
  {
    name: 'SMTP Gmail (Port 587 - TLS)',
    config: {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    }
  },
  {
    name: 'SMTP Gmail (Port 465 - SSL)',
    config: {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    }
  },
  {
    name: 'SMTP Gmail with less security',
    config: {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    }
  }
];

async function testConfig(configName, config) {
  console.log(`\n=== Testing: ${configName} ===`);
  
  try {
    const transporter = nodemailer.createTransport(config);
    
    // First verify connection
    console.log('Verifying connection...');
    await transporter.verify();
    console.log('✅ Connection verified');
    
    // Send test email
    console.log('Sending test email...');
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Test: ${configName}`,
      text: `This is a test email using ${configName} configuration.`,
      html: `<h1>Test: ${configName}</h1><p>This is a test email using ${configName} configuration.</p>`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    return { success: true, info };
    
  } catch (error) {
    console.error('❌ Failed:', error.message);
    console.error('Error code:', error.code);
    return { success: false, error };
  }
}

async function runAllTests() {
  console.log('📧 Email Configuration:');
  console.log('- EMAIL_USER:', process.env.EMAIL_USER);
  console.log('- EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'Set (length: ' + process.env.EMAIL_PASSWORD.length + ')' : 'Not set');
  console.log('- EMAIL_FROM:', process.env.EMAIL_FROM);
  console.log('');
  
  const results = [];
  
  for (const config of configs) {
    const result = await testConfig(config.name, config.config);
    results.push({ ...config, result });
  }
  
  console.log('\n=== SUMMARY ===');
  const successful = results.filter(r => r.result.success);
  const failed = results.filter(r => !r.result.success);
  
  console.log(`Successful: ${successful.length}/${results.length}`);
  console.log(`Failed: ${failed.length}/${results.length}`);
  
  if (successful.length > 0) {
    console.log('\n✅ Working configurations:');
    successful.forEach(r => console.log(`- ${r.name}`));
  }
  
  if (failed.length > 0) {
    console.log('\n❌ Failed configurations:');
    failed.forEach(r => console.log(`- ${r.name}: ${r.result.error?.message}`));
  }
  
  if (successful.length === 0) {
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check if port 587 or 465 is blocked by firewall');
    console.log('2. Try disabling Windows Firewall temporarily');
    console.log('3. Check if your network blocks SMTP');
    console.log('4. Try using a different network (mobile hotspot)');
    console.log('5. Verify Gmail App Password is correct');
  }
}

runAllTests();