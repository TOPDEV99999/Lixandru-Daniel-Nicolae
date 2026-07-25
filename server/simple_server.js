// Simple server with all needed endpoints
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
// app.use(cors({
//   origin: ['http://localhost:3000', 'http://localhost:5173'],
//   credentials: true,
//   optionsSuccessStatus: 200
// }));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'simple-backend',
    version: '1.0.0'
  });
});

// Home
app.get('/', (req, res) => {
  res.json({
    message: 'Simple Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      resume: '/api/resume',
      contact: '/api/contact',
      meeting: '/api/meeting',
      availability: '/api/availability',
      admin: '/api/admin/*',
      email: '/api/admin/test-email'
    }
  });
});

// Resume download endpoint
app.get('/api/resume', (req, res) => {
  console.log('Resume download requested');
  
  const possiblePaths = [
    path.join(__dirname, 'files/Lixandru_Daniel_Nicolae.pdf'),
    path.join(__dirname, '../files/Lixandru_Daniel_Nicolae.pdf'),
    path.join(process.cwd(), 'files/Lixandru_Daniel_Nicolae.pdf'),
    path.join(__dirname, '../../../files/Lixandru_Daniel_Nicolae.pdf')
  ];
  
  let foundPath = null;
  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      foundPath = filePath;
      console.log('Found resume at:', filePath);
      break;
    }
  }
  
  if (!foundPath) {
    console.error('Resume file not found. Searched paths:', possiblePaths);
    return res.status(404).json({ 
      error: 'Resume file not found',
      message: 'Resume PDF file could not be located on the server'
    });
  }
  
  const filename = 'Lixandru_Daniel_Nicolae_Resume.pdf';
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  
  try {
    const fileStream = fs.createReadStream(foundPath);
    fileStream.pipe(res);
    
    fileStream.on('error', (error) => {
      console.error('Error streaming resume file:', error);
      res.status(500).json({ 
        error: 'Failed to download resume',
        message: error.message 
      });
    });
  } catch (error) {
    console.error('Error downloading resume:', error);
    res.status(500).json({ 
      error: 'Failed to download resume',
      message: error.message 
    });
  }
});

// Email service
class SimpleEmailService {
  constructor() {
    this.recipientEmail = 'uhajucewog80@gmail.com';
    this.hasGmailCredentials = process.env.EMAIL_USER && process.env.EMAIL_PASSWORD;
  }

  async sendEmail(options) {
    try {
      console.log('📧 EMAIL NOTIFICATION 📧');
      console.log('To:', options.to);
      console.log('Subject:', options.subject);
      console.log('Text preview:', options.text.substring(0, 200) + '...');
      console.log('------------------------');
      
      // Save email to file
      const emailDir = path.join(__dirname, 'email_logs');
      if (!fs.existsSync(emailDir)) {
        fs.mkdirSync(emailDir, { recursive: true });
      }
      
      const emailContent = `
Subject: ${options.subject}
To: ${options.to}
Date: ${new Date().toISOString()}

${options.text}

${options.html ? '\nHTML Version Available\n' : ''}
      `.trim();
      
      const filename = `email_${Date.now()}.txt`;
      const filepath = path.join(emailDir, filename);
      fs.writeFileSync(filepath, emailContent);
      
      console.log(`📧 Email saved to: ${filepath}`);
      
      // Try to send via Gmail if credentials exist
      if (this.hasGmailCredentials) {
        try {
          console.log('📧 Attempting to send email via Gmail...');
          const nodemailer = require('nodemailer');
          
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASSWORD
            },
            timeout: 10000
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
        } catch (gmailError) {
          console.error('❌ Gmail sending failed:', gmailError.message);
          console.error('Error code:', gmailError.code);
          
          if (gmailError.code === 'ETIMEDOUT' || gmailError.code === 'ESOCKET') {
            console.log('⚠️ Network/firewall blocking SMTP. Emails saved to file only.');
            console.log('Email logs saved in:', emailDir);
          }
        }
      } else {
        console.log('⚠️ Gmail credentials not configured. Emails will be logged to file.');
      }
      
      return {
        success: true,
        message: `Email logged to file (${filename}). Enable Gmail in .env to send real emails.`
      };
    } catch (error) {
      console.error('Email sending error:', error);
      return {
        success: false,
        message: `Failed to send email: ${error.message}`
      };
    }
  }

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

    return this.sendEmail({
      to: this.recipientEmail,
      subject,
      text,
      html: `
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
      `.trim()
    });
  }

  async sendTestEmail() {
    return this.sendEmail({
      to: this.recipientEmail,
      subject: 'Test Email from Portfolio Backend',
      text: 'This is a test email from your portfolio backend system.',
      html: '<h1>Test Email</h1><p>This is a test email from your portfolio backend system.</p>'
    });
  }
}

const emailService = new SimpleEmailService();

// Contact route
app.post('/api/contact', async (req, res) => {
  console.log('Contact form submission:', req.body);
  
  try {
    const emailResult = await emailService.sendContactMessageNotification({
      fullName: req.body.full_name || req.body.fullName || 'Unknown',
      email: req.body.email || 'unknown@example.com',
      message: req.body.message || '',
      visitorIp: req.headers['x-forwarded-for'] || req.ip,
      browser: req.headers['user-agent'] || 'Unknown',
      country: req.headers['cf-ipcountry'] || 'Unknown'
    });

    res.status(201).json({ 
      success: true,
      message: 'Contact message submitted successfully',
      id: 'contact-' + Date.now(),
      emailSent: emailResult.success,
      emailMessage: emailResult.message
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(201).json({ 
      success: true,
      message: 'Contact message submitted (email notification failed)',
      id: 'contact-' + Date.now(),
      emailSent: false,
      emailMessage: 'Failed to send email notification'
    });
  }
});

// Meeting route
app.post('/api/meeting', async (req, res) => {
  console.log('Meeting request:', req.body);
  
  try {
    const meetingData = {
      customerName: req.body.customer_name || req.body.customerName || 'Unknown',
      email: req.body.email || 'unknown@example.com',
      company: req.body.company || '',
      meetingTopic: req.body.meeting_topic || req.body.meetingTopic || req.body.topic || 'General Discussion',
      requestedDate: req.body.requested_date || req.body.requestedDate || new Date().toISOString().split('T')[0],
      requestedTime: req.body.requested_time || req.body.requestedTime || '12:00',
      notes: req.body.notes || ''
    };

    const emailResult = await emailService.sendMeetingRequestNotification({
      ...meetingData,
      visitorIp: req.headers['x-forwarded-for'] || req.ip,
      browser: req.headers['user-agent'] || 'Unknown',
      country: req.headers['cf-ipcountry'] || 'Unknown'
    });

    res.status(201).json({ 
      success: true,
      message: 'Meeting request submitted successfully',
      id: 'meeting-' + Date.now(),
      emailSent: emailResult.success,
      emailMessage: emailResult.message,
      meeting: {
        id: 'meeting-' + Date.now(),
        ...meetingData,
        status: 'pending'
      }
    });
  } catch (error) {
    console.error('Meeting submission error:', error);
    res.status(201).json({ 
      success: true,
      message: 'Meeting request submitted (email notification failed)',
      id: 'meeting-' + Date.now(),
      emailSent: false,
      emailMessage: 'Failed to send email notification',
      meeting: {
        id: 'meeting-' + Date.now(),
        customerName: req.body.customer_name || req.body.customerName || 'Unknown',
        email: req.body.email || 'unknown@example.com',
        meetingTopic: req.body.meeting_topic || req.body.meetingTopic || req.body.topic || 'General Discussion',
        requestedDate: req.body.requested_date || req.body.requestedDate || new Date().toISOString().split('T')[0],
        requestedTime: req.body.requested_time || req.body.requestedTime || '12:00',
        status: 'pending'
      }
    });
  }
});

// Availability route
app.post('/api/availability', (req, res) => {
  const { date } = req.body;
  console.log('Availability check for date:', date);
  res.json({ 
    date,
    bookedSlots: ['09:00', '10:30', '14:00'],
    availableSlots: ['09:30', '10:00', '11:00', '11:30', '13:00', '13:30', '15:00', '15:30', '16:00'],
    totalBooked: 3,
    totalAvailable: 9
  });
});

// Simple authentication middleware
function simpleAuthMiddleware(requiredRole = 'user') {
  return (req, res, next) => {
    // For testing, allow access with specific email
    const authHeader = req.headers.authorization;
    
    if (requiredRole === 'admin') {
      // Check for admin email in header or query param (for testing)
      const adminEmail = req.headers['x-admin-email'] || req.query.adminEmail || 'uhajucewog80@gmail.com';
      
      if (adminEmail === 'uhajucewog80@gmail.com') {
        req.user = { 
          id: 'admin-id', 
          email: adminEmail, 
          role: 'admin' 
        };
        return next();
      }
    }
    
    // For user routes, create a mock user
    if (requiredRole === 'user') {
      req.user = { 
        id: 'user-id', 
        email: 'user@example.com', 
        role: 'user' 
      };
      return next();
    }
    
    // If no auth header and not admin, return unauthorized
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required'
    });
  };
}

// Admin routes (with simple auth)
app.get('/api/admin/data', simpleAuthMiddleware('admin'), (req, res) => {
  res.json({ 
    statistics: {
      visitors: { total: 0, uniqueCountries: 0 },
      meetings: { total: 0, byStatus: {}, upcoming: 0 },
      messages: { total: 0, byStatus: {}, unread: 0 },
      users: { total: 0, byRole: {} },
      overview: { totalRecords: 0, growthRate: 0 }
    },
    recentData: { visitors: [], meetings: [], messages: [] },
    summary: { totalVisitors: 0, totalMeetings: 0, totalMessages: 0, totalUsers: 0 }
  });
});

// Email test endpoint
app.post('/api/admin/test-email', simpleAuthMiddleware('admin'), async (req, res) => {
  try {
    const result = await emailService.sendTestEmail();
    res.json({
      success: true,
      message: 'Test email sent',
      result
    });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test email',
      error: error.message
    });
  }
});

// Email config check
app.get('/api/admin/email-config', (req, res) => {
  const config = {
    EMAIL_USER: process.env.EMAIL_USER ? 'Set (hidden)' : 'Not set',
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ? 'Set (hidden)' : 'Not set',
    EMAIL_FROM: process.env.EMAIL_FROM || 'Not set',
    EMAIL_ENABLED: process.env.EMAIL_ENABLED || 'false',
    NODE_ENV: process.env.NODE_ENV || 'development'
  };
  
  res.json({
    success: true,
    config,
    instructions: 'To enable email: 1) Enable 2-Step Verification on Google, 2) Generate App Password, 3) Update .env file'
  });
});

// Email logs
app.get('/api/admin/email-logs', simpleAuthMiddleware('admin'), (req, res) => {
  try {
    const emailDir = path.join(__dirname, 'email_logs');
    
    if (!fs.existsSync(emailDir)) {
      return res.json({
        success: true,
        emails: [],
        message: 'No email logs directory found'
      });
    }
    
    const files = fs.readdirSync(emailDir)
      .filter(file => file.endsWith('.txt'))
      .map(file => {
        const filepath = path.join(emailDir, file);
        const content = fs.readFileSync(filepath, 'utf8');
        const dateMatch = content.match(/Date: (.+)/);
        const toMatch = content.match(/To: (.+)/);
        const subjectMatch = content.match(/Subject: (.+)/);
        
        return {
          filename: file,
          date: dateMatch ? dateMatch[1] : 'Unknown',
          to: toMatch ? toMatch[1] : 'Unknown',
          subject: subjectMatch ? subjectMatch[1] : 'No subject',
          preview: content.substring(0, 200) + (content.length > 200 ? '...' : ''),
          fullContent: content
        };
      })
      .sort((a, b) => b.date.localeCompare(a.date));
    
    res.json({
      success: true,
      emails: files,
      count: files.length,
      directory: emailDir
    });
    
  } catch (error) {
    console.error('Error reading email logs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to read email logs',
      error: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Simple backend server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Resume download: http://localhost:${PORT}/api/resume`);
  console.log(`Email logs: http://localhost:${PORT}/api/admin/email-logs`);
  console.log('\nEmail Configuration:');
  console.log('- EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Not set');
  console.log('- EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'Set (length: ' + process.env.EMAIL_PASSWORD.length + ')' : 'Not set');
  console.log('- EMAIL_ENABLED:', process.env.EMAIL_ENABLED || 'false');
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.log('\n⚠️ Email credentials not configured. Emails will be logged to file only.');
    console.log('   To fix: Add Gmail credentials to .env file');
  } else {
    console.log('\n✅ Email credentials configured. Emails will be sent to Gmail.');
  }
});