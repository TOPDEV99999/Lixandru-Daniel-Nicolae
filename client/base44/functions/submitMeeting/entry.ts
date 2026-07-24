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

function parseOS(ua) {
  if (/Windows NT 10/.test(ua)) return 'Windows';
  if (/Windows NT/.test(ua)) return 'Windows';
  if (/Mac OS X/.test(ua)) return 'macOS';
  if (/Android/.test(ua)) return 'Android';
  if (/iPhone|iPad|iPod/.test(ua)) return 'iOS';
  if (/Linux/.test(ua)) return 'Linux';
  return 'Unknown';
}

function parseDevice(ua) {
  if (/iPad|Tablet/.test(ua)) return 'Tablet';
  if (/Mobile|Android|iPhone/.test(ua)) return 'Mobile';
  return 'Desktop';
}

function sanitize(str) {
  return String(str || '').replace(/<[^>]*>/g, '').trim();
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { customer_name, email, company, meeting_topic, requested_date, requested_time, notes } = body;

    if (!customer_name || !email || !meeting_topic || !requested_date || !requested_time) {
      return Response.json({ error: 'Required fields are missing' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    const visitorIp = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() ||
                      req.headers.get('cf-connecting-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const country = req.headers.get('cf-ipcountry') || 'unknown';
    const browser = parseBrowser(userAgent);
    const os = parseOS(userAgent);
    const device = parseDevice(userAgent);

    // Rate limiting
    const recent = await db.asServiceRole.entities.MeetingRequest.filter(
      { visitor_ip: visitorIp }, '-created_date', 5
    );
    const oneHourAgo = Date.now() - 3600000;
    const recentCount = recent.filter(m => new Date(m.created_date).getTime() > oneHourAgo).length;
    if (recentCount >= 3) {
      return Response.json({ error: 'Rate limit exceeded. Please try again later.' }, { status: 429 });
    }

    // Prevent double-booking
    const existing = await db.asServiceRole.entities.MeetingRequest.filter({
      requested_date: requested_date,
      requested_time: requested_time,
      status: { $in: ['pending', 'accepted'] }
    });
    if (existing.length > 0) {
      return Response.json({ error: 'This time slot is already booked. Please select another time.' }, { status: 409 });
    }

    const record = await db.asServiceRole.entities.MeetingRequest.create({
      customer_name: sanitize(customer_name),
      email: sanitize(email),
      company: sanitize(company),
      meeting_topic: sanitize(meeting_topic),
      requested_date,
      requested_time,
      notes: sanitize(notes),
      visitor_ip: visitorIp,
      browser,
      country,
      status: 'pending'
    });

    // Track/update visitor
    const visitorId = visitorIp + '_' + os;
    const existingVisitor = await db.asServiceRole.entities.Visitor.filter({ visitor_id: visitorId }, '-updated_date', 1);
    if (existingVisitor.length > 0) {
      await db.asServiceRole.entities.Visitor.update(existingVisitor[0].id, {
        email: sanitize(email),
        name: sanitize(customer_name),
        country,
        browser,
        device,
        os,
        visit_count: (existingVisitor[0].visit_count || 1) + 1
      });
    } else {
      await db.asServiceRole.entities.Visitor.create({
        visitor_id: visitorId,
        email: sanitize(email),
        name: sanitize(customer_name),
        country,
        browser,
        device,
        os,
        visitor_ip: visitorIp,
        visit_count: 1
      });
    }

    const emailBody = `New meeting request received.

---------------------------------------------------------

Name: ${sanitize(customer_name)}
Gmail: ${sanitize(email)}
Company: ${sanitize(company) || 'N/A'}

---------------------------------------------------------

Meeting Topic: ${sanitize(meeting_topic)}
Requested Date: ${requested_date}
Requested Time: ${requested_time}

Notes: ${sanitize(notes) || 'N/A'}

---------------------------------------------------------

Visitor IP: ${visitorIp}
Browser: ${browser}
Country: ${country}
OS: ${os}
Device: ${device}`;

    let emailSent = false;
    try {
      await db.asServiceRole.integrations.Core.SendEmail({
        to: 'uhajucewog80@gmail.com',
        subject: `New Meeting Request from ${sanitize(customer_name)}`,
        body: emailBody
      });
      emailSent = true;
    } catch (e) {
      // Admin may not be registered
    }

    return Response.json({ success: true, id: record.id, email_sent: emailSent });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});