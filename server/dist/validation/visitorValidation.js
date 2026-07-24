"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.visitorUpdateSchema = exports.visitorSchema = void 0;
const zod_1 = require("zod");
// IP address regex patterns
const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
exports.visitorSchema = zod_1.z.object({
    visitorId: zod_1.z.string().min(1, 'Visitor ID is required').max(100, 'Visitor ID too long'),
    email: zod_1.z.string().email('Invalid email address').optional().or(zod_1.z.literal('')),
    name: zod_1.z.string().max(100, 'Name too long').optional(),
    country: zod_1.z.string().max(100, 'Country name too long').optional(),
    browser: zod_1.z.string().max(200, 'Browser info too long').optional(),
    device: zod_1.z.string().max(100, 'Device info too long').optional(),
    os: zod_1.z.string().max(100, 'OS info too long').optional(),
    visitorIp: zod_1.z.string()
        .refine((val) => !val || ipv4Regex.test(val) || ipv6Regex.test(val), 'Invalid IP address format')
        .max(45, 'IP address too long')
        .optional(),
});
exports.visitorUpdateSchema = zod_1.z.object({
    visitCount: zod_1.z.number().int().positive('Visit count must be positive').optional(),
    email: zod_1.z.string().email('Invalid email address').optional(),
    name: zod_1.z.string().max(100, 'Name too long').optional(),
    country: zod_1.z.string().max(100, 'Country name too long').optional(),
    browser: zod_1.z.string().max(200, 'Browser info too long').optional(),
    device: zod_1.z.string().max(100, 'Device info too long').optional(),
    os: zod_1.z.string().max(100, 'OS info too long').optional(),
    visitorIp: zod_1.z.string()
        .refine((val) => !val || ipv4Regex.test(val) || ipv6Regex.test(val), 'Invalid IP address format')
        .max(45, 'IP address too long')
        .optional(),
});
//# sourceMappingURL=visitorValidation.js.map