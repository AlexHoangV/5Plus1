"use client";

import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { EditableText } from '@/components/EditableText';

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
                <EditableText 
                  contentKey="hero_subtitle"
                  initialValue={language === 'en' ? 'Architectural Design & Interior Design' : 'Thiết Kế Kiến Trúc & Nội Thất'}
                  as="p"
                  className="font-mono text-base md:text-xl xl:text-2xl tracking-[0.2em] uppercase leading-tight whitespace-pre-line"
                />
              <div className="pt-2 md:pt-4">
                <a 
                  href="#contact" 
                  className="inline-block bg-primary text-primary-foreground px-6 py-3 md:px-8 md:py-4 font-mono text-xs md:text-sm uppercase tracking-[0.2em] hover:bg-primary/90 transition-colors"
                >
                  {t('Start Your Project', 'Bắt Đầu Dự Án')}
                </a>
              </div>
            </div>
        </div>

            {/* Right Column: Promotional Black Square - Visible on Mobile but stacked */}
              <div className="flex flex-col items-start lg:items-end">
                <div className="w-full max-w-[480px] lg:max-w-[560px] aspect-square relative overflow-hidden mb-6">
                  {/* Image Background for Section 01 */}
                    <div className="absolute inset-0 z-0">
                      <img
                        src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Kosuke-1766602117975.jpg?width=8000&height=8000&resize=contain"
                        alt="Kosuke Osawa"
                        className="w-full h-full object-cover"
                      />
                    </div>
                </div>

                  {/* Slogan positioned below the image, aligned to the left of the image container */}
                  <div className="w-full max-w-[480px] lg:max-w-[560px] relative z-20">
                    <EditableText
                      contentKey="hero_slogan"
                      initialValue={language === 'en' 
                        ? '"Architecture is not just about building walls, but about creating spaces where nature, humanity, and light converge in harmony."' 
                        : '"Kiến trúc không chỉ là xây dựng những bức tường, mà là tạo ra những không gian nơi thiên nhiên, con người và ánh sáng hội tụ trong sự hài hòa."'
                      }
                      as="p"
                      className="font-mono text-xs sm:text-sm md:text-base leading-relaxed text-left tracking-normal text-black"
                    />
                  </div>
              </div>
      </div>
    </section>
  );
};

export default Hero;
