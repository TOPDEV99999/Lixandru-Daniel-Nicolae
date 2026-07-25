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
export declare class EmailService {
    private recipientEmail;
    /**
     * Send an email using Nodemailer with Gmail
     */
    sendEmail(options: EmailOptions): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Send notification for new contact message
     */
    sendContactMessageNotification(data: ContactMessageEmailData): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Send notification for new meeting request
     */
    sendMeetingRequestNotification(data: MeetingRequestEmailData): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Send test email
     */
    sendTestEmail(): Promise<{
        success: boolean;
        message: string;
    }>;
}
export declare const emailService: EmailService;
export default emailService;
//# sourceMappingURL=emailService.d.ts.map