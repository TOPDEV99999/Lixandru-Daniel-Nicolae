"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactUpdateSchema = exports.contactMessageSchema = void 0;
const zod_1 = require("zod");
// IP address regex patterns
const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
exports.contactMessageSchema = zod_1.z.object({
    // Accept both fullName (backend) and full_name (frontend) field names
    fullName: zod_1.z.string().min(2, 'Full name must be at least 2 characters').max(100, 'Full name must be less than 100 characters').optional(),
    full_name: zod_1.z.string().min(2, 'Full name must be at least 2 characters').max(100, 'Full name must be less than 100 characters').optional(),
    email: zod_1.z.string().email('Invalid email address'),
    message: zod_1.z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message must be less than 2000 characters'),
    visitorIp: zod_1.z.string()
        .refine((val) => !val || ipv4Regex.test(val) || ipv6Regex.test(val), 'Invalid IP address format')
        .max(45, 'IP address too long')
        .optional(),
    browser: zod_1.z.string().max(200, 'Browser info too long').optional(),
    country: zod_1.z.string().max(100, 'Country name too long').optional(),
    userId: zod_1.z.string().cuid().optional(),
}).refine((data) => data.fullName || data.full_name, {
    message: 'Full name is required',
    path: ['fullName']
});
exports.contactUpdateSchema = zod_1.z.object({
    status: zod_1.z.enum(['new', 'read', 'archived']).optional(),
    userId: zod_1.z.string().cuid().optional(),
});
//# sourceMappingURL=contactValidation.js.map