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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      toast({ title: "Please select a date and time first", variant: "destructive" });
      return;
    }
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const response = await db.functions.invoke("submitMeeting", {
        ...formData,
        requested_date: format(selectedDate, "yyyy-MM-dd"),
        requested_time: selectedTime
      });
      if (response.data.success) {
        onSubmitted({
          ...formData,
          requested_date: format(selectedDate, "yyyy-MM-dd"),
          requested_time: selectedTime,
          id: response.data.id
        });
      } else {
        toast({ title: response.data.error || "Failed to submit", variant: "destructive" });
      }
    } catch (error) {
      console.error("Meeting form submission error:", error);
      toast({ 
        title: "Something went wrong. Please try again.", 
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
      <div className="flex items-center gap-2 mb-6">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <Send className="w-4 h-4 text-primary" />
        </div>
        <h3 className="font-heading font-bold text-lg text-foreground tracking-tight">Your Details</h3>
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