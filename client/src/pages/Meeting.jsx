import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Calendar as CalendarIcon, Clock, Video, ArrowLeft, CheckCircle, ArrowRight
} from "lucide-react";
import Navbar from "@/components/portfolio/Navbar";
import Footer from "@/components/portfolio/Footer";
import GoogleCalendarBooking from "@/components/meeting/GoogleCalendarBooking";

import { resumeData } from "@/data/resume";

export default function Meeting() {
  const features = [
    {
      icon: CalendarIcon,
      title: "Select Date & Time",
      description: "Choose from available slots in real-time through Google Calendar"
    },
    {
      icon: CheckCircle,
      title: "Instant Confirmation",
      description: "Get automatic email confirmation and calendar invite"
    },
    {
      icon: Video,
      title: "Google Meet Included",
      description: "Video meeting link automatically generated"
    },
    {
      icon: Clock,
      title: "Time Zone Aware",
      description: "Automatic time zone conversion for international visitors"
    }
  ];

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
              Schedule a Meeting
            </span>
            <h1 className="font-heading font-extrabold text-4xl md:text-5xl lg:text-6xl tracking-tighter mb-6 text-foreground leading-[1.05]">
              Book a{" "}
              <span className="text-gradient">Meeting</span> Directly
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-[1.7] font-medium mb-8">
              Schedule a 1-on-1 with me through Google Calendar. See my real-time availability, pick a time that works for you, and get instant confirmation.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-primary" />
                Real-time availability
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                Instant confirmation
              </span>
              <span className="flex items-center gap-2">
                <Video className="w-4 h-4 text-primary" />
                Google Meet included
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main content */}
      <section className="relative pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="grid lg:grid-cols-5 gap-8"
          >
            {/* Left: Google Calendar Booking */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="lg:col-span-3"
            >
              <GoogleCalendarBooking />
            </motion.div>

            {/* Right: Features and Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Features */}
              <div className="glass rounded-2xl p-6 border border-border">
                <h3 className="font-heading font-bold text-lg text-foreground mb-4 tracking-tight">
                  How It Works
                </h3>
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-heading font-semibold text-sm text-foreground mb-0.5">
                          {feature.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Alternative Options */}
              <div className="glass rounded-2xl p-6 border border-border">
                <h3 className="font-heading font-bold text-lg text-foreground mb-4 tracking-tight">
                  Other Ways to Connect
                </h3>
                <div className="space-y-3">
                  <Link
                    to="/#contact"
                    className="flex items-center gap-2 p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-sm text-foreground">Contact Form</p>
                      <p className="text-xs text-muted-foreground">Send a message directly</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
                  </Link>
                  
                  <a
                    href={resumeData.socials.email}
                    className="flex items-center gap-2 p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Video className="w-4 h-4 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-sm text-foreground">Email Directly</p>
                      <p className="text-xs text-muted-foreground">{resumeData.email}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
                  </a>
                </div>
              </div>

              {/* Back to Home */}
              <div className="text-center">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}