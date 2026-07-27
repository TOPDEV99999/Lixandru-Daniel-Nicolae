import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export class EmailService {
  static async sendEmail({ to, subject, html, text, from = 'Acme <onboarding@resend.dev>' }: EmailOptions) {
    try {
      console.log(`Sending email to: ${to}, subject: ${subject}`);
      
      const { data, error } = await resend.emails.send({
        from,
        to: [to],
        subject,
        html,
        text,
      });

      if (error) {
        console.error('Error sending email:', error);
        throw error;
      }

      console.log('Email sent successfully:', data);
      return { success: true, data };
    } catch (error) {
      console.error('Failed to send email:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Send meeting acceptance email
  static async sendMeetingAcceptanceEmail(
    to: string,
    customerName: string,
    meetingTopic: string,
    date: string,
    time: string,
    meetLink?: string,
    adminMessage?: string
  ) {
    const subject = `Meeting Accepted: ${meetingTopic}`;
    
    let html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Meeting Accepted!</h2>
        <p>Dear ${customerName},</p>
        <p>Your meeting request has been accepted!</p>
        
        <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <h3 style="color: #1f2937; margin-top: 0;">Meeting Details:</h3>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${time}</p>
          <p><strong>Topic:</strong> ${meetingTopic}</p>
          ${meetLink ? `<p><strong>Meeting Link:</strong> <a href="${meetLink}" style="color: #2563eb;">${meetLink}</a></p>` : ''}
        </div>
        
        ${adminMessage ? `
        <div style="background-color: #dbeafe; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <h4 style="color: #1e40af; margin-top: 0;">Additional Message:</h4>
          <p>${adminMessage.replace(/\n/g, '<br>')}</p>
        </div>
        ` : ''}
        
        <p>Please let me know if this time works for you or if you need to reschedule.</p>
        <p>Best regards,<br>Lixandru Daniel</p>
      </div>
    `;

    const text = `Dear ${customerName},\n\nYour meeting request has been accepted!\n\nMeeting Details:\n- Date: ${date}\n- Time: ${time}\n- Topic: ${meetingTopic}\n${meetLink ? `- Meeting Link: ${meetLink}\n` : ''}\n${adminMessage ? `Additional Message:\n${adminMessage}\n\n` : ''}Please let me know if this time works for you or if you need to reschedule.\n\nBest regards,\nLixandru Daniel`;

    return this.sendEmail({ to, subject, html, text });
  }

  // Send meeting rejection email
  static async sendMeetingRejectionEmail(
    to: string,
    customerName: string,
    meetingTopic: string,
    requestedDate: string,
    requestedTime: string
  ) {
    const subject = `Meeting Request Update: ${meetingTopic}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Meeting Request Update</h2>
        <p>Dear ${customerName},</p>
        <p>Thank you for your meeting request. Unfortunately, I'm unable to schedule a meeting at this time due to scheduling constraints.</p>
        
        <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <h3 style="color: #1f2937; margin-top: 0;">Your Request:</h3>
          <p><strong>Topic:</strong> ${meetingTopic}</p>
          <p><strong>Requested Date:</strong> ${requestedDate}</p>
          <p><strong>Requested Time:</strong> ${requestedTime}</p>
        </div>
        
        <p>I appreciate your interest and hope we can connect in the future. Please feel free to submit another request at a later date.</p>
        <p>Best regards,<br>Lixandru Daniel</p>
      </div>
    `;

    const text = `Dear ${customerName},\n\nThank you for your meeting request. Unfortunately, I'm unable to schedule a meeting at this time due to scheduling constraints.\n\nYour Request:\n- Topic: ${meetingTopic}\n- Requested Date: ${requestedDate}\n- Requested Time: ${requestedTime}\n\nI appreciate your interest and hope we can connect in the future. Please feel free to submit another request at a later date.\n\nBest regards,\nLixandru Daniel`;

    return this.sendEmail({ to, subject, html, text });
  }

  // Send contact reply email
  static async sendContactReplyEmail(
    to: string,
    customerName: string,
    replyContent: string,
    originalMessage?: string
  ) {
    const subject = `Re: Your message`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Reply to Your Message</h2>
        <p>Dear ${customerName},</p>
        
        ${originalMessage ? `
        <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <h4 style="color: #1f2937; margin-top: 0;">Your Original Message:</h4>
          <p>${originalMessage.replace(/\n/g, '<br>')}</p>
        </div>
        ` : ''}
        
        <div style="background-color: #dbeafe; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <h4 style="color: #1e40af; margin-top: 0;">My Reply:</h4>
          <p>${replyContent.replace(/\n/g, '<br>')}</p>
        </div>
        
        <p>Best regards,<br>Lixandru Daniel</p>
      </div>
    `;

    const text = `Dear ${customerName},\n\n${originalMessage ? `Your Original Message:\n${originalMessage}\n\n` : ''}My Reply:\n${replyContent}\n\nBest regards,\nLixandru Daniel`;

    return this.sendEmail({ to, subject, html, text });
  }
}