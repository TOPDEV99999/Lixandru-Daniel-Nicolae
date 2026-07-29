import React, { useState } from "react";
// Try relative import since path alias might not work
import { db } from "../../api/base44Client";
import { motion } from "framer-motion";
import { User, Mail, Building, MessageSquare, Loader2, Send, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { formatTimeSlot } from "@/components/meeting/TimeSlots";

export default function MeetingForm({ selectedDate, selectedTime, onSubmitted }) {
  const [formData, setFormData] = useState({
    customer_name: "",
    email: "",
    company: "",
    meeting_topic: "",
    notes: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Google Calendar booking URL (same as in GoogleCalendarBooking component)
  const GOOGLE_CALENDAR_BOOKING_URL = "https://calendar.app.google/K9uENUFT5iNrBY7Z8";

  const openGoogleCalendarBooking = () => {
    window.open(GOOGLE_CALENDAR_BOOKING_URL, '_blank', 'noopener,noreferrer');
  };

  const validate = () => {
    const errs = {};
    if (!formData.customer_name.trim()) errs.customer_name = "Name is required";
    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = "Invalid email format";
    if (!formData.meeting_topic.trim()) errs.meeting_topic = "Topic is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  // FormSubmit integration - sends meeting request email directly from frontend
  const sendMeetingEmailViaFormSubmit = async (meetingData) => {
    try {
      // Your FormSubmit endpoint URL
      const FORM_SUBMIT_URL = 'https://formsubmit.co/uhajucewog80@gmail.com';
      
      // Prepare meeting request data for FormSubmit
      const formSubmitData = {
        _subject: `Meeting Request: ${meetingData.customer_name} - ${meetingData.meeting_topic}`,
        _replyto: meetingData.email,
        _cc: meetingData.email, // Optional: CC the sender
        name: meetingData.customer_name,
        email: meetingData.email,
        company: meetingData.company || 'Not specified',
        meeting_topic: meetingData.meeting_topic,
        requested_date: meetingData.requested_date,
        requested_time: meetingData.requested_time,
        notes: meetingData.notes || 'No additional notes',
        meeting_duration: '60 minutes',
        meeting_format: 'Google Meet',
        _honey: '', // Honeypot field for spam prevention
        _template: 'table', // Use table template for better formatting
        _captcha: 'false' // Disable captcha for better UX
      };

      console.log('📧 Sending meeting request email via FormSubmit to:', FORM_SUBMIT_URL);
      console.log('Meeting form data:', formSubmitData);

      // Send to FormSubmit using fetch
      const response = await fetch(FORM_SUBMIT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formSubmitData),
        mode: 'cors' // Important for cross-origin requests
      });

      if (!response.ok) {
        throw new Error(`FormSubmit HTTP error: ${response.status} ${response.statusText}`);
      }

      const result = await response.text();
      console.log('✅ FormSubmit response:', result);
      
      return {
        success: true,
        message: 'Meeting request email sent successfully via FormSubmit',
        result: result
      };
      
    } catch (error) {
      console.error('❌ FormSubmit error:', error);
      return {
        success: false,
        message: error.message || 'Failed to send meeting request email via FormSubmit'
      };
    }
  };

  const handleSubmit = async (e) => {
    console.log('Meeting form data:', formData);
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      toast({ title: "Please select a date and time first", variant: "destructive" });
      return;
    }
    if (!validate()) return;
    
    // Show recommendation to use Google Calendar instead
    toast({
      title: "⚠️ Recommendation: Use Google Calendar Booking",
      description: "For faster confirmation and automatic scheduling, consider using Google Calendar booking instead. Would you like to proceed with this form or switch to Google Calendar?",
      variant: "default",
      action: (
        <div className="flex gap-2 mt-2">
          <Button size="sm" onClick={() => {
            setIsSubmitting(true);
            submitFormFallback();
          }}>
            Continue with Form
          </Button>
          <Button size="sm" variant="outline" onClick={openGoogleCalendarBooking}>
            Use Google Calendar
          </Button>
        </div>
      )
    });
  };

  const submitFormFallback = async () => {
    setIsSubmitting(true);
    
    try {
      console.log('Starting fallback submission: Meeting Email via FormSubmit');
      
      // Send meeting request email directly from frontend using FormSubmit
      console.log('Sending meeting request email via FormSubmit...');
      const emailResult = await sendMeetingEmailViaFormSubmit({
        customer_name: formData.customer_name,
        email: formData.email,
        company: formData.company,
        meeting_topic: formData.meeting_topic,
        notes: formData.notes,
        requested_date: format(selectedDate, "yyyy-MM-dd"),
        requested_time: selectedTime
      });
      
      if (!emailResult.success) {
        throw new Error(`Meeting email sending failed: ${emailResult.message}`);
      }
      
      console.log('✅ Meeting request email sent successfully via FormSubmit');
      
      // Show success toast
      toast({
        title: "Meeting request submitted!",
        description: "✅ Meeting request email sent via FormSubmit\nI'll review your request and get back to you shortly.",
      });
      
      // Call the onSubmitted callback with success
      onSubmitted({
        ...formData,
        requested_date: format(selectedDate, "yyyy-MM-dd"),
        requested_time: selectedTime,
        id: 'meeting-request-' + Date.now()
      });
      
    } catch (error) {
      console.error("Meeting form submission error:", error);
      toast({ 
        title: "Failed to send meeting request", 
        description: error.message,
        variant: "destructive" 
      });
    }
    setIsSubmitting(false);
  };

  const fieldConfig = [
    { name: "customer_name", label: "Full Name", icon: User, placeholder: "John Smith", required: true, type: "text" },
    { name: "email", label: "Gmail Address", icon: Mail, placeholder: "johnsmith@gmail.com", required: true, type: "email" },
    { name: "company", label: "Company", icon: Building, placeholder: "Acme Inc. (optional)", required: false, type: "text" },
    { name: "meeting_topic", label: "Meeting Topic", icon: MessageSquare, placeholder: "Project discussion, consultation...", required: true, type: "text" },
  ];

  return (
    <div className="glass rounded-2xl p-6 md:p-8 border border-border">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-lg bg-yellow-500/10 flex items-center justify-center">
          <Send className="w-4 h-4 text-yellow-600" />
        </div>
        <div>
          <h3 className="font-heading font-bold text-lg text-foreground tracking-tight">Meeting Request (Fallback Option)</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            For instant scheduling, use <button 
              onClick={openGoogleCalendarBooking} 
              className="text-primary hover:underline"
            >
              Google Calendar booking
            </button> instead
          </p>
        </div>
      </div>

      <div className="mb-6 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
        <p className="text-sm text-yellow-700 dark:text-yellow-500 flex items-start gap-2">
          <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>
            <strong>Note:</strong> This form sends a meeting request email. For instant confirmation 
            and automatic scheduling, use the Google Calendar booking link above.
          </span>
        </p>
      </div>

      {selectedDate && selectedTime && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6 p-3 rounded-xl bg-primary/5 border border-primary/15"
        >
          <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
            <Calendar className="w-3.5 h-3.5" />
            {format(selectedDate, "MMM d, yyyy")}
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
            <Clock className="w-3.5 h-3.5" />
            {formatTimeSlot(selectedTime)}
          </div>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {fieldConfig.map(({ name, label, icon: Icon, placeholder, required, type }) => (
          <div key={name}>
            <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              {label} {required && <span className="text-destructive">*</span>}
            </Label>
            <div className="relative">
              <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
              <Input
                type={type}
                value={formData[name]}
                onChange={handleChange(name)}
                placeholder={placeholder}
                className="pl-10"
                disabled={isSubmitting}
              />
            </div>
            {errors[name] && <p className="text-xs text-destructive mt-1">{errors[name]}</p>}
          </div>
        ))}

        <div>
          <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Additional Notes
          </Label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-muted-foreground/50" />
            <Textarea
              value={formData.notes}
              onChange={handleChange("notes")}
              placeholder="Any specific topics or questions you'd like to discuss..."
              className="pl-10 min-h-[100px] resize-none"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || !selectedDate || !selectedTime}
          className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Request Meeting
            </>
          )}
        </Button>

        {!selectedDate || !selectedTime ? (
          <p className="text-xs text-muted-foreground/60 text-center">
            {!selectedDate ? "Please select a date" : "Please select a time slot"}
          </p>
        ) : null}
      </form>
    </div>
  );
}