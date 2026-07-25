import { z } from 'zod';
export declare const contactMessageSchema: z.ZodObject<{
    fullName: z.ZodOptional<z.ZodString>;
    full_name: z.ZodOptional<z.ZodString>;
    email: z.ZodString;
    message: z.ZodString;
    visitorIp: z.ZodOptional<z.ZodString>;
    browser: z.ZodOptional<z.ZodString>;
    country: z.ZodOptional<z.ZodString>;
    userId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const contactUpdateSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<{
        new: "new";
        read: "read";
        archived: "archived";
    }>>;
    userId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ContactMessageInput = z.infer<typeof contactMessageSchema>;
export type ContactUpdateInput = z.infer<typeof contactUpdateSchema>;
//# sourceMappingURL=contactValidation.d.ts.map