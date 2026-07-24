const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await db.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const visitors = await db.asServiceRole.entities.Visitor.list('-updated_date', 500);
    const meetings = await db.asServiceRole.entities.MeetingRequest.list('-created_date', 500);
    const messages = await db.asServiceRole.entities.ContactMessage.list('-created_date', 500);

    return Response.json({ visitors, meetings, messages });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});