"use client";

import React from "react";

/**
 * Footer component for the Five + One website.
 * Cloning the minimalist black footer with a centered layout.
 * Consistent with high-level design: Deep black background (#000000), 
 * bold display typography for the logo, and monospaced font for copyright.
 */
const Footer = () => {
  return (
    <footer className="bg-[#000000] text-white py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0">
          {/* Logo Section */}
            <div className="flex items-center gap-4">
              <img 
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/15624988_581414668721475_3119813739293966336_a-1766600896149.jpg?width=8000&height=8000&resize=contain"
                alt="FIVE + ONE"
                className="h-12 w-12 object-contain invert"
              />
              <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tighter uppercase flex items-center gap-2">
                FIVE <span className="text-[#C6733B] font-mono">+</span> ONE
              </h2>
            </div>

          {/* Copyright Section */}
          <div className="text-center md:text-right">
            <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] leading-relaxed opacity-60">
              © 2025 Five Plus One Architecture.
              <br className="md:hidden" />
              <span className="md:ml-1">All rights reserved.</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;