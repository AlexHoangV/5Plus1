"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Navbar from '@/components/sections/navbar';
import Footer from '@/components/sections/Footer';
import { useLanguage } from '@/hooks/useLanguage';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function LoginPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
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

    const handleSendOtp = async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      if (!email) {
        toast.error(t('Please enter your email', 'Vui lòng nhập email'));
        return;
      }
      setIsLoading(true);
  
      try {
        const response = await fetch('/api/auth/otp/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to send OTP');
        
        setIsOtpSent(true);
        toast.success(t('OTP sent to your email', 'Mã xác thực đã được gửi đến email của bạn'));
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    const handleVerifyOtp = async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      if (otp.length !== 6) {
        toast.error(t('Please enter 6-digit code', 'Vui lòng nhập mã 6 chữ số'));
        return;
      }
      setIsLoading(true);
  
      try {
        const response = await fetch('/api/auth/otp/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otp }),
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Verification failed');
        
        toast.success(t('Successfully verified', 'Xác thực thành công'));
        
        // Use the action link returned from the server to log the user in
        if (data.action_link) {
          window.location.href = data.action_link;
        } else {
          router.push('/');
        }
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
              {isAdminMode ? t('ADMIN ACCESS', 'QUYỀN ADMIN') : t('CLIENT PORTAL', 'CỔNG KHÁCH HÀNG')}
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {isAdminMode ? t('Mode 01 | Exclusive for Kosuke', 'Chế độ 01 | Dành riêng cho Kosuke') : t('Mode 02 | OTP Verification', 'Chế độ 02 | Xác thực mã OTP')}
            </p>
          </div>

          <div className="flex border-b border-border">
            <button
              onClick={() => { setIsAdminMode(false); setIsOtpSent(false); }}
              className={`flex-1 py-3 text-[10px] uppercase tracking-widest transition-colors ${!isAdminMode ? 'bg-primary text-primary-foreground font-bold' : 'hover:bg-muted text-muted-foreground'}`}
            >
              {t('Client', 'Khách Hàng')}
            </button>
            <button
              onClick={() => setIsAdminMode(true)}
              className={`flex-1 py-3 text-[10px] uppercase tracking-widest transition-colors ${isAdminMode ? 'bg-primary text-primary-foreground font-bold' : 'hover:bg-muted text-muted-foreground'}`}
            >
              Admin
            </button>
          </div>

          {isAdminMode ? (
            <form onSubmit={handleAdminLogin} className="space-y-6">
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
          ) : (
            <div className="space-y-6">
              {!isOtpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-6">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-foreground">Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="YOUR@EMAIL.COM"
                      className="w-full bg-transparent border-b border-border py-2 text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-primary text-primary-foreground font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {isLoading ? t('SENDING...', 'ĐANG GỬI...') : t('SEND OTP CODE', 'GỬI MÃ OTP')}
                  </button>
                </form>
              ) : (
                <div className="space-y-8 flex flex-col items-center w-full">
                  <div className="text-center space-y-2">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      {t('Code sent to', 'Mã đã được gửi đến')} <span className="text-foreground font-bold">{email}</span>
                    </p>
                    <button 
                      onClick={() => { setIsOtpSent(false); setOtp(''); }}
                      className="text-[8px] uppercase tracking-tighter text-primary hover:underline"
                    >
                      {t('Change Email', 'Thay đổi Email')}
                    </button>
                  </div>
                  
                  <div className="w-full flex justify-center py-4">
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={(value) => setOtp(value)}
                      onComplete={() => handleVerifyOtp()}
                    >
                      <InputOTPGroup className="gap-2">
                        <InputOTPSlot index={0} className="w-10 h-12 text-lg border-b border-t-0 border-x-0 rounded-none bg-transparent" />
                        <InputOTPSlot index={1} className="w-10 h-12 text-lg border-b border-t-0 border-x-0 rounded-none bg-transparent" />
                        <InputOTPSlot index={2} className="w-10 h-12 text-lg border-b border-t-0 border-x-0 rounded-none bg-transparent" />
                        <InputOTPSlot index={3} className="w-10 h-12 text-lg border-b border-t-0 border-x-0 rounded-none bg-transparent" />
                        <InputOTPSlot index={4} className="w-10 h-12 text-lg border-b border-t-0 border-x-0 rounded-none bg-transparent" />
                        <InputOTPSlot index={5} className="w-10 h-12 text-lg border-b border-t-0 border-x-0 rounded-none bg-transparent" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  <div className="w-full space-y-4">
                    <button
                      onClick={() => handleVerifyOtp()}
                      disabled={isLoading || otp.length !== 6}
                      className="w-full py-4 bg-primary text-primary-foreground font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {isLoading ? t('VERIFYING...', 'ĐANG XÁC THỰC...') : t('VERIFY & LOGIN', 'XÁC THỰC & ĐĂNG NHẬP')}
                    </button>

                    <button
                      onClick={() => handleSendOtp()}
                      disabled={isLoading}
                      className="w-full text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors py-2"
                    >
                      {t('Resend Code', 'Gửi lại mã')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
