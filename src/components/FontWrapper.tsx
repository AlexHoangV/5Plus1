"use client";

import React from 'react';
import { useLanguage } from "@/hooks/useLanguage";

export function FontWrapper({ 
  children, 
  jetbrainsMonoVar, 
  gtPressuraVar 
}: { 
  children: React.ReactNode, 
  jetbrainsMonoVar: string, 
  gtPressuraVar: string 
}) {
  const { language } = useLanguage();
  
  return (
    <body
      className={`${jetbrainsMonoVar} ${gtPressuraVar} antialiased font-sans ${
        language === 'en' ? 'font-en' : 'font-vi'
      }`}
    >
      {children}
    </body>
  );
}
