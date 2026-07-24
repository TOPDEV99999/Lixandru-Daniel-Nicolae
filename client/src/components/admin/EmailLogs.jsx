import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail, Clock, FileText, Eye, Download, Trash2, RefreshCw,
  AlertCircle, CheckCircle, XCircle, Search, Filter
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

export default function EmailLogs() {
  const [emailLogs, setEmailLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [emailConfig, setEmailConfig] = useState(null);
  const { toast } = useToast();

  const loadEmailLogs = async () => {
    try {
      setLoading(true);
      const response = await db.functions.invoke("getAdminData", {});
      
      // For now, we'll simulate email logs since we don't have the endpoint yet
      // In production, you would call: GET /api/admin/email-logs
      
      // Simulated data
      const simulatedLogs = [
        {
          filename: "email_1742851200000.txt",
          date: "2024-07-24T03:20:00.000Z",
          to: "uhajucewog80@gmail.com",
          subject: "New Contact Message from John Smith",
          preview: "Contact form submission from John Smith...",
          fullContent: "Date: 2024-07-24T03:20:00.000Z\nTo: uhajucewog80@gmail.com\nSubject: New Contact Message from John Smith\n\nName: John Smith\nEmail: john@example.com\nMessage: Hello, I'm interested in your services..."
        },
        {
          filename: "email_1742850600000.txt",
          date: "2024-07-24T03:10:00.000Z",
          to: "uhajucewog80@gmail.com",
          subject: "New Meeting Request from Sarah Johnson",
          preview: "Meeting request from Sarah Johnson...",
          fullContent: "Date: 2024-07-24T03:10:00.000Z\nTo: uhajucewog80@gmail.com\nSubject: New Meeting Request from Sarah Johnson\n\nCustomer: Sarah Johnson\nEmail: sarah@example.com\nMeeting Topic: Project Discussion..."
        }
      ];
      
      setEmailLogs(simulatedLogs);
      
    } catch (error) {
      console.error("Error loading email logs:", error);
      toast({
        title: "Failed to load email logs",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadEmailConfig = async () => {
    try {
      // This would call GET /api/admin/email-config
      const config = {
        EMAIL_USER: "Set",
        EMAIL_PASSWORD: "Set",
        EMAIL_FROM: "uhajucewog80@gmail.com",
        EMAIL_ENABLED: "true",
        NODE_ENV: "development",
        status: "File logging only (SMTP blocked)"
      };
      
      setEmailConfig(config);
    } catch (error) {
      console.error("Error loading email config:", error);
    }
  };

  useEffect(() => {
    loadEmailLogs();
    loadEmailConfig();
  }, []);

  const filteredLogs = emailLogs.filter(log => 
    log.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.preview.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handleViewEmail = (email) => {
    setSelectedEmail(email);
  };

  const handleDeleteEmail = async (filename) => {
    if (!confirm("Are you sure you want to delete this email log?")) return;
    
    try {
      // In production: DELETE /api/admin/email-logs/:filename
      setEmailLogs(prev => prev.filter(log => log.filename !== filename));
      
      if (selectedEmail?.filename === filename) {
        setSelectedEmail(null);
      }
      
      toast({
        title: "Email log deleted",
        description: `Deleted ${filename}`
      });
    } catch (error) {
      console.error("Error deleting email log:", error);
      toast({
        title: "Failed to delete email log",
        variant: "destructive"
      });
    }
  };

  const handleDownloadEmail = (email) => {
    const blob = new Blob([email.fullContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = email.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Email log downloaded",
      description: `Saved as ${email.filename}`
    });
  };

  const handleTestEmail = async () => {
    try {
      toast({
        title: "Sending test email...",
        description: "This would send a test email via the backend"
      });
      
      // In production: POST /api/admin/test-email
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Test email processed",
        description: "Check email logs for results"
      });
      
      loadEmailLogs();
    } catch (error) {
      toast({
        title: "Test email failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Email Configuration Status */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-6 border border-border"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-foreground">Email Service Status</h3>
              <p className="text-sm text-muted-foreground">Current email delivery configuration</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestEmail}
              className="border-primary/30 text-primary hover:bg-primary/10"
            >
              <Mail className="w-4 h-4 mr-2" />
              Test Email
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={loadEmailLogs}
              className="border-border"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-muted/20 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-foreground">Current Status</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Emails are being saved to file (server/email_logs/). 
              Gmail SMTP is blocked by network/firewall.
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-muted/20 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-foreground">What Works</span>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Contact form submissions are logged</li>
              <li>• Meeting requests are logged</li>
              <li>• Admin can view all email logs</li>
              <li>• Email content is preserved</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-4 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-500">To Enable Real Email Delivery:</p>
              <ul className="text-xs text-blue-500/80 mt-1 space-y-1">
                <li>1. Check Windows Firewall settings (allow port 587)</li>
                <li>2. Try different network (mobile hotspot)</li>
                <li>3. Use email API service (SendGrid/Mailgun)</li>
                <li>4. Check .env file for correct Gmail App Password</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search & Filter */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-xl p-4 border border-border"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search email logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <span className="inline-flex items-center px-3 py-2 rounded-lg text-sm text-muted-foreground bg-muted/30">
              <FileText className="w-4 h-4 mr-2" />
              {filteredLogs.length} logs
            </span>
          </div>
        </div>
      </motion.div>

      {/* Email Logs List */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-xl border border-border overflow-hidden"
      >
        <div className="p-4 border-b border-border bg-muted/20">
          <h3 className="font-heading font-bold text-foreground">Email Logs</h3>
          <p className="text-xs text-muted-foreground">All contact and meeting notifications</p>
        </div>
        
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading email logs...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted/30 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No email logs found</p>
          </div>
        ) : (
          <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
            {filteredLogs.map((log, index) => (
              <motion.div
                key={log.filename}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 hover:bg-muted/30 transition-colors ${
                  selectedEmail?.filename === log.filename ? "bg-primary/5" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Mail className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-heading font-semibold text-foreground">{log.subject}</h4>
                        <p className="text-xs text-muted-foreground">To: {log.to}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {formatDate(log.date)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{log.preview}</p>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="px-2 py-1 rounded-md bg-muted/30">
                        {log.filename}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-primary/30 text-primary hover:bg-primary/10"
                      onClick={() => handleViewEmail(log)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-border"
                      onClick={() => handleDownloadEmail(log)}
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-destructive/30 text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteEmail(log.filename)}
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Email Detail View */}
      {selectedEmail && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setSelectedEmail(null)}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="glass rounded-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-foreground">{selectedEmail.subject}</h3>
                    <p className="text-sm text-muted-foreground">To: {selectedEmail.to}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedEmail(null)}
                >
                  Close
                </Button>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDate(selectedEmail.date)}
                </span>
                <span className="px-2 py-1 rounded-md bg-muted/30">
                  {selectedEmail.filename}
                </span>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[50vh]">
              <div className="mb-6">
                <h4 className="text-xs font-medium text-muted-foreground mb-2">Email Content</h4>
                <div className="p-4 rounded-lg bg-muted/20 border border-border">
                  <pre className="text-sm text-foreground whitespace-pre-wrap font-mono">
                    {selectedEmail.fullContent}
                  </pre>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleDownloadEmail(selectedEmail)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download as .txt
                </Button>
                
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleDeleteEmail(selectedEmail.filename);
                    setSelectedEmail(null);
                  }}
                  className="ml-auto"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Log
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}