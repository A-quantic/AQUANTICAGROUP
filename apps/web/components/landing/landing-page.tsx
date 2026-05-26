"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { HeroSection } from "./hero-section";
import { ServicesSection } from "./services-section";
import { WhySection } from "./why-section";
import { ContactSection } from "./contact-section";
import { Navigation } from "./navigation";
import { Footer } from "./footer";
import { AIChatWidget } from "./ai-chat-widget";

export function LandingPage() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Custom cursor for desktop
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const cursor = cursorRef.current;
    const ring = cursorRingRef.current;
    if (!cursor || !ring) return;

    let mx = 0,
      my = 0,
      rx = 0,
      ry = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.left = mx + "px";
      cursor.style.top = my + "px";
    };

    const animate = () => {
      rx += (mx - rx) * 0.13;
      ry += (my - ry) * 0.13;
      ring.style.left = rx + "px";
      ring.style.top = ry + "px";
      requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", handleMouseMove);
    const rafId = requestAnimationFrame(animate);

    // Hover effects
    const hoverables = document.querySelectorAll("a, button, .hoverable");
    hoverables.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursor.style.width = "18px";
        cursor.style.height = "18px";
        ring.style.width = "48px";
        ring.style.height = "48px";
      });
      el.addEventListener("mouseleave", () => {
        cursor.style.width = "10px";
        cursor.style.height = "10px";
        ring.style.width = "34px";
        ring.style.height = "34px";
      });
    });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <main className="relative overflow-x-hidden bg-navy">
      {/* Custom Cursor */}
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[9999] w-[10px] h-[10px] bg-gold rounded-full mix-blend-difference hidden lg:block"
        style={{ transform: "translate(-50%, -50%)" }}
      />
      <div
        ref={cursorRingRef}
        className="fixed pointer-events-none z-[9998] w-[34px] h-[34px] border border-gold/50 rounded-full hidden lg:block"
        style={{ transform: "translate(-50%, -50%)" }}
      />

      <Navigation />

      <HeroSection />
      <ServicesSection />
      <WhySection />
      <ContactSection />
      <Footer />
      
      <AIChatWidget />
    </main>
  );
}
