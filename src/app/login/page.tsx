"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Navbar from '@/components/sections/navbar';
import Footer from '@/components/sections/Footer';
import { useLanguage } from '@/hooks/useLanguage';

export default function LoginPage() {
  const { t } = useLanguage();
  const [password, setPassword] = useState('');
  const [adminUsername, setAdminUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let finalUsername = adminUsername;
      let finalPassword = password;

      // Case-insensitive check for kosuke/osawa
      if (adminUsername.toLowerCase() === 'kosuke') {
        finalUsername = 'admin@five-plus-one.com';
      }
      
      if (password.toLowerCase() === 'osawa') {
        finalPassword = 'osawa_kosuke';
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: finalUsername,
        password: finalPassword,
      });
      if (error) throw error;
      toast.success('Welcome back, Admin');
      router.push('/');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-mono flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-24 px-4">
        <div className="w-full max-w-md border border-border p-8 md:p-12 space-y-8 bg-background/50 backdrop-blur-sm">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-display font-bold uppercase tracking-tighter text-foreground">
              {t('ADMIN ACCESS', 'QUYỀN ADMIN')}
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {t('Exclusive for Kosuke', 'Dành riêng cho Kosuke')}
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-6 pt-4">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest font-bold text-foreground">
                  {t('Username', 'Tên đăng nhập')}
                </label>
                <input
                  type="text"
                  required
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="KOSUKE"
                  className="w-full bg-transparent border-b border-border py-2 text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest font-bold text-foreground">{t('Password', 'Mật khẩu')}</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="w-full bg-transparent border-b border-border py-2 text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-primary text-primary-foreground font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isLoading ? t('PROCESSING...', 'ĐANG XỬ LÝ...') : t('SIGN IN', 'ĐĂNG NHẬP')}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
