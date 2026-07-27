const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Calendar as CalendarIcon, Clock, Video, CheckCircle2, ArrowLeft, Home
} from "lucide-react";
import { format } from "date-fns";
import Navbar from "@/components/portfolio/Navbar";
import Footer from "@/components/portfolio/Footer";
import MeetingCalendar from "@/components/meeting/MeetingCalendar";
import TimeSlots, { formatTimeSlot } from "@/components/meeting/TimeSlots";
import MeetingForm from "@/components/meeting/MeetingForm";

import { resumeData } from "@/data/resume";
import { localAPI } from "@/api/localClient";

export default function Meeting() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [meetingDetails, setMeetingDetails] = useState(null);

  useEffect(() => {
    if (!selectedDate) return;
    const checkAvailability = async () => {
      try {
        // Use local API instead of Base44 database
        const result = await localAPI.availability.getAvailability(format(selectedDate, "yyyy-MM-dd"));
        // The API returns booked slots, so we need to use them
        setBookedSlots(result.booked_slots || []);
      } catch {
        setBookedSlots([]);
      }
    };
    checkAvailability();
  }, [selectedDate]);

  const handleSelectDate = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleSubmitted = (details) => {
    setMeetingDetails(details);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 dark:bg-primary/3 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-secondary/5 dark:bg-secondary/3 rounded-full blur-[150px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium tracking-wider uppercase mb-6">
              Meeting
            </span>
            <h1 className="font-heading font-extrabold text-4xl md:text-5xl lg:text-6xl tracking-tighter mb-6 text-foreground leading-[1.05]">
              Book a{" "}
              <span className="text-gradient">Meeting</span>
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-[1.7] font-medium mb-8">
              Schedule a 1-on-1 with me to discuss your project, AI solutions, or collaboration opportunities. Pick a time that works for you.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                60 min appointments
              </span>
              <span className="flex items-center gap-2">
                <Video className="w-4 h-4 text-primary" />
                Google Meet
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main content */}
      <section className="relative pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="booking"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="grid lg:grid-cols-2 gap-6"
              >
                {/* Left: Calendar + Time slots */}
                <div className="space-y-6">
                  <MeetingCalendar selectedDate={selectedDate} onSelectDate={handleSelectDate} />
                  <TimeSlots
                    selectedTime={selectedTime}
                    onSelectTime={setSelectedTime}
                    bookedSlots={bookedSlots}
                    dateSelected={!!selectedDate}
                  />
                </div>

                {/* Right: Form */}
                <div>
                  <MeetingForm
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    onSubmitted={handleSubmitted}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="max-w-2xl mx-auto"
              >
                <div className="glass rounded-2xl p-8 md:p-12 border border-border text-center">
                  <motion.div
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.5, type: "spring" }}
                    className="w-20 h-20 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </motion.div>

                  <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-3 tracking-tight">
                    Meeting Request Received!
                  </h2>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    Thank you, {meetingDetails?.customer_name}. I'll review your request and send a confirmation email to{" "}
                    <span className="text-primary font-medium">{meetingDetails?.email}</span> shortly.
                  </p>

                  {/* Summary */}
                  <div className="glass rounded-xl p-6 border border-border mb-8 text-left space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarIcon className="w-4 h-4 text-primary" />
                        Date
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {meetingDetails?.requested_date && format(new Date(meetingDetails.requested_date), "EEEE, MMMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 text-primary" />
                        Time
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {meetingDetails?.requested_time && formatTimeSlot(meetingDetails.requested_time)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Video className="w-4 h-4 text-primary" />
                        Format
                      </span>
                      <span className="text-sm font-medium text-foreground">Google Meet (60 min)</span>
                    </div>
                    {meetingDetails?.meeting_topic && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Topic</span>
                        <span className="text-sm font-medium text-foreground">{meetingDetails.meeting_topic}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link to="/" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-90 transition-opacity">
                      <Home className="w-4 h-4" />
                      Back to Home
                    </Link>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setSelectedDate(null);
                        setSelectedTime(null);
                        setMeetingDetails(null);
                      }}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl glass border border-border text-foreground font-semibold text-sm hover:border-primary/30 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Book Another
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </div>
  );
}