"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Menu, X, User, LogOut, Languages } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/hooks/useLanguage';

const Navbar = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const navLinks = [
    { name: 'PROJECTS', href: '#projects' },
    { name: 'ABOUT', href: '#about' },
    { name: 'CONTACT', href: '#contact' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-black/80 backdrop-blur-md py-4' 
          : 'bg-transparent py-8'
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="hover:opacity-80 transition-opacity">
          <div className="relative h-12 w-12 border border-white/20 p-2">
            <Image 
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/15624988_581414668721475_3119813739293966336_a-1766600896149.jpg?width=8000&height=8000&resize=contain"
              alt="FIVE + ONE"
              fill
              className="object-contain invert"
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
              className="font-mono text-[13px] text-white/70 uppercase tracking-[0.2em] hover:text-primary transition-colors"
            >
              {link.name}
            </a>
          ))}

          <div className="flex items-center gap-8 pl-8 border-l border-white/10">
            <button
              onClick={() => setLanguage(language === 'en' ? 'vi' : 'en')}
              className="flex items-center gap-2 font-mono text-[12px] text-white/50 uppercase tracking-widest hover:text-white transition-colors"
            >
              <Languages size={14} />
              <span>{language === 'en' ? 'VN' : 'EN'}</span>
            </button>

            {user ? (
              <button
                onClick={handleLogout}
                className="text-white/50 hover:text-white transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            ) : (
              <a
                href="/login"
                className="flex items-center gap-2 font-mono text-[13px] text-white/70 uppercase tracking-[0.2em] hover:text-white transition-colors"
              >
                <User size={16} />
                LOGIN
              </a>
            )}
          </div>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden absolute top-full left-0 right-0 bg-black/95 border-t border-white/10 transition-all duration-300 ${
          mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="flex flex-col p-8 gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="font-mono text-lg text-white/70 uppercase tracking-widest"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <div className="pt-8 border-t border-white/10 flex justify-between items-center">
            <button
              onClick={() => setLanguage(language === 'en' ? 'vi' : 'en')}
              className="font-mono text-white/50 uppercase"
            >
              {language === 'en' ? 'VN' : 'EN'}
            </button>
            <a href="/login" className="font-mono text-white/70 uppercase">
              LOGIN
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
