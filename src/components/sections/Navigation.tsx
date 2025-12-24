"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Projects", href: "#projects" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/95 backdrop-blur-sm border-b border-[#e5e5e5] h-20" 
          : "bg-transparent h-24"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 h-full flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="hover:opacity-80 transition-opacity flex items-center">
          <Image
            src="https://lstyxocqipkrbfoetzwd.supabase.co/storage/v1/object/public/test-clones/fd5536bb-3b33-40d9-82fe-c9eb5e249067-8ffd5f1e-ab3e-4090-8dc6-d4dbee2e1ca6-00-1g9tioq52f95r-riker-replit-dev/assets/icons/logo-1.png"
            alt="FIVE + ONE"
            width={64}
            height={64}
            className="h-14 md:h-16 w-auto object-contain"
            priority
          />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-12">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="group relative font-mono text-sm uppercase tracking-[0.2em] font-medium py-2 transition-colors hover:text-[#c6723b]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#c6723b] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 hover:text-[#c6723b] transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-white z-40 md:hidden transition-transform duration-500 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ top: "0" }}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          <button
            className="absolute top-8 right-8 p-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={32} />
          </button>
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="font-mono text-2xl uppercase tracking-[0.3em] font-bold hover:text-[#c6723b]"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Navigation;