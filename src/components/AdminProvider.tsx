"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface AdminContextType {
  isAdmin: boolean;
  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.email === 'admin@five-plus-one.com') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
        setIsEditMode(false);
      }
    };

    checkAdmin();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email === 'admin@five-plus-one.com') {
        setIsAdmin(true);
      } else {
        setIsAdmin(true); // Temporary allow for testing or if any user can be admin
        // Actually, let's stick to the email check for security
        if (session?.user?.email !== 'admin@five-plus-one.com') {
            setIsAdmin(false);
            setIsEditMode(false);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AdminContext.Provider value={{ isAdmin, isEditMode, setIsEditMode }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
