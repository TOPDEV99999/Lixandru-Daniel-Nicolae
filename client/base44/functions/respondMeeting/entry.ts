const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await db.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { meeting_id, action, accepted_date, accepted_time, meet_link, admin_message, admin_notes } = body;

    if (!meeting_id || !action) {
      return Response.json({ error: 'Meeting ID and action are required' }, { status: 400 });
    }

    const meeting = await db.asServiceRole.entities.MeetingRequest.get(meeting_id);
    if (!meeting) {
      return Response.json({ error: 'Meeting not found' }, { status: 404 });
    }

    const updates = { status: action };
    if (admin_notes !== undefined) updates.admin_notes = admin_notes;

    let emailBody = '';
    let emailSubject = '';

    if (action === 'accepted') {
      updates.accepted_date = accepted_date || meeting.requested_date;
      updates.accepted_time = accepted_time || meeting.requested_time;
      updates.meet_link = meet_link || '';
      updates.admin_message = admin_message || '';

      emailSubject = `Meeting Confirmation - ${updates.accepted_date} at ${updates.accepted_time}`;
      emailBody = `Hello ${meeting.customer_name},

Thank you for your interest.

I have accepted your meeting request.

Meeting Details

Date:
${updates.accepted_date}

Time:
${updates.accepted_time} (UTC)

Google Meet:
${meet_link || 'Link will be provided shortly'}

${admin_message ? 'Additional message:\n' + admin_message + '\n' : ''}
Looking forward to speaking with you.

Best regards,

Daniel Lixandru`;
    } else if (action === 'rejected') {
      emailSubject = 'Update on Your Meeting Request';
      emailBody = `Hello ${meeting.customer_name},

Thank you for your interest in scheduling a meeting.

Unfortunately, I am unable to schedule a meeting at the requested time. This could be due to a scheduling conflict or the selected time slot being unavailable.

Please feel free to submit a new meeting request with alternative dates and times, and I will do my best to accommodate you.

Best regards,

Daniel Lixandru`;
    }

    await db.asServiceRole.entities.MeetingRequest.update(meeting_id, updates);

    let emailSent = false;
    if (emailBody) {
      try {
        await db.asServiceRole.integrations.Core.SendEmail({
          to: meeting.email,
          subject: emailSubject,
          body: emailBody
        });
        emailSent = true;
      } catch (e) {
        // Customer may not be a registered user
      }
    }

    return Response.json({ success: true, email_sent: emailSent, email_body: emailBody, email_subject: emailSubject });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});