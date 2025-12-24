"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Navbar from '@/components/sections/navbar';
import Footer from '@/components/sections/Footer';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isAdminMode) {
        // Mode 01: Admin
        if (adminUsername === 'kosuke' && password === 'osawa') {
          const { error } = await supabase.auth.signInWithPassword({
            email: 'admin@five-plus-one.com',
            password: 'osawa',
          });
          if (error) throw error;
          toast.success('Welcome back, Kosuke!');
          router.push('/');
        } else {
          toast.error('Invalid admin credentials');
        }
      } else {
        // Mode 02: Regular User
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success('Successfully logged in');
        router.push('/');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (isAdminMode) return;
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      toast.success('Check your email for confirmation');
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
        <div className="w-full max-w-md border border-border p-8 md:p-12 space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-display font-bold uppercase tracking-tighter">
              {isAdminMode ? 'ADMIN ACCESS' : 'CLIENT PORTAL'}
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {isAdminMode ? 'Mode 01 | Exclusive for Kosuke' : 'Mode 02 | Client Login & Registration'}
            </p>
          </div>

          <div className="flex border-b border-border">
            <button
              onClick={() => setIsAdminMode(false)}
              className={`flex-1 py-3 text-[10px] uppercase tracking-widest transition-colors ${!isAdminMode ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
            >
              Client
            </button>
            <button
              onClick={() => setIsAdminMode(true)}
              className={`flex-1 py-3 text-[10px] uppercase tracking-widest transition-colors ${isAdminMode ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
            >
              Admin
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest font-bold">
                  {isAdminMode ? 'Username' : 'Email'}
                </label>
                <input
                  type={isAdminMode ? 'text' : 'email'}
                  required
                  value={isAdminMode ? adminUsername : email}
                  onChange={(e) => isAdminMode ? setAdminUsername(e.target.value) : setEmail(e.target.value)}
                  placeholder={isAdminMode ? 'KOSUKE' : 'YOUR@EMAIL.COM'}
                  className="w-full bg-transparent border-b border-border py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest font-bold">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="w-full bg-transparent border-b border-border py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-primary text-primary-foreground font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isLoading ? 'PROCESSING...' : 'SIGN IN'}
              </button>
              
              {!isAdminMode && (
                <button
                  type="button"
                  onClick={handleSignUp}
                  disabled={isLoading}
                  className="w-full py-4 border border-border font-bold uppercase tracking-widest hover:bg-muted transition-colors disabled:opacity-50"
                >
                  SIGN UP
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
