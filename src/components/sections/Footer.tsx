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
    <footer className="bg-[#000000] text-white py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0">
          {/* Logo Section */}
            <div className="flex items-center gap-4">
              <img 
                src="https://lstyxocqipkrbfoetzwd.supabase.co/storage/v1/render/image/public/document-uploads/15624988_581414668721475_3119813739293966336_a-1766600896149.jpg?width=8000&height=8000&resize=contain"
                alt="FIVE + ONE"
                className="h-12 w-12 object-contain invert"
              />
              <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tighter uppercase flex items-center gap-2">
                FIVE <span className="text-[#C6733B] font-mono">+</span> ONE
              </h2>
            </div>

            {/* Social & Copyright Section */}
            <div className="flex flex-col items-center md:items-end gap-6 text-center md:text-right">
              <div className="flex items-center gap-6">
                <a href="https://5-plus-1.tumblr.com/" target="_blank" rel="noopener noreferrer" className="hover:text-[#C6733B] transition-colors">
                  <span className="font-mono text-xs uppercase tracking-widest">Tumblr</span>
                </a>
                <a href="https://www.facebook.com/kousuke.osawa.98/" target="_blank" rel="noopener noreferrer" className="hover:text-[#C6733B] transition-colors">
                  <span className="font-mono text-xs uppercase tracking-widest">Facebook</span>
                </a>
                <a href="https://www.instagram.com/f_plus_one/?hl=en" target="_blank" rel="noopener noreferrer" className="hover:text-[#C6733B] transition-colors">
                  <span className="font-mono text-xs uppercase tracking-widest">Instagram</span>
                </a>
                <a href="https://x.com/5_plus_one" target="_blank" rel="noopener noreferrer" className="hover:text-[#C6733B] transition-colors">
                  <span className="font-mono text-xs uppercase tracking-widest">Twitter</span>
                </a>
                <a href="https://www.threads.com/@kosukeosw" target="_blank" rel="noopener noreferrer" className="hover:text-[#C6733B] transition-colors">
                  <span className="font-mono text-xs uppercase tracking-widest">Threads</span>
                </a>
                <a href="https://www.youtube.com/@kousuke0843" target="_blank" rel="noopener noreferrer" className="hover:text-[#C6733B] transition-colors">
                  <span className="font-mono text-xs uppercase tracking-widest">Youtube</span>
                </a>
              </div>
              <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] leading-relaxed opacity-60">
                © 2025 Five Plus One Architecture.
                <br className="md:hidden" />
                <span className="md:ml-1">{t('All rights reserved.', 'Bản quyền được bảo lưu.')}</span>
              </p>
            </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;