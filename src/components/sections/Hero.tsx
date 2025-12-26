"use client";

import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Image from 'next/image';

const Hero = () => {
  const { t } = useLanguage();

  return (
    <section className="min-h-screen relative flex items-center bg-black overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Content */}
        <div className="lg:col-span-7 flex flex-col pt-20 lg:pt-0">
          <h1 className="hero-title font-display font-bold leading-[0.8] tracking-[-0.05em] flex flex-col text-white uppercase select-none">
            <span className="text-8xl md:text-[10rem] lg:text-[12rem]">FIVE</span>
            <span className="text-primary text-7xl md:text-9xl my-2">+</span>
            <span className="text-8xl md:text-[10rem] lg:text-[12rem]">ONE</span>
          </h1>

          <div className="mt-12 border-l-[4px] border-primary pl-8 flex flex-col gap-8 max-w-md">
            <p className="font-mono text-sm md:text-base tracking-[0.3em] text-white/70 uppercase leading-relaxed">
              {t('Architectural Design', 'Thiết Kế Kiến Trúc')} <br />
              & {t('Planning', 'Quy Hoạch')}
            </p>
            <div>
              <a 
                href="#contact" 
                className="inline-block bg-primary text-white px-10 py-4 font-mono text-xs uppercase tracking-[0.2em] hover:bg-primary/90 transition-all duration-300"
              >
                {t('Start Your Project', 'Bắt Đầu Dự Án')}
              </a>
            </div>
          </div>
        </div>

        {/* Right Content: Founder Portrait & Quote */}
        <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[450px] aspect-[4/5] bg-zinc-900/50 backdrop-blur-sm border border-white/10 p-8 flex flex-col justify-end overflow-hidden group">
            {/* Founder Image with Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-60 z-0">
               <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(198,115,59,0.2)_0%,transparent_70%)] group-hover:opacity-100 transition-opacity duration-700"></div>
               <Image 
                 src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/KOSUKE-Ava-1766775030944.jpg"
                 alt="Kosuke Osawa"
                 fill
                 className="object-cover grayscale mix-blend-screen"
               />
            </div>

            {/* Quote Overlay */}
            <div className="relative z-10">
              <span className="font-display text-8xl font-bold opacity-10 block leading-none mb-4 text-white">01</span>
              <p className="font-mono text-[13px] md:text-sm text-white/80 leading-relaxed italic tracking-wide">
                {t(
                  '"Architecture is not just about building walls, but about creating spaces where nature, humanity, and light converge in harmony."',
                  '"Kiến trúc không chỉ là xây dựng những bức tường, mà là tạo ra những không gian nơi thiên nhiên, con người và ánh sáng hội tụ trong sự hài hòa."'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Bottom Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-[1px] h-12 bg-white/20"></div>
      </div>
    </section>
  );
};

export default Hero;
