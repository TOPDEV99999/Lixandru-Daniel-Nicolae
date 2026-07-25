// Email service for sending notifications to uhajucewog80@gmail.com
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';

export interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export interface ContactMessageEmailData {
  fullName: string;
  email: string;
  message: string;
  visitorIp?: string;
  browser?: string;
  country?: string;
}

export interface MeetingRequestEmailData {
  customerName: string;
  email: string;
  company?: string;
  meetingTopic: string;
  requestedDate: string;
  requestedTime: string;
  notes?: string;
  visitorIp?: string;
  browser?: string;
  country?: string;
}

export class EmailService {
  private recipientEmail = 'uhajucewog80@gmail.com';
  // private enabled = process.env.EMAIL_ENABLED === 'true'; // Unused property

  /**
   * Send an email using Nodemailer with Gmail
   */
  async sendEmail(options: EmailOptions): Promise<{ success: boolean; message: string }> {
    try {
      // For now, we'll use a test approach since we don't have Gmail credentials
      // In production, you would use actual Gmail SMTP credentials
      
      console.log('🚀 EMAIL NOTIFICATION 🚀');
      console.log('To:', options.to);
      console.log('Subject:', options.subject);
      console.log('Text preview:', options.text.substring(0, 200) + '...');
      console.log('------------------------');
      
      // Create a simple HTML email file as fallback
      const emailContent = `
Subject: ${options.subject}
To: ${options.to}
Date: ${new Date().toISOString()}

${options.text}

${options.html ? '\nHTML Version Available\n' : ''}
      `.trim();
      
      // Save email to file as backup
      const emailDir = path.join(__dirname, '../../email_logs');
      
      if (!fs.existsSync(emailDir)) {
        fs.mkdirSync(emailDir, { recursive: true });
      }
      
      const filename = `email_${Date.now()}.txt`;
      const filepath = path.join(emailDir, filename);
      fs.writeFileSync(filepath, emailContent);
      
      console.log(`📧 Email saved to: ${filepath}`);
      
      // Check if we have Gmail credentials
      const hasGmailCredentials = process.env.EMAIL_USER && process.env.EMAIL_PASSWORD;
      
      console.log('📧 Email configuration:');
      console.log('- EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Not set');
      console.log('- EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'Set (length: ' + process.env.EMAIL_PASSWORD.length + ')' : 'Not set');
      
      if (hasGmailCredentials) {
        // Try to send actual email with Nodemailer (with error handling)
        try {
          console.log('📧 Attempting to send email via Gmail...');
          
          // Create transporter with multiple fallback options
          let transporter;
          
          // Try different configurations
          const configs = [
            {
              name: 'Gmail Service',
              config: {
                service: 'gmail',
                auth: {
                  user: process.env.EMAIL_USER,
                  pass: process.env.EMAIL_PASSWORD
                },
                timeout: 10000 // 10 second timeout
              }
            },
            {
              name: 'SMTP Gmail TLS',
              config: {
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                requireTLS: true,
                auth: {
                  user: process.env.EMAIL_USER,
                  pass: process.env.EMAIL_PASSWORD
                },
                tls: {
                  rejectUnauthorized: false
                },
                timeout: 10000
              }
            },
            {
              name: 'SMTP Gmail SSL',
              config: {
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                  user: process.env.EMAIL_USER,
                  pass: process.env.EMAIL_PASSWORD
                },
                timeout: 10000
              }
            }
          ];

          let lastError: any = null;
          
          for (const { name, config } of configs) {
            try {
              console.log(`  Trying ${name}...`);
              transporter = nodemailer.createTransport(config);
              
              // Test connection with short timeout
              await transporter.verify();
              
              console.log(`  ✅ ${name} connection successful`);
              
              const mailOptions = {
                from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
                to: options.to,
                subject: options.subject,
                text: options.text,
                html: options.html
              };

              const info = await transporter.sendMail(mailOptions);
              console.log(`✅ Email sent successfully to ${options.to} via ${name}`);
              console.log('Message ID:', info.messageId);
              
              return {
                success: true,
                message: `Email sent successfully via Gmail (${name})`
              };
              
            } catch (configError: any) {
              lastError = configError;
              console.log(`  ❌ ${name} failed: ${configError.message}`);
              continue; // Try next configuration
            }
          }
          
          // All configurations failed
          throw lastError;
          
        } catch (gmailError: any) {
          console.error('❌ All Gmail SMTP attempts failed:', gmailError.message);
          console.error('Error code:', gmailError.code);
          
          if (gmailError.code === 'ETIMEDOUT' || gmailError.code === 'ESOCKET' || gmailError.code === 'ECONNREFUSED') {
            console.log('⚠️ Network/firewall blocking SMTP ports 587/465.');
            console.log('Emails will be saved to file only.');
            console.log('');
            console.log('SOLUTIONS:');
            console.log('1. Check Windows Firewall settings');
            console.log('2. Try a different network (mobile hotspot)');
            console.log('3. Use email API service (SendGrid/Mailgun) instead');
            console.log('4. Email logs are saved in server/email_logs/');
            console.log('');
            console.log('For immediate email delivery, consider:');
            console.log('- Using SendGrid/Mailgun API');
            console.log('- Setting up a different email provider');
            console.log('- Using email forwarding service');
          }
          
          console.log('📝 Falling back to file logging...');
        }
      } else {
        console.log('⚠️ Gmail credentials not configured. Emails will be logged to file.');
      }
      
      return {
        success: true,
        message: `Email logged to file (${filename}). Enable Gmail in .env to send real emails.`
      };
    } catch (error: any) {
      console.error('Email sending error:', error);
      return {
        success: false,
        message: `Failed to send email: ${error.message}`
      };
    }
  }

  /**
   * Send notification for new contact message
   */
  async sendContactMessageNotification(data: ContactMessageEmailData): Promise<{ success: boolean; message: string }> {
    const subject = `New Contact Message from ${data.fullName}`;
    
    const text = `
New Contact Message Received

Name: ${data.fullName}
Email: ${data.email}
Message: ${data.message}

Visitor Information:
- IP: ${data.visitorIp || 'Unknown'}
- Browser: ${data.browser || 'Unknown'}
- Country: ${data.country || 'Unknown'}

Timestamp: ${new Date().toLocaleString()}
    `.trim();

    const html = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f4f4f4; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .info { margin: 15px 0; }
        .label { font-weight: bold; color: #555; }
        .message { background: #f9f9f9; padding: 15px; border-left: 4px solid #0070f3; margin: 20px 0; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #777; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>New Contact Message Received</h2>
        </div>
        
        <div class="info">
            <p><span class="label">Name:</span> ${data.fullName}</p>
            <p><span class="label">Email:</span> ${data.email}</p>
        </div>
        
        <div class="message">
            <p><span class="label">Message:</span></p>
            <p>${data.message.replace(/\n/g, '<br>')}</p>
        </div>
        
        <div class="info">
            <h3>Visitor Information:</h3>
            <p><span class="label">IP Address:</span> ${data.visitorIp || 'Unknown'}</p>
            <p><span class="label">Browser:</span> ${data.browser || 'Unknown'}</p>
            <p><span class="label">Country:</span> ${data.country || 'Unknown'}</p>
        </div>
        
        <div class="footer">
            <p>This message was sent automatically from your portfolio website.</p>
            <p>Timestamp: ${new Date().toLocaleString()}</p>
        </div>
    </div>
</body>
</html>
    `.trim();

    return this.sendEmail({
      to: this.recipientEmail,
      subject,
      text,
      html
    });
  }

  /**
   * Send notification for new meeting request
   */
  async sendMeetingRequestNotification(data: MeetingRequestEmailData): Promise<{ success: boolean; message: string }> {
    const subject = `New Meeting Request from ${data.customerName}`;
    
    const text = `
New Meeting Request Received

Customer: ${data.customerName}
Email: ${data.email}
Company: ${data.company || 'Not specified'}

Meeting Details:
- Topic: ${data.meetingTopic}
- Date: ${data.requestedDate}
- Time: ${data.requestedTime}

Notes: ${data.notes || 'No additional notes provided'}

Visitor Information:
- IP: ${data.visitorIp || 'Unknown'}
- Browser: ${data.browser || 'Unknown'}
- Country: ${data.country || 'Unknown'}

Timestamp: ${new Date().toLocaleString()}
    `.trim();

    const html = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f4f4f4; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .info { margin: 15px 0; }
        .label { font-weight: bold; color: #555; }
        .meeting-details { background: #e8f4ff; padding: 15px; border-left: 4px solid #0070f3; margin: 20px 0; }
        .notes { background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #777; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>New Meeting Request Received</h2>
        </div>
        
        <div class="info">
            <p><span class="label">Customer:</span> ${data.customerName}</p>
            <p><span class="label">Email:</span> ${data.email}</p>
            <p><span class="label">Company:</span> ${data.company || 'Not specified'}</p>
        </div>
        
        <div class="meeting-details">
            <h3>Meeting Details:</h3>
            <p><span class="label">Topic:</span> ${data.meetingTopic}</p>
            <p><span class="label">Date:</span> ${data.requestedDate}</p>
            <p><span class="label">Time:</span> ${data.requestedTime}</p>
        </div>
        
        ${data.notes ? `
        <div class="notes">
            <p><span class="label">Notes:</span></p>
            <p>${data.notes.replace(/\n/g, '<br>')}</p>
        </div>
        ` : ''}
        
        <div class="info">
            <h3>Visitor Information:</h3>
            <p><span class="label">IP Address:</span> ${data.visitorIp || 'Unknown'}</p>
            <p><span class="label">Browser:</span> ${data.browser || 'Unknown'}</p>
            <p><span class="label">Country:</span> ${data.country || 'Unknown'}</p>
        </div>
        
        <div class="footer">
            <p>This message was sent automatically from your portfolio website.</p>
            <p>Timestamp: ${new Date().toLocaleString()}</p>
        </div>
    </div>
</body>
</html>
    `.trim();

    return this.sendEmail({
      to: this.recipientEmail,
      subject,
      text,
      html
    });
  }

  /**
   * Send test email
   */
  async sendTestEmail(): Promise<{ success: boolean; message: string }> {
    return this.sendEmail({
      to: this.recipientEmail,
      subject: 'Test Email from Portfolio Backend',
      text: 'This is a test email from your portfolio backend system.',
      html: '<h1>Test Email</h1><p>This is a test email from your portfolio backend system.</p>'
    });
  }
}

// Export singleton instance
export const emailService = new EmailService();
export default emailService;