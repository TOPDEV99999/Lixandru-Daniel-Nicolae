const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

function parseBrowser(ua) {
  if (/Edg\//.test(ua)) return 'Edge';
  if (/OPR\//.test(ua)) return 'Opera';
  if (/Chrome\//.test(ua) && !/Chromium/.test(ua)) return 'Chrome';
  if (/Firefox\//.test(ua)) return 'Firefox';
  if (/Safari\//.test(ua) && !/Chrome/.test(ua)) return 'Safari';
  return 'Unknown';
}

function sanitize(str) {
  return String(str).replace(/<[^>]*>/g, '').trim();
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { full_name, email, message } = body;

    if (!full_name || !email || !message) {
      return Response.json({ error: 'All fields are required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    const cleanName = sanitize(full_name);
    const cleanEmail = sanitize(email);
    const cleanMessage = sanitize(message);

    const visitorIp = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() ||
                      req.headers.get('cf-connecting-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const country = req.headers.get('cf-ipcountry') || 'unknown';
    const browser = parseBrowser(userAgent);

    const recent = await db.asServiceRole.entities.ContactMessage.filter(
      { visitor_ip: visitorIp }, '-created_date', 5
    );
    const oneHourAgo = Date.now() - 3600000;
    const recentCount = recent.filter(m => new Date(m.created_date).getTime() > oneHourAgo).length;
    if (recentCount >= 3) {
      return Response.json({ error: 'Rate limit exceeded. Please try again later.' }, { status: 429 });
    }

    const record = await db.asServiceRole.entities.ContactMessage.create({
      full_name: cleanName,
      email: cleanEmail,
      message: cleanMessage,
      visitor_ip: visitorIp,
      browser,
      country,
      status: 'new'
    });

    const emailBody = `A new customer inquiry has arrived.

---------------------------------------------------------

Name:
${cleanName}

Gmail:
${cleanEmail}

---------------------------------------------------------

Message

${cleanMessage}

---------------------------------------------------------

Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}
Visitor IP: ${visitorIp}
Browser: ${browser}
Country: ${country}`;

    let emailSent = false;
    try {
      await db.asServiceRole.integrations.Core.SendEmail({
        to: 'uhajucewog80@gmail.com',
        subject: `New Contact Form Submission from ${cleanName}`,
        body: emailBody
      });
      emailSent = true;
    } catch (e) {
      // Admin may not be registered; record still saved
    }

    return Response.json({ success: true, id: record.id, email_sent: emailSent });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});