import React from "react";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Google Calendar Booking Component
 * 
 * This component provides a direct link to Google Calendar's appointment scheduling.
 * It allows visitors to book meetings directly without backend dependencies.
 * 
 * IMPORTANT: Replace the placeholder URL with your actual Google Calendar booking link:
 * 1. Go to Google Calendar → Settings → Appointment Schedules
 * 2. Create an appointment schedule with your availability
 * 3. Get the public booking link
 * 4. Replace GOOGLE_CALENDAR_BOOKING_URL below
 */
export default function GoogleCalendarBooking() {
  // 🔧 CONFIGURATION REQUIRED: Replace this with your Google Calendar booking URL
  // To get your booking URL:
  // 1. Open Google Calendar → Settings → Appointment Schedules
  // 2. Create or select your appointment schedule
  // 3. Click "Booking page" → Copy the public URL
  // 4. Paste it here
  const GOOGLE_CALENDAR_BOOKING_URL = "https://calendar.app.google/K9uENUFT5iNrBY7Z8";
  
  const features = [
    {
      icon: Calendar,
      title: "Select Date & Time",
      description: "Choose from available slots in real-time"
    },
    {
      icon: CheckCircle,
      title: "Automatic Confirmation",
      description: "Instant email confirmation from Google"
    },
    {
      icon: Clock,
      title: "Google Meet Included",
      description: "Virtual meeting link automatically provided"
    }
  ];

  const handleBookMeeting = () => {
    // Open Google Calendar booking page in new tab
    window.open(GOOGLE_CALENDAR_BOOKING_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="glass rounded-2xl p-6 md:p-8 border border-border">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <Calendar className="w-4 h-4 text-primary" />
        </div>
        <h3 className="font-heading font-bold text-lg text-foreground tracking-tight">
          Book a Meeting Directly
        </h3>
      </div>

      <div className="space-y-4 mb-6">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Schedule a meeting directly through my Google Calendar. This allows you to:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex flex-col items-center text-center p-4 rounded-lg bg-primary/5 border border-primary/10"
            >
              <feature.icon className="w-6 h-6 text-primary mb-2" />
              <h4 className="font-heading font-semibold text-sm text-foreground mb-1">
                {feature.title}
              </h4>
              <p className="text-xs text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <Button
        onClick={handleBookMeeting}
        className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90"
        size="lg"
      >
        <Calendar className="w-4 h-4 mr-2" />
        Book via Google Calendar
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>

      <div className="mt-4 text-xs text-muted-foreground text-center">
        <p>✅ No forms to fill • ✅ Instant confirmation • ✅ Google Meet included</p>
      </div>

      {/* Alternative fallback option for users who prefer form-based booking */}
      <div className="mt-6 pt-6 border-t border-border/50">
        <p className="text-xs text-muted-foreground mb-3 text-center">
          Prefer to request a meeting instead? Use the form below.
        </p>
      </div>
    </div>
  );
}
