const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, X, Send, RotateCcw, Minimize2, Maximize2,
  Briefcase, Bot, Rocket, Cloud, Container, FolderOpen, FileText, Mail as MailIcon, Copy, Check, Users, MessageSquare, Calendar
} from "lucide-react";
import ReactMarkdown from "react-markdown";

import { resumeData } from "@/data/resume";

const faqSuggestions = [
  { icon: Briefcase, text: "Tell me about yourself", emoji: "💼" },
  { icon: Bot, text: "Show your AI projects", emoji: "🤖" },
  { icon: Rocket, text: "What technologies do you use?", emoji: "🚀" },
  { icon: Cloud, text: "Do you have AWS experience?", emoji: "☁️" },
  { icon: Container, text: "Have you used Docker?", emoji: "🐳" },
  { icon: FolderOpen, text: "Show your best project", emoji: "📂" },
  { icon: FileText, text: "Can I download your resume?", emoji: "📄" },
  { icon: MailIcon, text: "How can I contact you?", emoji: "📬" },
];

function formatTime(ts) {
  if (!ts) return "";
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Copy code">
      {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex justify-start mb-4"
    >
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
        </div>
        <div className="glass rounded-2xl rounded-tl-md px-4 py-3.5 border border-border">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 rounded-full bg-secondary/70 animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MessageBubble({ message }) {
  const isUser = message.role === "user";

  // Smart actions from LLM tokens (triggers when streaming completes)
  useEffect(() => {
    if (!isUser && message.content && !message.streaming) {
      const lower = message.content.toLowerCase();
      if (lower.includes("[download_resume]")) window.open(resumeData.resumeUrl, "_blank");
      if (lower.includes("[open_github]")) window.open(resumeData.socials.github, "_blank");
      if (lower.includes("[open_linkedin]")) window.open(resumeData.socials.linkedin, "_blank");
      if (lower.includes("[scroll_contact]")) document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
      if (lower.includes("[scroll_projects]")) document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
      if (lower.includes("[scroll_skills]")) document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" });
      if (lower.includes("[scroll_experience]")) document.getElementById("experience")?.scrollIntoView({ behavior: "smooth" });
      if (lower.includes("[scroll_ai]")) document.getElementById("ai")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [message.content, isUser, message.streaming]);

  // Strip action tokens from display
  const displayContent = (message.content || "")
    .replace(/\[download_resume\]/gi, "")
    .replace(/\[open_github\]/gi, "")
    .replace(/\[open_linkedin\]/gi, "")
    .replace(/\[scroll_\w+\]/gi, "")
    .trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div className={`flex ${isUser ? "flex-row-reverse" : "flex-row"} items-end gap-2.5 max-w-[88%]`}>
        {!isUser && (
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0 mb-5">
            <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
        )}

        <div className={`min-w-0 ${isUser ? "items-end" : "items-start"} flex flex-col`}>
          <div
            className={`rounded-2xl px-4 py-3 ${
              isUser
                ? "bg-primary/10 border border-primary/20 rounded-br-md"
                : "glass border border-border rounded-tl-md"
            }`}
          >
            {isUser ? (
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">{displayContent}</p>
            ) : (
              <div className="text-sm prose-dark">
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const text = String(children).replace(/\n$/, "");
                      if (!inline) {
                        return (
                          <div className="relative my-2.5 group/code">
                            <div className="absolute top-1.5 right-1.5 z-10 opacity-0 group-hover/code:opacity-100 transition-opacity">
                              <CopyButton text={text} />
                            </div>
                            <pre className="bg-muted border border-border rounded-lg p-3 pt-8 overflow-x-auto">
                              <code className="text-xs font-mono text-foreground" {...props}>{children}</code>
                            </pre>
                          </div>
                        );
                      }
                      return <code className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-xs font-mono" {...props}>{children}</code>;
                    },
                    p({ children }) { return <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>; },
                    ul({ children }) { return <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>; },
                    ol({ children }) { return <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>; },
                    strong({ children }) { return <strong className="text-foreground font-semibold">{children}</strong>; },
                    a({ href, children }) { return <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{children}</a>; },
                    h1({ children }) { return <h1 className="text-base font-bold text-foreground mb-2">{children}</h1>; },
                    h2({ children }) { return <h2 className="text-sm font-bold text-foreground mb-2">{children}</h2>; },
                    h3({ children }) { return <h3 className="text-sm font-semibold text-foreground mb-1">{children}</h3>; },
                    blockquote({ children }) { return <blockquote className="border-l-2 border-secondary/40 pl-3 text-muted-foreground italic mb-2">{children}</blockquote>; },
                    hr() { return <hr className="border-border my-3" />; },
                  }}
                >
                  {displayContent}
                </ReactMarkdown>
                {message.streaming && (
                  <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-0.5 align-middle" />
                )}
              </div>
            )}
          </div>

          <span className="text-[10px] text-muted-foreground/60 mt-1 px-1 font-mono">
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function NovaAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const streamRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, isLoading, scrollToBottom]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMinimized]);

  useEffect(() => {
    return () => { if (streamRef.current) clearInterval(streamRef.current); };
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const detectSmartAction = (text) => {
    const lower = text.toLowerCase();
    const has = (...keywords) => keywords.some((k) => lower.includes(k));

    if (has("download resume", "download my resume", "download cv", "get resume", "get my resume")) {
      window.open(resumeData.resumeUrl, "_blank");
    }
    if (has("open github", "show github", "see github", "your github", "go to github")) {
      window.open(resumeData.socials.github, "_blank");
    }
    if (has("open linkedin", "show linkedin", "see linkedin", "your linkedin", "go to linkedin")) {
      window.open(resumeData.socials.linkedin, "_blank");
    }
    if (has("contact", "reach you", "get in touch", "email you", "how can i contact")) {
      scrollToSection("contact");
    }
    if (has("ai project", "ai section", "artificial intelligence section", "show ai", "ai work")) {
      scrollToSection("ai");
    } else if (has("show project", "see project", "your project", "go to project", "view project", "portfolio")) {
      scrollToSection("projects");
    }
    if (has("show skill", "see skill", "your skill", "go to skill", "tech stack", "what technologies", "your tech")) {
      scrollToSection("skills");
    }
    if (has("show experience", "see experience", "your experience", "go to experience", "work history", "career")) {
      scrollToSection("experience");
    }
  };

  const streamResponse = (fullResponse) => {
    const tokens = fullResponse.match(/\S+\s*/g) || [fullResponse];
    let index = 0;

    setMessages(prev => [...prev, { role: "assistant", content: "", timestamp: Date.now(), streaming: true }]);

    streamRef.current = setInterval(() => {
      if (index >= tokens.length) {
        clearInterval(streamRef.current);
        streamRef.current = null;
        setMessages(prev => prev.map((m, i) =>
          i === prev.length - 1 ? { ...m, streaming: false } : m
        ));
        setIsLoading(false);
        return;
      }
      index += 2;
      const partial = tokens.slice(0, Math.min(index, tokens.length)).join("");
      setMessages(prev => prev.map((m, i) =>
        i === prev.length - 1 ? { ...m, content: partial } : m
      ));
    }, 20);
  };

  const handleDataQuery = async (query) => {
    const userMessage = { role: "user", content: query, timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Try to fetch backend data
      const isAuth = await db.auth.isAuthenticated();
      const user = isAuth ? await db.auth.me() : null;
      const isAdmin = user?.role === 'admin';
      
      let backendStats = '';
      let hasBackendAccess = false;
      
      if (isAdmin) {
        try {
          const response = await db.functions.invoke("getAdminData", {});
          const data = response.data || { visitors: [], meetings: [], messages: [] };
          
          backendStats = `
📊 **Portfolio Backend Statistics (Live Data)**:
- **Total Visitors**: ${data.visitors?.length || 0}
- **Total Meetings**: ${data.meetings?.length || 0} (Pending: ${data.meetings?.filter(m => m.status === 'pending').length || 0})
- **Total Messages**: ${data.messages?.length || 0} (New: ${data.messages?.filter(m => m.status === 'new').length || 0})

**Recent Activity**:
- Recent Visitors: ${Math.min(data.visitors?.length || 0, 5)} visitors
- Recent Meetings: ${Math.min(data.meetings?.filter(m => m.status === 'pending').length || 0, 5)} pending requests
- Recent Messages: ${Math.min(data.messages?.filter(m => m.status === 'new').length || 0, 5)} new messages
          `;
          hasBackendAccess = true;
        } catch (error) {
          console.error("Backend data fetch error:", error);
          backendStats = "\n(Note: Backend data currently unavailable. The local backend may not be running.)";
        }
      } else {
        backendStats = "\n(Note: Admin access required to view detailed statistics. Please login as admin.)";
      }
      
      // Prepare response
      let responseText = "";
      
      if (isAdmin && hasBackendAccess) {
        responseText = "🔐 **Admin Access Granted**\n\n";
        responseText += "I can access real-time backend data from your portfolio:\n";
        responseText += backendStats.split('\n').slice(2, 6).join('\n');
        responseText += "\n\n🔗 **Quick Links:**";
        responseText += "\n- View detailed analytics: [Admin Dashboard](/admin)";
        responseText += "\n- Check recent messages: Messages tab";
        responseText += "\n- Review meeting requests: Meetings tab";
        responseText += "\n- Monitor visitor analytics: Visitors tab";
      } else if (isAdmin) {
        responseText = "🔒 **Backend Service Unavailable**\n\n";
        responseText += "You have admin privileges, but the backend data service is currently unavailable.\n";
        responseText += "Please ensure the local backend server is running on port 3001.\n\n";
        responseText += "**To start the backend:**\n";
        responseText += "1. Open a terminal in the project root\n";
        responseText += "2. Run `npm run dev:backend` or `cd server && npm run dev`\n";
        responseText += "3. The backend should start on http://localhost:3001";
      } else {
        responseText = "🔒 **Admin Access Required**\n\n";
        responseText += "You need to be logged in as an administrator to view portfolio statistics.\n";
        responseText += "Contact Daniel for admin access to the dashboard.\n\n";
        responseText += "**For demo purposes, here's sample data:**\n";
        responseText += "- Total Visitors: 1,247\n";
        responseText += "- Total Meetings: 84 (Pending: 12)\n";
        responseText += "- Total Messages: 156 (New: 8)\n\n";
        responseText += "*(Note: These are example numbers. Real data requires admin login.)*";
      }
      
      // Add assistant message
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: responseText, 
        timestamp: Date.now(), 
        streaming: false 
      }]);
      setIsLoading(false);
      
    } catch (error) {
      console.error("Error in data query processing:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "❌ **Error**\n\nSorry, I encountered an error while trying to fetch backend data. Please try again later.", 
        timestamp: Date.now(), 
        streaming: false 
      }]);
      setIsLoading(false);
    }
  };

  const sendMessage = async (text) => {
    if (!text.trim() || isLoading) return;

    if (streamRef.current) {
      clearInterval(streamRef.current);
      streamRef.current = null;
    }

    detectSmartAction(text.trim());

    // Check for backend data queries
    const lowerText = text.toLowerCase();
    const isDataQuery = lowerText.includes("portfolio stats") || 
        lowerText.includes("dashboard data") ||
        lowerText.includes("how many visitors") ||
        lowerText.includes("contact messages") ||
        lowerText.includes("meeting requests") ||
        lowerText.includes("admin data") ||
        lowerText.includes("backend data") ||
        lowerText.includes("statistics");

    if (isDataQuery) {
      await handleDataQuery(text.trim());
      return;
    }
        lowerText.includes("backend data") ||
        lowerText.includes("statistics");

    if (isDataQuery) {
      await handleDataQuery(text.trim());
      return;
    }

    const userMessage = { role: "user", content: text.trim(), timestamp: Date.now() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    let retries = 0;
    const maxRetries = 3;

    while (retries < maxRetries) {
      try {
        const conversationHistory = newMessages.slice(-10).map(m => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`).join("\n");

        const systemPrompt = `You are Nova, Daniel Lixandru's AI Portfolio Assistant. You are professional, friendly, confident, and helpful.

ABOUT DANIEL:
- Full-Stack Software Engineer with 8+ years of experience
- Skills: React, Next.js, Node.js, Python, TypeScript, PHP, Shopify, WooCommerce, AI, Web3, Solidity, Rust, TensorFlow, OpenCV
- Location: Bucharest, Romania
- Email: uhajucewog80@gmail.com
- Education: B.Sc. Computer Science, University of Bucharest (2014-2017)

EXPERIENCE:
1. TechNova Solutions - Senior Full-Stack Developer (Jul 2022 - Present): Led scalable web apps with React/Next.js/Node.js/TypeScript, built RESTful APIs & microservices, integrated AI with Python/OpenAI, optimized performance/security/cloud
2. Digital Commerce Labs - Full-Stack Developer (Jun 2019 - Jun 2022): Shopify/WooCommerce stores, Node.js/Express/Laravel backends, React/Tailwind UIs, payment integrations
3. InnovateX Technologies - Software Engineer (Aug 2016 - May 2019): JavaScript/PHP/Python web apps, REST APIs, MySQL/PostgreSQL/MongoDB, CI/CD pipelines

PROJECTS:
1. DermaIQ - AI skin disease detection with Python/TensorFlow/ML (Jan-May 2024)
2. Face Swap - AI face recognition with Python/OpenCV (Sep-Dec 2023)
3. CryptoCheckmate - Decentralized chess on FlowChain with Next.js/Solidity (Feb-Apr 2024)
4. AI NFT - AI-powered NFT creation & marketplace with Blockchain/HTML (Nov 2023-Jan 2024)
5. KOGAEA - Blockchain fantasy gaming world with React/Solidity (Jul-Oct 2023)
6. Topps - Digital trading cards platform with Python/Blockchain (May-Jul 2023)
7. MERN Ecommerce - Full-stack shopping platform with React/Node/MongoDB (Mar-Aug 2023)
8. Custom Built - Custom PC builder e-commerce with PHP/JavaScript (Mar-May 2023)
9. SEMA - Automotive e-commerce with Shopify/HTML (Jan-Mar 2023)
10. Buzznerd - Trucks e-commerce with WordPress/WooCommerce (Oct-Dec 2022)
11. Neurogym - Cognitive training platform with React/Next.js (Aug-Oct 2022)
12. ChatBot Health Assistant - AI medical chatbot with Python/Django (Jun-Aug 2022)
13. BandieredelMondo - Flag e-commerce with WordPress/WooCommerce (Apr-Jun 2022)
14. Dating Platform - Real-time messaging app with React/Node.js (Sep 2022-Feb 2023)
15. AYANA Bali - Luxury resort website with Adobe Illustrator/HTML (Feb-Apr 2022)
16. Metaverse Expo - 3D virtual trade show with React/Three.js/Socket.io (Dec 2021-Feb 2022)
17. Kaho Enterprise - Enterprise DX & analytics with AWS/PHP (Oct-Dec 2021)
18. Brazilian Style E-commerce - Premium fashion platform (Aug-Oct 2021)
19. Club Ange - Premium dating club with WordPress (Jun-Aug 2021)
20. Booty Fitness - Women's fitness platform with Graphic Design/PHP (Apr-Jun 2021)
21. AI-Powered CRM - Intelligent CRM with React/Next.js/LLM (Feb-Apr 2021)
22. Joie TV Tabi - Solo travel discovery with Adobe Illustrator/PHP (Dec 2020-Feb 2021)
23. FanFan Online - Social discovery platform with Graphic Design/Next.js (Oct-Dec 2020)
24. Fashion E-commerce - Custom Shopify theme (Jan-May 2022)
25. Blinkify - Blockchain dashboard with React/Solidity/Web3 (Jun-Aug 2022)

You can also answer general IT questions naturally — about programming, web development, AI, databases, cloud, best practices, etc.

RULES:
- Never say "I don't know." Instead say "My portfolio doesn't mention that specifically, but based on my experience..."
- Never invent certifications, companies, or projects
- Answer naturally about all technologies Daniel knows
- Keep responses concise but informative
- Use markdown formatting for better readability
- When asked to download resume, include [download_resume] in your response
- When asked about GitHub, include [open_github]
- When asked about LinkedIn, include [open_linkedin]
- When asked to contact, include [scroll_contact]
- When asked about projects, include [scroll_projects]
- When asked about skills, include [scroll_skills]
- When asked about experience, include [scroll_experience]
- When asked about AI section or AI projects to view, include [scroll_ai]
- These action tokens will be hidden from display but trigger UI actions`;

        const response = await db.integrations.Core.InvokeLLM({
          prompt: `${systemPrompt}\n\nConversation so far:\n${conversationHistory}\n\nRespond to the latest user message naturally and helpfully.`,
          model: "automatic"
        });

        streamResponse(response);
        return;
      } catch (err) {
        retries++;
        if (retries >= maxRetries) {
          setMessages(prev => [...prev, { role: "assistant", content: "⚠️ AI service is temporarily busy. Please try again in a few moments.", timestamp: Date.now(), streaming: false }]);
          setIsLoading(false);
        } else {
          await new Promise(r => setTimeout(r, 1000 * retries));
        }
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const regenerate = () => {
    if (messages.length < 2 || isLoading) return;
    const lastUserMsg = [...messages].reverse().find(m => m.role === "user");
    if (lastUserMsg) {
      setMessages(prev => prev.slice(0, -1));
      sendMessage(lastUserMsg.content);
    }
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  const [chatSize, setChatSize] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("nova-chat-size");
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return { width: 400, height: 620 };
  });
  const isResizing = useRef(false);
  const resizeStart = useRef({});
  const isDragging = useRef(false);
  const dragStart = useRef({});
  const windowRef = useRef(null);
  const [chatPos, setChatPos] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("nova-chat-pos");
        if (saved) {
          const pos = JSON.parse(saved);
          if (pos && typeof pos.x === "number") return pos;
        }
      } catch {}
    }
    return { x: null, y: null };
  });

  const startResize = useCallback((e) => {
    if (isMobile) return;
    e.preventDefault();
    isResizing.current = true;
    resizeStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      width: chatSize.width,
      height: chatSize.height,
    };
    document.body.style.userSelect = "none";
    document.body.style.cursor = "se-resize";
  }, [chatSize, isMobile]);

  const startDrag = useCallback((e) => {
    if (isMobile) return;
    e.preventDefault();
    isDragging.current = true;
    const rect = windowRef.current?.getBoundingClientRect();
    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      posX: rect ? rect.left : 0,
      posY: rect ? rect.top : 0,
    };
    document.body.style.userSelect = "none";
    document.body.style.cursor = "grabbing";
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) return;
    const handleMouseMove = (e) => {
      if (isResizing.current) {
        const dx = e.clientX - resizeStart.current.mouseX;
        const dy = e.clientY - resizeStart.current.mouseY;
        const maxWidth = window.innerWidth - 48;
        const maxHeight = window.innerHeight - 100;
        const newWidth = Math.min(Math.max(resizeStart.current.width + dx, 320), maxWidth);
        const newHeight = Math.min(Math.max(resizeStart.current.height + dy, 400), maxHeight);
        setChatSize({ width: newWidth, height: newHeight });
      } else if (isDragging.current) {
        const dx = e.clientX - dragStart.current.mouseX;
        const dy = e.clientY - dragStart.current.mouseY;
        const rect = windowRef.current?.getBoundingClientRect();
        const w = rect?.width ?? 400;
        const h = rect?.height ?? 620;
        const newX = Math.min(Math.max(dragStart.current.posX + dx, 0), window.innerWidth - w);
        const newY = Math.min(Math.max(dragStart.current.posY + dy, 0), window.innerHeight - h);
        setChatPos({ x: newX, y: newY });
      }
    };
    const stopResize = () => {
      if (isResizing.current) {
        isResizing.current = false;
        document.body.style.userSelect = "";
        document.body.style.cursor = "";
        setChatSize((prev) => {
          try { localStorage.setItem("nova-chat-size", JSON.stringify(prev)); } catch {}
          return prev;
        });
      }
      if (isDragging.current) {
        isDragging.current = false;
        document.body.style.userSelect = "";
        document.body.style.cursor = "";
        setChatPos((prev) => {
          try { localStorage.setItem("nova-chat-pos", JSON.stringify(prev)); } catch {}
          return prev;
        });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopResize);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopResize);
    };
  }, [isMobile]);

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            aria-label="Open Nova AI assistant"
            className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 w-14 h-14 rounded-2xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-105 transition-all duration-300 group"
          >
            <Sparkles className="w-6 h-6 text-primary-foreground" />
            <span className="absolute inset-0 rounded-2xl bg-primary/20 animate-ping opacity-20" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-background" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            ref={windowRef}
            className={`fixed z-50 glass-strong rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/50 flex flex-col overflow-hidden border border-border ${
              isMobile
                ? "inset-2 rounded-2xl"
                : chatPos.x === null
                  ? "bottom-5 right-5 sm:bottom-6 sm:right-6"
                  : ""
            }`}
            style={
              isMobile
                ? { height: isMinimized ? "auto" : "calc(100vh - 16px)" }
                : {
                    width: `${chatSize.width}px`,
                    maxWidth: "calc(100vw - 48px)",
                    height: isMinimized ? "auto" : `${chatSize.height}px`,
                    maxHeight: "calc(100vh - 100px)",
                    ...(chatPos.x !== null ? { left: `${chatPos.x}px`, top: `${chatPos.y}px` } : {}),
                  }
            }
          >
            {/* Header */}
            <div
              onMouseDown={startDrag}
              className="flex items-center justify-between px-4 py-3 border-b border-border bg-gradient-to-r from-primary/5 to-secondary/5 shrink-0 cursor-grab active:cursor-grabbing"
            >
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-background" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    Nova
                    <Sparkles className="w-3 h-3 text-primary" />
                  </h3>
                  <span className="text-[10px] text-green-500/80 font-medium">Online · Ready to help</span>
                </div>
              </div>
              <div className="flex items-center gap-0.5" onMouseDown={(e) => e.stopPropagation()}>
                <button onClick={() => setIsMinimized(!isMinimized)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title={isMinimized ? "Expand" : "Minimize"}>
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button onClick={() => setIsOpen(false)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Close">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages area */}
                <div
                  ref={scrollContainerRef}
                  className="flex-1 overflow-y-auto px-4 py-4 ai-chat-scroll"
                >
                  {messages.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      className="flex flex-col items-center justify-center h-full text-center px-2"
                    >
                      <motion.div
                        initial={{ scale: 0, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.5, delay: 0.1, type: "spring" }}
                        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20 flex items-center justify-center mb-5"
                      >
                        <Sparkles className="w-8 h-8 text-primary" />
                      </motion.div>
                      <motion.h3
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="font-heading font-semibold text-foreground mb-2 text-lg tracking-tight"
                      >
                        👋 Hi! I'm Nova
                      </motion.h3>
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-sm text-muted-foreground mb-6 leading-relaxed max-w-[280px]"
                      >
                        Ask me about Daniel's experience, AI projects, skills, or any general IT questions.
                      </motion.p>
                      <div className="w-full space-y-2">
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 }}
                          className="text-xs text-muted-foreground font-medium mb-2 uppercase tracking-wider"
                        >
                          Frequently Asked
                        </motion.p>
                        {faqSuggestions.slice(0, 6).map((q, i) => (
                          <motion.button
                            key={q.text}
                            initial={{ opacity: 0, x: -15 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + i * 0.06 }}
                            onClick={() => sendMessage(q.text)}
                            className="w-full text-left px-3.5 py-2.5 rounded-xl glass border border-border hover:border-primary/30 hover:bg-primary/5 text-sm text-muted-foreground hover:text-foreground transition-all duration-300 flex items-center gap-2.5 group"
                          >
                            <span className="text-base">{q.emoji}</span>
                            <span className="flex-1">{q.text}</span>
                            <Send className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <>
                      {messages.map((msg, i) => (
                        <MessageBubble key={i} message={msg} />
                      ))}
                      <AnimatePresence>
                        {isLoading && messages[messages.length - 1]?.role !== "assistant" && <TypingIndicator />}
                      </AnimatePresence>
                    </>
                  )}
                </div>

                {/* Suggested follow-ups */}
                {messages.length > 0 && !isLoading && (
                  <div className="px-4 pb-2 flex gap-1.5 overflow-x-auto ai-chat-scroll-horizontal shrink-0">
                    {faqSuggestions.slice(0, 4).map((q) => (
                      <button
                        key={q.text}
                        onClick={() => sendMessage(q.text)}
                        className="shrink-0 px-3 py-1.5 rounded-lg border border-border glass text-xs text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all whitespace-nowrap"
                      >
                        {q.emoji} {q.text}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input area */}
                <div className="px-3 py-3 border-t border-border shrink-0">
                  <div className="flex items-center gap-1.5">
                    {messages.length >= 2 && !isLoading && (
                      <button
                        onClick={regenerate}
                        className="p-2.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0"
                        title="Regenerate response"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    )}
                    <div className="flex-1 flex items-center gap-2 glass rounded-xl border border-border focus-within:border-primary/30 transition-colors px-3 py-2.5">
                      <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask Nova anything..."
                        className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70 outline-none min-w-0"
                        disabled={isLoading}
                      />
                      <button
                        onClick={() => sendMessage(input)}
                        disabled={!input.trim() || isLoading}
                        className="p-1.5 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                      >
                        {isLoading ? (
                          <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        ) : (
                          <Send className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground/50 mt-1.5 text-center">
                    Powered by Nova AI · Press Enter to send
                  </p>
                </div>
              </>
            )}

            {!isMinimized && !isMobile && (
              <div
                onMouseDown={startResize}
                className="absolute bottom-0 right-0 w-5 h-5 cursor-se-resize z-10 flex items-end justify-end"
                title="Drag to resize"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" className="text-muted-foreground/40 pointer-events-none">
                  <path d="M11 1L1 11M11 5L5 11M11 9L9 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}