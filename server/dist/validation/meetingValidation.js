"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.meetingResponseSchema = exports.meetingUpdateSchema = exports.meetingRequestSchema = void 0;
const zod_1 = require("zod");
// IP address regex patterns
const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
exports.meetingRequestSchema = zod_1.z.object({
    customerName: zod_1.z.string().min(2, 'Customer name must be at least 2 characters').max(100, 'Customer name must be less than 100 characters'),
    email: zod_1.z.string().email('Invalid email address'),
    company: zod_1.z.string().max(100, 'Company name too long').optional(),
    meetingTopic: zod_1.z.string().min(5, 'Meeting topic must be at least 5 characters').max(200, 'Meeting topic must be less than 200 characters'),
    requestedDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    requestedTime: zod_1.z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
    notes: zod_1.z.string().max(1000, 'Notes must be less than 1000 characters').optional(),
    visitorIp: zod_1.z.string()
        .refine((val) => !val || ipv4Regex.test(val) || ipv6Regex.test(val), 'Invalid IP address format')
        .max(45, 'IP address too long')
        .optional(),
    browser: zod_1.z.string().max(200, 'Browser info too long').optional(),
    country: zod_1.z.string().max(100, 'Country name too long').optional(),
    userId: zod_1.z.string().cuid().optional(),
});
exports.meetingUpdateSchema = zod_1.z.object({
    status: zod_1.z.enum(['pending', 'accepted', 'rejected', 'completed']).optional(),
    acceptedDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
    acceptedTime: zod_1.z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format').optional(),
    meetLink: zod_1.z.string().url('Invalid meeting link').max(500, 'Meeting link too long').optional(),
    adminMessage: zod_1.z.string().max(1000, 'Admin message too long').optional(),
    adminNotes: zod_1.z.string().max(1000, 'Admin notes too long').optional(),
    userId: zod_1.z.string().cuid().optional(),
});
exports.meetingResponseSchema = zod_1.z.object({
    status: zod_1.z.enum(['accepted', 'rejected']),
    acceptedDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
    acceptedTime: zod_1.z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format').optional(),
    meetLink: zod_1.z.string().url('Invalid meeting link').max(500, 'Meeting link too long').optional(),
    adminMessage: zod_1.z.string().max(1000, 'Admin message too long').optional(),
});
//# sourceMappingURL=meetingValidation.js.map