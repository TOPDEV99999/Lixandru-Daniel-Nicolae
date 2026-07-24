const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useEffect, useRef } from "react";

export default function useVisitorTracking() {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    const track = async () => {
      try {
        await db.functions.invoke("trackVisit", {});
      } catch {
        // Silent fail — tracking is non-critical
      }
    };

    const timer = setTimeout(track, 2000);
    return () => clearTimeout(timer);
  }, []);
}