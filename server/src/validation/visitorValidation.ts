import { z } from 'zod';

// IP address regex patterns
const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;

export const visitorSchema = z.object({
  visitorId: z.string().min(1, 'Visitor ID is required').max(100, 'Visitor ID too long'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  name: z.string().max(100, 'Name too long').optional(),
  country: z.string().max(100, 'Country name too long').optional(),
  browser: z.string().max(200, 'Browser info too long').optional(),
  device: z.string().max(100, 'Device info too long').optional(),
  os: z.string().max(100, 'OS info too long').optional(),
  visitorIp: z.string()
    .refine((val) => !val || ipv4Regex.test(val) || ipv6Regex.test(val), 'Invalid IP address format')
    .max(45, 'IP address too long')
    .optional(),
});

export const visitorUpdateSchema = z.object({
  visitCount: z.number().int().positive('Visit count must be positive').optional(),
  email: z.string().email('Invalid email address').optional(),
  name: z.string().max(100, 'Name too long').optional(),
  country: z.string().max(100, 'Country name too long').optional(),
  browser: z.string().max(200, 'Browser info too long').optional(),
  device: z.string().max(100, 'Device info too long').optional(),
  os: z.string().max(100, 'OS info too long').optional(),
  visitorIp: z.string()
    .refine((val) => !val || ipv4Regex.test(val) || ipv6Regex.test(val), 'Invalid IP address format')
    .max(45, 'IP address too long')
    .optional(),
});

export type VisitorInput = z.infer<typeof visitorSchema>;
export type VisitorUpdateInput = z.infer<typeof visitorUpdateSchema>;