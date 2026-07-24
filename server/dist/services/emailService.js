"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = exports.EmailService = void 0;
// Email service for sending notifications to uhajucewog80@gmail.com
const nodemailer = __importStar(require("nodemailer"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class EmailService {
    recipientEmail = 'uhajucewog80@gmail.com';
    enabled = process.env.EMAIL_ENABLED === 'true';
    /**
     * Send an email using Nodemailer with Gmail
     */
    async sendEmail(options) {
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
                    // Try port 587 (TLS) first, as port 465 might be blocked
                    const transporter = nodemailer.createTransport({
                        host: 'smtp.gmail.com',
                        port: 587,
                        secure: false, // Use TLS
                        requireTLS: true,
                        auth: {
                            user: process.env.EMAIL_USER,
                            pass: process.env.EMAIL_PASSWORD
                        },
                        tls: {
                            rejectUnauthorized: false // Less strict for testing
                        }
                    });
                    const mailOptions = {
                        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
                        to: options.to,
                        subject: options.subject,
                        text: options.text,
                        html: options.html
                    };
                    const info = await transporter.sendMail(mailOptions);
                    console.log(`✅ Email sent successfully to ${options.to}`);
                    console.log('Message ID:', info.messageId);
                    return {
                        success: true,
                        message: 'Email sent successfully via Gmail'
                    };
                }
                catch (gmailError) {
                    console.error('❌ Gmail sending failed:', gmailError.message);
                    console.error('Error code:', gmailError.code);
                    if (gmailError.code === 'ETIMEDOUT' || gmailError.code === 'ECONNREFUSED') {
                        console.log('⚠️ Network/firewall blocking SMTP. Emails saved to file only.');
                        console.log('To fix:');
                        console.log('1. Check Windows Firewall settings');
                        console.log('2. Try different network (mobile hotspot)');
                        console.log('3. Use email API service (SendGrid/Mailgun) instead of SMTP');
                    }
                    console.log('📝 Falling back to file logging...');
                }
            }
            else {
                console.log('⚠️ Gmail credentials not configured. Emails will only be logged to file.');
            }
            return {
                success: true,
                message: `Email logged to file (${filename}). Enable Gmail in .env to send real emails.`
            };
        }
        catch (error) {
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
    async sendContactMessageNotification(data) {
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
    async sendMeetingRequestNotification(data) {
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
    async sendTestEmail() {
        return this.sendEmail({
            to: this.recipientEmail,
            subject: 'Test Email from Portfolio Backend',
            text: 'This is a test email from your portfolio backend system.',
            html: '<h1>Test Email</h1><p>This is a test email from your portfolio backend system.</p>'
        });
    }
}
exports.EmailService = EmailService;
// Export singleton instance
exports.emailService = new EmailService();
exports.default = exports.emailService;
//# sourceMappingURL=emailService.js.map