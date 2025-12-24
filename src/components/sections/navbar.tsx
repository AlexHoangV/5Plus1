"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Projects', href: '#projects' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md border-border py-4' 
          : 'bg-white/70 backdrop-blur-sm border-transparent py-5'
      }`}
      style={{ height: '81px' }}
    >
      <div className="container mx-auto px-4 md:px-8 h-full flex items-center justify-between">
        {/* Logo */}
        <a 
          href="/" 
          className="hover:opacity-80 transition-opacity flex items-center"
        >
          <div className="relative h-14 md:h-16 w-14 md:w-16 flex items-center justify-center">
             <Image 
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/fd5536bb-3b33-40d9-82fe-c9eb5e249067-8ffd5f1e-ab3e-4090-8dc6-d4dbee2e1ca6-00-1g9tioq52f95r-riker-replit-dev/assets/icons/logo-1.png"
                alt="FIVE + ONE"
                width={64}
                height={64}
                className="object-contain"
                priority
             />
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-12">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="group relative font-mono text-[14px] uppercase tracking-[0.15em] hover:text-[#C6733B] transition-colors py-2"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#C6733B] transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 hover:text-[#C6733B] transition-colors focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <div 
        className={`md:hidden absolute top-full left-0 right-0 bg-white border-b border-border transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="flex flex-col p-6 space-y-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="font-mono text-sm uppercase tracking-widest hover:text-[#C6733B] transition-colors"
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

export default Navbar;