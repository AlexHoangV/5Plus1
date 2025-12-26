"use client";

import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';

/**
 * Hero component for the Five + One Architecture website.
 * Features a large bold "FIVE + ONE" headline, architectural subtitle with a colored border,
 * and a black promotional square on the right.
 */
const Hero = () => {
  const { t } = useLanguage();

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 sm:px-8 py-20 md:py-0">
      {/* Background layer removed as requested */}

      {/* Content Container */}
      <div className="container mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Column: Headline and Subtitle */}
        <div className="flex flex-col">
            <h1 className="hero-title font-display font-bold leading-[0.80] tracking-[-0.06em] mb-12 flex flex-col uppercase text-7xl sm:text-8xl md:text-9xl">
              <span>FIVE</span>
              <span className="text-[#C6733B] my-2">+</span>
              <span>ONE</span>
            </h1>

          
            <div className="border-l-[6px] border-[#C6733B] pl-6 md:pl-8 space-y-6 md:space-y-8">
              <p className="font-mono text-base md:text-xl xl:text-2xl tracking-[0.2em] uppercase leading-tight">
                {t('Architectural Design', 'Thiết Kế Kiến Trúc')} <br />
                &amp; {t('Planning', 'Quy Hoạch')}
              </p>
              <div className="pt-2 md:pt-4">
                <a 
                  href="/login" 
                  className="inline-block bg-primary text-primary-foreground px-6 py-3 md:px-8 md:py-4 font-mono text-xs md:text-sm uppercase tracking-[0.2em] hover:bg-primary/90 transition-colors"
                >
                  {t('Start Your Project', 'Bắt Đầu Dự Án')}
                </a>
              </div>
            </div>
        </div>

        {/* Right Column: Promotional Black Square - Visible on Mobile but stacked */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-[480px] lg:max-w-[560px] aspect-square relative overflow-hidden flex flex-col justify-between text-[#ffffff] p-8 md:p-12 lg:p-16">
              {/* Image Background for Section 01 */}
              <div className="absolute inset-0 z-0">
                <img
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Kosuke-1766602117975.jpg?width=8000&height=8000&resize=contain"
                  alt="Kosuke Osawa"
                  className="w-full h-full object-cover grayscale brightness-50"
                />
                <div className="absolute inset-0 bg-black/60"></div>
              </div>

              {/* Numerical 01 */}
              <span className="font-display text-7xl md:text-8xl lg:text-9xl font-bold opacity-20 block leading-none relative z-10">
                01
              </span>
              
              {/* Quote about architectural harmony */}
              <p className="font-mono text-xs sm:text-sm md:text-base leading-relaxed text-justify tracking-normal lowercase relative z-10">
                {t(
                  '"Architecture is not just about building walls, but about creating spaces where nature, humanity, and light converge in harmony."',
                  '"Kiến trúc không chỉ là xây dựng những bức tường, mà là tạo ra những không gian nơi thiên nhiên, con người và ánh sáng hội tụ trong sự hài hòa."'
                )}
              </p>
            </div>
          </div>
      </div>
    </section>
  );
};

export default Hero;
