"use client";

import React from 'react';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="flex flex-col gap-4 mb-20 md:mb-24 text-center items-center">
          <h2 className="relative text-5xl md:text-7xl lg:text-8xl font-display font-bold uppercase tracking-tight">
            Get in Touch
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-24 md:w-32 h-2 bg-primary"></span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 max-w-6xl mx-auto mt-20">
          {/* Left Column: Contact Info */}
          <div className="flex flex-col space-y-12">
            <div>
              <h3 className="font-display text-2xl font-bold uppercase tracking-wide mb-8">
                Contact Info
              </h3>
              
              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start gap-4 group">
                  <div className="mt-1 p-2 bg-muted transition-colors group-hover:text-primary">
                    <Mail size={18} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Email</p>
                    <a href="mailto:contact@5plusone.com" className="font-mono text-sm tracking-tight hover:text-primary transition-colors">
                      contact@5plusone.com
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4 group">
                  <div className="mt-1 p-2 bg-muted transition-colors group-hover:text-primary">
                    <Phone size={18} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Phone</p>
                    <a href="tel:+84901234567" className="font-mono text-sm tracking-tight hover:text-primary transition-colors">
                      +84 90 123 4567
                    </a>
                  </div>
                </div>

                {/* Office */}
                <div className="flex items-start gap-4 group">
                  <div className="mt-1 p-2 bg-muted transition-colors group-hover:text-primary">
                    <MapPin size={18} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Office</p>
                    <p className="font-mono text-sm tracking-tight">
                      District 1, Ho Chi Minh City, Vietnam
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quote Block */}
            <div className="border border-border p-8 md:p-10 relative overflow-hidden">
              <p className="font-mono text-sm leading-relaxed text-muted-foreground relative z-10 italic">
                "We believe that great architecture comes from great communication. Let's discuss your vision."
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="flex flex-col">
            <form className="flex flex-col space-y-10" onSubmit={(e) => e.preventDefault()}>
              {/* Name Input */}
              <div className="flex flex-col space-y-3">
                <label className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold">Name</label>
                <input 
                  type="text" 
                  placeholder="ENTER YOUR NAME" 
                  className="input-underline font-mono text-xs placeholder:text-muted-foreground/40"
                />
              </div>

              {/* Email Input */}
              <div className="flex flex-col space-y-3">
                <label className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold">Email</label>
                <input 
                  type="email" 
                  placeholder="ENTER YOUR EMAIL" 
                  className="input-underline font-mono text-xs placeholder:text-muted-foreground/40"
                />
              </div>

              {/* Message Input */}
              <div className="flex flex-col space-y-3">
                <label className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold">Message</label>
                <textarea 
                  rows={4}
                  placeholder="TELL US ABOUT YOUR PROJECT" 
                  className="input-underline font-mono text-xs placeholder:text-muted-foreground/40 resize-none min-h-[100px]"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="btn-primary group w-full justify-center py-5 mt-4"
              >
                Send Message
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;