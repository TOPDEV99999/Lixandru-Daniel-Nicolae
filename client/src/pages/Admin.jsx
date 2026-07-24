import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import {
  LayoutDashboard, Users, Calendar as CalendarIcon, Mail, LogOut,
  Loader2, ArrowLeft, ShieldAlert
} from "lucide-react";

import VisitorAnalytics from "@/components/admin/VisitorAnalytics";
import MeetingManagement from "@/components/admin/MeetingManagement";
import ContactManagement from "@/components/admin/ContactManagement";
import ThemeToggle from "@/components/portfolio/ThemeToggle";
import { useAuth } from "@/lib/AuthContext";
import { localAPI } from "@/api/localClient";

const TABS = [
  { id: "visitors", label: "Visitors", icon: Users },
  { id: "meetings", label: "Meetings", icon: CalendarIcon },
  { id: "messages", label: "Messages", icon: Mail },
];

export default function Admin() {
  const { user, isAuthenticated, isLoadingAuth, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("visitors");
  const [data, setData] = useState({ visitors: [], meetings: [], messages: [] });
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user?.email === "uhajucewog80@gmail.com") {
      loadData();
    }
  }, [isAuthenticated, user]);

  const loadData = async () => {
    setLoadingData(true);
    try {
      const response = await localAPI.admin.getAdminData();
      setData(response || { visitors: [], meetings: [], messages: [] });
    } catch {
      // ignore
    }
    setLoadingData(false);
  };

  const handleLogout = async () => {
    logout(true);
  };

  const updateMeeting = (id, updates) => {
    setData(prev => ({
      ...prev,
      meetings: prev.meetings.map(m => m.id === id ? { ...m, ...updates } : m)
    }));
  };

  const updateMessage = (id, updates) => {
    setData(prev => ({
      ...prev,
      messages: prev.messages.map(m => m.id === id ? { ...m, ...updates } : m)
    }));
  };

  const deleteMessage = (id) => {
    setData(prev => ({
      ...prev,
      messages: prev.messages.filter(m => m.id !== id)
    }));
  };

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.email !== "uhajucewog80@gmail.com") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="font-heading font-bold text-2xl text-foreground mb-3">Access Denied</h1>
          <p className="text-sm text-muted-foreground mb-8">
            You need administrator privileges to access this dashboard.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-medium text-sm hover:opacity-90 transition-opacity">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-strong border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-sm text-foreground">Admin Dashboard</h1>
              <p className="text-[10px] text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Site</span>
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors">
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-foreground text-background"
                  : "glass text-muted-foreground hover:text-foreground border border-border"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.id === "meetings" && data.meetings.filter(m => m.status === "pending").length > 0 && (
                <span className="px-1.5 py-0.5 rounded-md bg-primary/20 text-primary text-[10px] font-bold">
                  {data.meetings.filter(m => m.status === "pending").length}
                </span>
              )}
              {tab.id === "messages" && data.messages.filter(m => m.status === "new").length > 0 && (
                <span className="px-1.5 py-0.5 rounded-md bg-blue-500/20 text-blue-500 text-[10px] font-bold">
                  {data.messages.filter(m => m.status === "new").length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {loadingData ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "visitors" && <VisitorAnalytics visitors={data.visitors} />}
              {activeTab === "meetings" && (
                <MeetingManagement meetings={data.meetings} onUpdateMeeting={updateMeeting} />
              )}
              {activeTab === "messages" && (
                <ContactManagement 
                  messages={data.messages} 
                  onUpdateMessage={updateMessage}
                  onDeleteMessage={deleteMessage}
                />
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}