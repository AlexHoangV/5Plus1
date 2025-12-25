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
    const [userRole, setUserRole] = useState<string | null>(null);
    const router = useRouter();

    const isAdmin = userRole === 'admin';

    useEffect(() => {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 10);
      };
      window.addEventListener('scroll', handleScroll);

      const fetchUserRole = async (userId: string) => {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .single();
        
        if (data && !error) {
          setUserRole(data.role);
        }
      };

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchUserRole(session.user.id);
        } else {
          setUserRole(null);
        }
      });

      supabase.auth.getUser().then(({ data: { user } }) => {
        setUser(user);
        if (user) {
          fetchUserRole(user.id);
        }
      });

      return () => {
        window.removeEventListener('scroll', handleScroll);
        subscription.unsubscribe();
      };
    }, []);

    const handleLogout = async () => {
      await supabase.auth.signOut();
      router.push('/');
    };

      const navLinks = [
        { name: t('Projects', 'Dự Án'), href: '/#projects' },
        { name: t('About', 'Giới Thiệu'), href: '/#about' },
        { name: t('Contact', 'Liên Hệ'), href: '/#contact' },
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
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/15624988_581414668721475_3119813739293966336_a-1766600896149.jpg?width=8000&height=8000&resize=contain"
                  alt="FIVE + ONE"
                  width={64}
                  height={64}
                  className="object-contain"
                  priority
               />
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-12">
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

            {/* Language Switcher */}
            <div className="flex items-center border-l border-border pl-8 gap-4">
                <button
                    onClick={() => setLanguage(language === 'en' ? 'vi' : 'en')}
                    className="flex items-center gap-2 font-mono text-[12px] uppercase tracking-widest hover:text-[#C6733B] transition-colors"
                    title={t('Switch to Vietnamese', 'Chuyển sang Tiếng Anh')}
                >
                    <Languages size={16} />
                    <span>{language === 'en' ? 'VN' : 'EN'}</span>
                </button>
            </div>

            {user ? (
                 <div className="flex items-center gap-6 pl-4 border-l border-border">
                   <div className="flex flex-col items-end">
                     <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">
                       {isAdmin ? 'ADMIN' : 'CLIENT'}
                     </span>
                     <span className="text-[11px] font-mono lowercase tracking-tight max-w-[120px] truncate">
                       {user.email}
                     </span>
                   </div>
                   {isAdmin && (
                     <a
                       href="/admin"
                       className="font-mono text-[12px] uppercase tracking-[0.2em] border border-primary px-4 py-2 hover:bg-primary hover:text-primary-foreground transition-all whitespace-nowrap"
                     >
                       CRM
                     </a>
                   )}
                   <a
                     href="/request-order"
                     className="font-mono text-[12px] uppercase tracking-[0.2em] bg-primary text-primary-foreground px-4 py-2 hover:opacity-90 transition-opacity whitespace-nowrap"
                   >
                     {t('Request Project', 'Yêu Cầu Dự Án')}
                   </a>
                  <button
                    onClick={handleLogout}
                    className="hover:text-[#C6733B] transition-colors pl-2"
                    title={t('Logout', 'Đăng xuất')}
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
              <a
                href="/login"
                className="flex items-center gap-2 font-mono text-[14px] uppercase tracking-[0.15em] hover:text-[#C6733B] transition-colors"
              >
                <User size={16} />
                {t('Login', 'Đăng Nhập')}
              </a>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-4 md:hidden">
            <button
                onClick={() => setLanguage(language === 'en' ? 'vi' : 'en')}
                className="p-2 hover:text-[#C6733B] transition-colors"
            >
                <span className="font-mono text-[12px] font-bold">{language === 'en' ? 'VN' : 'EN'}</span>
            </button>
            <button 
                className="p-2 hover:text-[#C6733B] transition-colors focus:outline-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

          {/* Mobile Navigation Menu */}
          <div 
            className={`md:hidden absolute top-full left-0 right-0 bg-white border-b border-border transition-all duration-300 ease-in-out ${
              mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
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
                    <div className="pt-4 border-t border-border flex flex-col gap-4">
                      {user ? (
                        <>
                          <div className="flex items-center gap-3 px-2 py-1 bg-muted/30 rounded">
                            <User size={16} className="text-primary" />
                            <div className="flex flex-col">
                              <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-mono">
                                {isAdmin ? 'ADMIN' : 'CLIENT'}
                              </span>
                              <span className="text-[11px] font-mono truncate max-w-[200px]">
                                {user.email}
                              </span>
                            </div>
                          </div>
                          {isAdmin && (
                            <a
                              href="/admin"
                              className="font-mono text-[12px] uppercase tracking-[0.2em] border border-primary px-4 py-3 text-center hover:bg-primary hover:text-primary-foreground transition-all"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              CRM
                            </a>
                          )}
                          <a
                            href="/request-order"
                            className="font-mono text-[12px] uppercase tracking-[0.2em] bg-primary text-primary-foreground px-4 py-3 text-center"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {t('Request Project', 'Yêu Cầu Dự Án')}
                          </a>
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="font-mono text-[12px] uppercase tracking-[0.2em] text-left hover:text-[#C6733B] flex items-center gap-2 pt-2 border-t border-border/50"
                      >
                        <LogOut size={16} />
                        {t('Logout', 'Đăng Xuất')}
                      </button>
                    </>
                  ) : (
                  <a
                    href="/login"
                    className="font-mono text-[12px] uppercase tracking-[0.2em] hover:text-[#C6733B]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('Login', 'Đăng Nhập')}
                  </a>
                )}
              </div>
            </div>
          </div>


    </header>
  );
};

export default Navbar;