import { localAPI } from "@/api/localClient";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Eye, Check, X, Clock, Mail, Building, MessageSquare, Calendar as CalendarIcon
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader,DialogTitle, DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

import { formatTimeSlot } from "@/components/meeting/TimeSlots";

const statusConfig = {
  pending: { label: "Pending", className: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-500/20" },
  accepted: { label: "Accepted", className: "bg-green-500/10 text-green-600 dark:text-green-500 border-green-500/20" },
  rejected: { label: "Rejected", className: "bg-red-500/10 text-red-600 dark:text-red-500 border-red-500/20" },
  completed: { label: "Completed", className: "bg-blue-500/10 text-blue-600 dark:text-blue-500 border-blue-500/20" },
};

export default function MeetingManagement({ meetings, onUpdateMeeting }) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMeeting, setViewMeeting] = useState(null);
  const [acceptMeeting, setAcceptMeeting] = useState(null);
  const [rejectMeeting, setRejectMeeting] = useState(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [isResponding, setIsResponding] = useState(false);
  const { toast } = useToast();

  const [acceptForm, setAcceptForm] = useState({
    accepted_date: "",
    accepted_time: "",
    meet_link: "",
    admin_message: ""
  });

  const filtered = useMemo(() => {
    if (statusFilter === "all") return meetings;
    return meetings.filter(m => m.status === statusFilter);
  }, [meetings, statusFilter]);

  const openAccept = (meeting) => {
    setAcceptMeeting(meeting);
    setAcceptForm({
      accepted_date: meeting.requested_date || "",
      accepted_time: meeting.requested_time || "",
      meet_link: "",
      admin_message: ""
    });
  };

  const openViewDetails = (meeting) => {
    setViewMeeting(meeting);
    setAdminNotes(meeting.admin_notes || "");
  };

  const handleAccept = async () => {
    if (!acceptForm.accepted_date || !acceptForm.accepted_time) {
      toast({ title: "Date and time are required", variant: "destructive" });
      return;
    }
    setIsResponding(true);
    try {
      // First update the meeting status in backend
      const response = await localAPI.meeting.respondToMeeting(acceptMeeting.id, {
        action: "accepted",
        acceptedDate: acceptForm.accepted_date,
        acceptedTime: acceptForm.accepted_time,
        meetLink: acceptForm.meet_link,
        adminMessage: acceptForm.admin_message
      });
      
      if (response.success) {
        // Send email via Resend
        const emailResult = await localAPI.email.sendMeetingAcceptance({
          to: acceptMeeting.email,
          customerName: acceptMeeting.customer_name,
          meetingTopic: acceptMeeting.meeting_topic,
          date: acceptForm.accepted_date,
          time: acceptForm.accepted_time,
          meetLink: acceptForm.meet_link,
          adminMessage: acceptForm.admin_message
        });
        
        // Update the meeting status in frontend
        onUpdateMeeting(acceptMeeting.id, { 
          status: "accepted", 
          acceptedDate: acceptForm.accepted_date,
          acceptedTime: acceptForm.accepted_time,
          meetLink: acceptForm.meet_link,
          adminMessage: acceptForm.admin_message 
        });
        
        if (emailResult.success) {
          toast({
            title: "Meeting accepted!",
            description: "Confirmation email sent to customer via Resend."
          });
          setAcceptMeeting(null);
        } else {
          toast({
            title: "Meeting accepted!",
            description: `Email could not be sent: ${emailResult.error}. Please send manually.`
          });
          // Build email content for manual sending
          let emailContent = `Dear ${acceptMeeting.customer_name},\n\n` +
            `Your meeting request has been accepted!\n\n` +
            `📅 **Meeting Details:**\n` +
            `- Date: ${acceptForm.accepted_date}\n` +
            `- Time: ${acceptForm.accepted_time}\n` +
            `- Topic: ${acceptMeeting.meeting_topic}\n\n`;
          
          if (acceptForm.meet_link) {
            emailContent += `🔗 **Meeting Link:** ${acceptForm.meet_link}\n\n`;
          }
          
          if (acceptForm.admin_message) {
            emailContent += `💬 **Additional Message:**\n${acceptForm.admin_message}\n\n`;
          }
          
          emailContent += `Please let me know if this time works for you or if you need to reschedule.\n\n` +
            `Best regards,\n` +
            `Lixandru Daniel`;
          
          setAcceptMeeting({ 
            ...acceptMeeting, 
            emailBody: emailContent, 
            emailSubject: `Meeting Accepted: ${acceptMeeting.meeting_topic}` 
          });
        }
      } else {
        toast({ title: response.error || "Failed to accept", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error accepting meeting:", error);
      toast({ title: "Something went wrong", variant: "destructive" });
    }
    setIsResponding(false);
  };

  const handleReject = async () => {
    setIsResponding(true);
    try {
      // First update the meeting status in backend
      const response = await localAPI.meeting.respondToMeeting(rejectMeeting.id, {
        action: "rejected"
      });
      
      if (response.success) {
        // Send email via Resend
        const emailResult = await localAPI.email.sendMeetingRejection({
          to: rejectMeeting.email,
          customerName: rejectMeeting.customer_name,
          meetingTopic: rejectMeeting.meeting_topic,
          requestedDate: rejectMeeting.requested_date,
          requestedTime: rejectMeeting.requested_time
        });
        
        onUpdateMeeting(rejectMeeting.id, { status: "rejected" });
        
        if (emailResult.success) {
          toast({
            title: "Meeting rejected",
            description: "Rejection email sent to customer via Resend."
          });
          setRejectMeeting(null);
        } else {
          toast({
            title: "Meeting rejected",
            description: `Email could not be sent: ${emailResult.error}. Please send manually.`
          });
          // Build email content for manual sending
          const emailContent = `Dear ${rejectMeeting.customer_name},\n\n` +
            `Thank you for your meeting request. Unfortunately, I'm unable to schedule a meeting at this time due to scheduling constraints.\n\n` +
            `**Meeting Topic:** ${rejectMeeting.meeting_topic}\n` +
            `**Requested Date:** ${rejectMeeting.requested_date}\n` +
            `**Requested Time:** ${rejectMeeting.requested_time}\n\n` +
            `I appreciate your interest and hope we can connect in the future. Please feel free to submit another request at a later date.\n\n` +
            `Best regards,\n` +
            `Lixandru Daniel`;
          
          setRejectMeeting({ 
            ...rejectMeeting, 
            emailBody: emailContent, 
            emailSubject: `Meeting Request Update: ${rejectMeeting.meeting_topic}` 
          });
        }
      } else {
        toast({ title: response.error || "Failed to reject", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error rejecting meeting:", error);
      toast({ title: "Something went wrong", variant: "destructive" });
    }
    setIsResponding(false);
  };

  const saveNotes = async () => {
    try {
      await localAPI.meeting.updateMeeting(viewMeeting.id, { admin_notes: adminNotes });
      onUpdateMeeting(viewMeeting.id, { admin_notes: adminNotes });
      toast({ title: "Notes saved" });
      setViewMeeting(null);
    } catch (error) {
      console.error("Error saving notes:", error);
      toast({ title: "Failed to save notes", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Note */}
      <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
        <div className="flex items-start gap-2">
          <Calendar className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-foreground mb-1">Google Calendar Integration</h3>
            <p className="text-xs text-muted-foreground">
              Meetings are now scheduled directly via Google Calendar. This table shows meeting requests 
              submitted through the fallback form. Google Calendar bookings are managed externally.
            </p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center justify-between gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Requests</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground">{filtered.length} request(s)</span>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Customer</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Topic</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date / Time</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-muted-foreground">No meeting requests</td></tr>
              ) : filtered.map((m, i) => (
                <tr key={m.id || i} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">{m.customer_name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {m.email}
                    </p>
                    {m.company && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Building className="w-3 h-3" />
                        {m.company}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground max-w-[200px] truncate">
                    {m.meeting_topic}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <p className="text-xs">{m.requested_date}</p>
                    <p className="text-xs text-primary">{m.requested_time && formatTimeSlot(m.requested_time)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={statusConfig[m.status]?.className}>
                      {statusConfig[m.status]?.label || m.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button size="sm" variant="ghost" onClick={() => openViewDetails(m)} title="View Details">
                        <Eye className="w-4 h-4" />
                      </Button>
                      {m.status === "pending" && (
                        <>
                          <Button size="sm" variant="ghost" className="text-green-600 hover:text-green-700 hover:bg-green-500/10" onClick={() => openAccept(m)} title="Accept">
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-500/10" onClick={() => setRejectMeeting(m)} title="Reject">
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Accept Dialog */}
      <Dialog open={!!acceptMeeting} onOpenChange={(open) => !isResponding && setAcceptMeeting(null)}>
        <DialogContent className="max-w-lg">
          {acceptMeeting?.emailBody ? (
            <>
              <DialogHeader>
                <DialogTitle>Email Preview</DialogTitle>
                <DialogDescription>
                  The email could not be sent automatically (recipient may not be registered). Copy the content below and send it manually.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Subject: {acceptMeeting.emailSubject}</p>
                <Textarea readOnly value={acceptMeeting.emailBody} className="min-h-[300px] font-mono text-xs" />
              </div>
              <DialogFooter>
                <Button onClick={() => { navigator.clipboard.writeText(acceptMeeting.emailBody); toast({ title: "Email content copied!" }); }}>
                  Copy to Clipboard
                </Button>
                <Button variant="outline" onClick={() => setAcceptMeeting(null)}>Close</Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Accept Meeting Request</DialogTitle>
                <DialogDescription>
                  Review and edit the meeting details before sending confirmation to {acceptMeeting?.customer_name}.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs mb-1.5 block">Date</Label>
                    <Input type="date" value={acceptForm.accepted_date} onChange={(e) => setAcceptForm(p => ({ ...p, accepted_date: e.target.value }))} />
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block">Time</Label>
                    <Input type="time" value={acceptForm.accepted_time} onChange={(e) => setAcceptForm(p => ({ ...p, accepted_time: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <Label className="text-xs mb-1.5 block">Google Meet Link</Label>
                  <Input value={acceptForm.meet_link} onChange={(e) => setAcceptForm(p => ({ ...p, meet_link: e.target.value }))} placeholder="https://meet.google.com/xxx" />
                </div>
                <div>
                  <Label className="text-xs mb-1.5 block">Additional Message</Label>
                  <Textarea value={acceptForm.admin_message} onChange={(e) => setAcceptForm(p => ({ ...p, admin_message: e.target.value }))} placeholder="Optional message to include in the email..." className="min-h-[100px] resize-none" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAcceptMeeting(null)} disabled={isResponding}>Cancel</Button>
                <Button onClick={handleAccept} disabled={isResponding} className="bg-green-600 text-white hover:bg-green-700">
                  {isResponding ? "Sending..." : "Accept & Send Email"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={!!rejectMeeting} onOpenChange={(open) => !isResponding && setRejectMeeting(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Meeting Request</DialogTitle>
            <DialogDescription>
              A polite rejection email will be sent to {rejectMeeting?.customer_name} explaining the meeting cannot be scheduled at this time.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectMeeting(null)} disabled={isResponding}>Cancel</Button>
            <Button onClick={handleReject} disabled={isResponding} className="bg-red-600 text-white hover:bg-red-700">
              {isResponding ? "Sending..." : "Reject & Send Email"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={!!viewMeeting} onOpenChange={(open) => !isResponding && setViewMeeting(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Meeting Details</DialogTitle>
          </DialogHeader>
          {viewMeeting && (
            <div className="space-y-3 py-2">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Name</p>
                  <p className="font-medium text-foreground">{viewMeeting.customer_name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Email</p>
                  <p className="font-medium text-foreground truncate">{viewMeeting.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Company</p>
                  <p className="font-medium text-foreground">{viewMeeting.company || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Status</p>
                  <Badge variant="outline" className={statusConfig[viewMeeting.status]?.className}>
                    {statusConfig[viewMeeting.status]?.label}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Requested Date</p>
                  <p className="font-medium text-foreground">{viewMeeting.requested_date}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Requested Time</p>
                  <p className="font-medium text-foreground">{viewMeeting.requested_time && formatTimeSlot(viewMeeting.requested_time)}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Meeting Topic</p>
                <p className="text-sm text-foreground">{viewMeeting.meeting_topic}</p>
              </div>
              {viewMeeting.notes && (
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Notes</p>
                  <p className="text-sm text-foreground">{viewMeeting.notes}</p>
                </div>
              )}
              {viewMeeting.status === "accepted" && viewMeeting.meet_link && (
                <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                  <p className="text-xs text-muted-foreground mb-0.5">Google Meet Link</p>
                  <a href={viewMeeting.meet_link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline break-all">
                    {viewMeeting.meet_link}
                  </a>
                </div>
              )}
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">Admin Notes</Label>
                <Textarea value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} placeholder="Private notes for this meeting..." className="min-h-[80px] resize-none" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewMeeting(null)}>Close</Button>
            <Button onClick={saveNotes}>Save Notes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}