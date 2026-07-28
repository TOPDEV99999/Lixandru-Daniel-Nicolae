import React, { useState } from "react";
// Try relative import since path alias might not work
import { db } from "../../api/base44Client";
import { motion } from "framer-motion";
import {
  Mail, Linkedin, Github, Download, ArrowRight, MapPin, Phone,
  Send, Loader2, Calendar, User, MessageSquare
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { resumeData } from "@/data/resume";

const contactCards = [
  { icon: Linkedin, title: "LinkedIn", desc: "Let's connect", value: "daniellixandru", href: resumeData.socials.linkedin, color: "from-blue-500/20 to-blue-500/5" },
  { icon: Github, title: "GitHub", desc: "View my code", value: "TOPDEV99999", href: resumeData.socials.github, color: "from-secondary/20 to-secondary/5" },
  { icon: Download, title: "Resume", desc: "Download my CV", value: "PDF", href: resumeData.resumeUrl, color: "from-green-500/20 to-green-500/5" },
  { icon: Mail, title: "Email", desc: "Best way to reach me", value: resumeData.email, href: resumeData.socials.email, color: "from-primary/20 to-primary/5" },
];

export default function ContactSection() {
  const [formData, setFormData] = useState({ full_name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  

  const validate = () => {
    const errs = {};
    if (!formData.full_name.trim()) errs.full_name = "Please enter your full name";
    if (!formData.email.trim()) errs.email = "Please enter your email address";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = "Please enter a valid email address";
    if (!formData.message.trim()) errs.message = "Please enter a message";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // FormSubmit integration - sends email directly from frontend
  const sendEmailViaFormSubmit = async (formData) => {
    try {
      // Your FormSubmit endpoint URL
      // Get this from: https://formsubmit.co/your-email@gmail.com
      const FORM_SUBMIT_URL = 'https://formsubmit.co/uhajucewog80@gmail.com';
      
      // Prepare form data for FormSubmit
      const formSubmitData = {
        _subject: `New Contact Message from ${formData.full_name}`,
        _replyto: formData.email,
        _cc: formData.email, // Optional: CC the sender
        name: formData.full_name,
        email: formData.email,
        message: formData.message,
        _honey: '', // Honeypot field for spam prevention
        _template: 'table', // Use table template for better formatting
        _captcha: 'false' // Disable captcha for better UX
      };

      console.log('📧 Sending email via FormSubmit to:', FORM_SUBMIT_URL);
      console.log('Form data:', formSubmitData);

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
        message: 'Email sent successfully via FormSubmit',
        result: result
      };
      
    } catch (error) {
      console.error('❌ FormSubmit error:', error);
      return {
        success: false,
        message: error.message || 'Failed to send email via FormSubmit'
      };
    }
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    console.log('Form data:', formData);
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    
    try {
      console.log('Starting dual submission: Email + Backend Storage');
      
      // 1. FIRST: Send email directly from frontend using FormSubmit
      console.log('Step 1: Sending email via FormSubmit...');
      const emailResult = await sendEmailViaFormSubmit({
        full_name: formData.full_name,
        email: formData.email,
        message: formData.message
      });
      
      if (!emailResult.success) {
        throw new Error(`Email sending failed: ${emailResult.message}`);
      }
      
      console.log('✅ Email sent successfully via FormSubmit');
      
      // 2. SECOND: Store message in backend database (existing flow)
      console.log('Step 2: Storing message in backend database...');
      console.log('db object:', db);
      console.log('db.functions:', db?.functions);
      
      // Check if db.functions.invoke exists
      if (!db?.functions?.invoke) {
        throw new Error('Base44 client not properly initialized. db.functions.invoke is not available.');
      }
      
      console.log('Calling db.functions.invoke("submitContact", formData)...');
      const backendResponse = await db.functions.invoke("submitContact", formData);
      console.log('Backend API response:', backendResponse);
      
      if (backendResponse.data.success) {
        toast({
          title: "Message sent successfully! 🎉",
          description: "Thank you for reaching out! Your message has been sent and I'll get back to you as soon as possible. Have a wonderful day!",
        });
        setFormData({ full_name: "", email: "", message: "" });
      } else {
        // Even if backend fails, email was sent successfully
        toast({ 
          title: "Message sent! 📧",
          description: "Your email has been sent successfully! There was a minor issue saving to our system, but I've received your message and will respond soon.",
          variant: "default"
        });
      }
    } catch (error) {
      console.error("Contact form submission error:", error);
      toast({ 
        title: "Oops! Something went wrong", 
        description: "There was an issue sending your message. Please try again or contact me directly at uhajucewog80@gmail.com",
        variant: "destructive" 
      });
    }
    setIsSubmitting(false);
  };

  return (
    <section id="contact" className="relative py-32 overflow-hidden">
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-primary/5 dark:bg-primary/3 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] bg-secondary/5 dark:bg-secondary/3 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium tracking-wider uppercase mb-6">
            Get in Touch
          </span>
          <h2 className="font-heading font-extrabold text-4xl md:text-5xl lg:text-6xl tracking-tighter mb-6 text-foreground leading-[1.05]">
            Let's Build Something{" "}
            <span className="text-gradient">Amazing</span> Together
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-[1.7] font-medium">
            I'm always open to new opportunities, collaborations, and interesting projects. Whether you need a full-stack engineer, an AI specialist, or a technical partner — let's talk.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactCards.map((card, i) => (
            <motion.a
              key={card.title}
              href={card.href}
              target={card.title !== "Email" ? "_blank" : undefined}
              rel={card.title !== "Email" ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group glass rounded-xl p-6 border border-border hover:border-primary/30 transition-all duration-500 hover:-translate-y-1 block"
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <card.icon className="w-5 h-5 text-foreground" />
              </div>
              <h3 className="font-heading font-semibold text-foreground mb-1 tracking-tight">{card.title}</h3>
              <p className="text-xs text-muted-foreground mb-2">{card.desc}</p>
              <p className="text-sm text-primary font-medium truncate">{card.value}</p>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground mb-12"
        >
          <span className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            {resumeData.location}
          </span>
          <span className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-primary" />
            {resumeData.phone}
          </span>
        </motion.div>

        {/* Contact Form + Book a Meeting */}
        <div className="grid lg:grid-cols-5 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3 glass rounded-2xl p-6 md:p-8 border border-border"
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Send className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-heading font-bold text-lg text-foreground tracking-tight">Send a Message</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="full_name" className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={handleChange("full_name")}
                    placeholder="John Smith"
                    className="pl-10"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.full_name && <p className="text-xs text-destructive mt-1">{errors.full_name}</p>}
              </div>

              <div>
                <Label htmlFor="email" className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Gmail Address <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange("email")}
                    placeholder="johnsmith@gmail.com"
                    className="pl-10"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="message" className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Message <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-muted-foreground/50" />
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={handleChange("message")}
                    placeholder="I am interested in your AI and Full Stack development services..."
                    className="pl-10 min-h-[120px] resize-none"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.message && <p className="text-xs text-destructive mt-1">{errors.message}</p>}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-foreground text-background hover:opacity-90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2 glass rounded-2xl p-6 md:p-8 border border-border flex flex-col justify-center"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20 flex items-center justify-center mb-5">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-heading font-bold text-lg text-foreground mb-2 tracking-tight">
              Schedule a Meeting
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Prefer a face-to-face conversation? Book a time slot directly on my calendar and we'll discuss your project in detail.
            </p>
            <Button asChild className="bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90">
              <Link to="/meeting">
                <Calendar className="w-4 h-4 mr-2" />
                Book a Meeting
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}