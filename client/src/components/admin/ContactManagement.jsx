import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail, User, Clock, Globe, MessageSquare, CheckCircle, Eye,
  Calendar, Trash2, Search, Filter, ChevronDown, ExternalLink
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { localAPI } from "@/api/localClient";

export default function ContactManagement({ messages = [], onUpdateMessage, onDeleteMessage }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMessage, setViewMessage] = useState(null);
  const [replyMessage, setReplyMessage] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const statusColors = {
    new: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    read: "bg-green-500/10 text-green-500 border-green-500/20",
    archived: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  };

  const statusLabels = {
    new: "New",
    read: "Read", 
    archived: "Archived",
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || message.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleMarkAsRead = async (messageId) => {
    try {
      setIsLoading(true);
      await localAPI.contact.updateContactStatus(messageId, { status: "read" });
      onUpdateMessage?.(messageId, { status: "read" });
      toast({ title: "Marked as read" });
    } catch (error) {
      console.error("Error marking as read:", error);
      toast({ title: "Failed to update", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchive = async (messageId) => {
    try {
      setIsLoading(true);
      await localAPI.contact.updateContactStatus(messageId, { status: "archived" });
      onUpdateMessage?.(messageId, { status: "archived" });
      toast({ title: "Archived" });
    } catch (error) {
      console.error("Error archiving:", error);
      toast({ title: "Failed to archive", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (messageId) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    
    try {
      setIsLoading(true);
      await localAPI.contact.deleteContactMessage(messageId);
      onDeleteMessage?.(messageId);
      toast({ title: "Message deleted" });
      if (viewMessage?.id === messageId) {
        setViewMessage(null);
      }
    } catch (error) {
      console.error("Error deleting:", error);
      toast({ title: "Failed to delete", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReply = (message) => {
    setReplyMessage(message);
    setReplyContent(`Dear ${message.fullName},\n\nThank you for your message. `);
  };

  const sendReply = async () => {
    if (!replyMessage || !replyContent.trim()) {
      toast({ title: "Message is required", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      // Send via FormSubmit
      const formData = new FormData();
      formData.append('_replyto', replyMessage.email);
      formData.append('message', replyContent);
      formData.append('_subject', `Re: Your message to ${replyMessage.fullName}`);
      
      const response = await fetch('https://formsubmit.co/ajax/uhajucewog80@gmail.com', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast({ 
          title: "Reply sent!", 
          description: "Email has been sent via FormSubmit" 
        });
        
        // Mark as read if it was new
        if (replyMessage.status === 'new') {
          await localAPI.contact.updateContactStatus(replyMessage.id, { status: 'read' });
          onUpdateMessage?.(replyMessage.id, { status: 'read' });
        }
        
        setReplyMessage(null);
        setReplyContent("");
      } else {
        toast({ 
          title: "Failed to send reply", 
          description: result.message || "Please try again", 
          variant: "destructive" 
        });
      }
    } catch (error) {
      console.error("Error sending reply:", error);
      toast({ 
        title: "Failed to send reply", 
        description: error.message, 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const stats = {
    total: messages.length,
    new: messages.filter(m => m.status === "new").length,
    read: messages.filter(m => m.status === "read").length,
    archived: messages.filter(m => m.status === "archived").length,
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-4 border border-border"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Messages</p>
              <p className="font-heading font-bold text-2xl text-foreground">{stats.total}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl p-4 border border-border"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">New</p>
              <p className="font-heading font-bold text-2xl text-blue-500">{stats.new}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-xl p-4 border border-border"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Read</p>
              <p className="font-heading font-bold text-2xl text-green-500">{stats.read}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-xl p-4 border border-border"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-500/10 flex items-center justify-center">
              <Eye className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Archived</p>
              <p className="font-heading font-bold text-2xl text-gray-500">{stats.archived}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="glass rounded-xl p-4 border border-border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none glass border border-border rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="archived">Archived</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
            
            <Button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
              }}
              variant="outline"
              className="border-border"
            >
              <Filter className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="glass rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/20">
          <h3 className="font-heading font-bold text-foreground">Contact Messages ({filteredMessages.length})</h3>
        </div>
        
        {filteredMessages.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted/30 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No messages found</p>
          </div>
        ) : (
          <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
            {filteredMessages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 hover:bg-muted/30 transition-colors cursor-pointer ${
                  viewMessage?.id === message.id ? "bg-primary/5" : ""
                }`}
                onClick={() => setViewMessage(message)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-heading font-semibold text-foreground">{message.fullName}</h4>
                        <p className="text-xs text-muted-foreground">{message.email}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[message.status] || statusColors.new}`}>
                        {statusLabels[message.status] || "New"}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{message.message}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(message.createdAt)}
                      </span>
                      {message.country && (
                        <span className="flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          {message.country}
                        </span>
                      )}
                      {message.browser && (
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {message.browser}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    {message.status === "new" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-500/30 text-green-500 hover:bg-green-500/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(message.id);
                        }}
                        disabled={isLoading}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Read
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-primary/30 text-primary hover:bg-primary/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReply(message);
                      }}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Reply
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-destructive/30 text-destructive hover:bg-destructive/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(message.id);
                      }}
                      disabled={isLoading}
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Message Detail View */}
      {viewMessage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setViewMessage(null)}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="glass rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-foreground">{viewMessage.fullName}</h3>
                    <p className="text-sm text-muted-foreground">{viewMessage.email}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColors[viewMessage.status] || statusColors.new}`}>
                  {statusLabels[viewMessage.status] || "New"}
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Received</p>
                  <p className="font-medium text-foreground">{formatDate(viewMessage.createdAt)}</p>
                </div>
                {viewMessage.country && (
                  <div>
                    <p className="text-xs text-muted-foreground">Country</p>
                    <p className="font-medium text-foreground flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      {viewMessage.country}
                    </p>
                  </div>
                )}
                {viewMessage.browser && (
                  <div>
                    <p className="text-xs text-muted-foreground">Browser</p>
                    <p className="font-medium text-foreground">{viewMessage.browser}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[50vh]">
              <div className="mb-6">
                <h4 className="text-xs font-medium text-muted-foreground mb-2">Message</h4>
                <div className="p-4 rounded-lg bg-muted/20 border border-border">
                  <p className="text-foreground whitespace-pre-wrap">{viewMessage.message}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {viewMessage.status === "new" && (
                  <Button
                    onClick={() => handleMarkAsRead(viewMessage.id)}
                    disabled={isLoading}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Read
                  </Button>
                )}
                
                {viewMessage.status !== "archived" && (
                  <Button
                    variant="outline"
                    onClick={() => handleArchive(viewMessage.id)}
                    disabled={isLoading}
                  >
                    Archive
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  onClick={() => handleReply(viewMessage)}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Reply via Email
                </Button>
                
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(viewMessage.id)}
                  disabled={isLoading}
                  className="ml-auto"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
            
            <div className="p-4 border-t border-border flex justify-end">
              <Button
                variant="outline"
                onClick={() => setViewMessage(null)}
              >
                Close
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Reply Modal */}
      {replyMessage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setReplyMessage(null)}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="glass rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-foreground text-lg">Reply to {replyMessage.fullName}</h3>
                  <p className="text-sm text-muted-foreground">{replyMessage.email}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyMessage(null)}
                  className="h-8 w-8 p-0"
                >
                  ✕
                </Button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[50vh]">
              <div className="mb-4">
                <h4 className="text-xs font-medium text-muted-foreground mb-2">Original Message</h4>
                <div className="p-3 rounded-lg bg-muted/20 border border-border text-sm">
                  <p className="text-foreground whitespace-pre-wrap">{replyMessage.message}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Your Reply
                  </label>
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="w-full min-h-[200px] p-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Type your reply here..."
                  />
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div>
                    <p className="font-medium">Email will be sent via FormSubmit</p>
                    <p>Recipient: {replyMessage.email}</p>
                  </div>
                  <div className="text-right">
                    <p>Status: {replyMessage.status === 'new' ? 'Will also mark as read' : 'Current status unchanged'}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-border flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setReplyMessage(null);
                  setReplyContent("");
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={sendReply}
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reply via Email"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}