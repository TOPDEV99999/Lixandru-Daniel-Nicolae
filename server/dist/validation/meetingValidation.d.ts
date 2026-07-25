import { z } from 'zod';
export declare const meetingRequestSchema: z.ZodObject<{
    customerName: z.ZodString;
    email: z.ZodString;
    company: z.ZodOptional<z.ZodString>;
    meetingTopic: z.ZodString;
    requestedDate: z.ZodString;
    requestedTime: z.ZodString;
    notes: z.ZodOptional<z.ZodString>;
    visitorIp: z.ZodOptional<z.ZodString>;
    browser: z.ZodOptional<z.ZodString>;
    country: z.ZodOptional<z.ZodString>;
    userId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const meetingUpdateSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<{
        pending: "pending";
        accepted: "accepted";
        rejected: "rejected";
        completed: "completed";
    }>>;
    acceptedDate: z.ZodOptional<z.ZodString>;
    acceptedTime: z.ZodOptional<z.ZodString>;
    meetLink: z.ZodOptional<z.ZodString>;
    adminMessage: z.ZodOptional<z.ZodString>;
    adminNotes: z.ZodOptional<z.ZodString>;
    userId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const meetingResponseSchema: z.ZodObject<{
    status: z.ZodEnum<{
        accepted: "accepted";
        rejected: "rejected";
    }>;
    acceptedDate: z.ZodOptional<z.ZodString>;
    acceptedTime: z.ZodOptional<z.ZodString>;
    meetLink: z.ZodOptional<z.ZodString>;
    adminMessage: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type MeetingRequestInput = z.infer<typeof meetingRequestSchema>;
export type MeetingUpdateInput = z.infer<typeof meetingUpdateSchema>;
export type MeetingResponseInput = z.infer<typeof meetingResponseSchema>;
//# sourceMappingURL=meetingValidation.d.ts.map