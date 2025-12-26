"use client";

import React from "react";
import { useLanguage } from "@/hooks/useLanguage";

/**
 * Footer component for the Five + One website.
 * Cloning the minimalist black footer with a centered layout.
 * Consistent with high-level design: Deep black background (#000000), 
 * bold display typography for the logo, and monospaced font for copyright.
 */
const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#000000] text-white py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-13 gap-12 items-start">
          {/* Logo Section - Fibonacci Span: 5/13 */}
          <div className="md:col-span-5 flex flex-col gap-8">
            <div className="flex items-center gap-6">
              <img 
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/15624988_581414668721475_3119813739293966336_a-1766600896149.jpg?width=8000&height=8000&resize=contain"
                alt="KOSUKE - FIVE + ONE Architecture Studio"
                className="h-16 w-16 object-contain invert"
              />
              <h2 className="font-display text-3xl md:text-4xl font-black tracking-tighter uppercase leading-none">
                FIVE <span className="text-primary font-mono">+</span> ONE
              </h2>
            </div>
            <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] leading-relaxed max-w-sm opacity-60">
              Brutalist, Zen and natural architecture through honest materials and contemporary context.
            </p>
          </div>

          {/* Empty Space - Fibonacci Span: 3/13 */}
          <div className="hidden md:block md:col-span-3" />

          {/* Social & Links Section - Fibonacci Span: 5/13 */}
          <div className="md:col-span-5 flex flex-col gap-12 md:items-end">
            <div className="grid grid-cols-2 gap-x-12 gap-y-4 md:text-right">
              <a href="https://5-plus-1.tumblr.com/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex flex-col">
                <span className="font-mono text-[10px] uppercase tracking-widest opacity-40">Blog</span>
                <span className="font-mono text-xs uppercase tracking-widest">Tumblr</span>
              </a>
              <a href="https://www.facebook.com/kousuke.osawa.98/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex flex-col">
                <span className="font-mono text-[10px] uppercase tracking-widest opacity-40">Connect</span>
                <span className="font-mono text-xs uppercase tracking-widest">Facebook</span>
              </a>
              <a href="https://www.instagram.com/f_plus_one/?hl=en" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex flex-col">
                <span className="font-mono text-[10px] uppercase tracking-widest opacity-40">Portfolio</span>
                <span className="font-mono text-xs uppercase tracking-widest">Instagram</span>
              </a>
              <a href="https://x.com/5_plus_one" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex flex-col">
                <span className="font-mono text-[10px] uppercase tracking-widest opacity-40">Updates</span>
                <span className="font-mono text-xs uppercase tracking-widest">Twitter</span>
              </a>
            </div>

            <div className="flex flex-col md:items-end gap-6 pt-12 border-t border-white/10 w-full">
              <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] leading-relaxed opacity-40">
                © 2025 Five Plus One Architecture.
                <br className="md:hidden" />
                <span className="md:ml-1">{t('All rights reserved.', 'Bản quyền được bảo lưu.')}</span>
              </p>
              
              {/* Meta Search Keywords Subtle Footer */}
              <div className="flex flex-wrap md:justify-end gap-x-4 gap-y-2 opacity-20 hover:opacity-100 transition-opacity duration-700">
                <span className="font-mono text-[8px] uppercase tracking-widest">Brutalist</span>
                <span className="font-mono text-[8px] uppercase tracking-widest">Zen</span>
                <span className="font-mono text-[8px] uppercase tracking-widest">Natural Architecture</span>
                <span className="font-mono text-[8px] uppercase tracking-widest">Kosuke</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
