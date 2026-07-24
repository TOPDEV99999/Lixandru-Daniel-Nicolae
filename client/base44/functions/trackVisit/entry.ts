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

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const visitorIp = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() ||
                      req.headers.get('cf-connecting-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const country = req.headers.get('cf-ipcountry') || 'unknown';
    const browser = parseBrowser(userAgent);
    const os = parseOS(userAgent);
    const device = parseDevice(userAgent);

    const visitorId = visitorIp + '_' + os;
    const existing = await db.asServiceRole.entities.Visitor.filter(
      { visitor_id: visitorId }, '-updated_date', 1
    );

    if (existing.length > 0) {
      await db.asServiceRole.entities.Visitor.update(existing[0].id, {
        country,
        browser,
        device,
        os,
        visit_count: (existing[0].visit_count || 1) + 1
      });
    } else {
      await db.asServiceRole.entities.Visitor.create({
        visitor_id: visitorId,
        country,
        browser,
        device,
        os,
        visitor_ip: visitorIp,
        visit_count: 1
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});