import React from "react";
import Navbar from "@/components/portfolio/Navbar";
import HeroSection from "@/components/portfolio/HeroSection";
import AboutSection from "@/components/portfolio/AboutSection";
import ExperienceSection from "@/components/portfolio/ExperienceSection";
import SkillsSection from "@/components/portfolio/SkillsSection";
import ProjectsSection from "@/components/portfolio/ProjectsSection";
import AISection from "@/components/portfolio/AISection";
import ContactSection from "@/components/portfolio/ContactSection";
import Footer from "@/components/portfolio/Footer";
import CursorGlow from "@/components/portfolio/CursorGlow";
import NovaAssistant from "@/components/portfolio/NovaAssistant";
import useVisitorTracking from "@/hooks/useVisitorTracking";

export default function Home() {
  useVisitorTracking();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <CursorGlow />
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <SkillsSection />
        <ProjectsSection />
        <AISection />
        <ContactSection />
      </main>
      <Footer />
      <NovaAssistant />
    </div>
  );
}