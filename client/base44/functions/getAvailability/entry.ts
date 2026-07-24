const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { date } = body;

    if (!date) {
      return Response.json({ error: 'Date is required' }, { status: 400 });
    }

    const meetings = await db.asServiceRole.entities.MeetingRequest.filter({
      requested_date: date,
      status: { $in: ['pending', 'accepted'] }
    });

    const bookedSlots = meetings.map(m => m.requested_time);

    return Response.json({ booked_slots: bookedSlots });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});