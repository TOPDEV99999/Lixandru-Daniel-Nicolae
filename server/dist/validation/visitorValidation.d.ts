import { z } from 'zod';
export declare const visitorSchema: z.ZodObject<{
    visitorId: z.ZodString;
    email: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    name: z.ZodOptional<z.ZodString>;
    country: z.ZodOptional<z.ZodString>;
    browser: z.ZodOptional<z.ZodString>;
    device: z.ZodOptional<z.ZodString>;
    os: z.ZodOptional<z.ZodString>;
    visitorIp: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const visitorUpdateSchema: z.ZodObject<{
    visitCount: z.ZodOptional<z.ZodNumber>;
    email: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    country: z.ZodOptional<z.ZodString>;
    browser: z.ZodOptional<z.ZodString>;
    device: z.ZodOptional<z.ZodString>;
    os: z.ZodOptional<z.ZodString>;
    visitorIp: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type VisitorInput = z.infer<typeof visitorSchema>;
export type VisitorUpdateInput = z.infer<typeof visitorUpdateSchema>;
//# sourceMappingURL=visitorValidation.d.ts.map