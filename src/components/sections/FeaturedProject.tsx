"use client";

import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Image from 'next/image';

const FeaturedProject = () => {
  const { t } = useLanguage();

    return (
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Project Image */}
          <div className="relative aspect-[4/5] overflow-hidden shadow-2xl">
            <Image 
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/99-1766774982898.png"
              alt="The Quiet Residence"
              fill
              className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col gap-10">
            <div>
              <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4 relative inline-block">
                FEATURED PROJECT
                <div className="absolute bottom-0 left-0 w-full h-[4px] bg-primary"></div>
              </h2>
            </div>

            <div className="flex flex-col gap-6">
              <h3 className="font-display text-5xl md:text-7xl font-bold uppercase leading-none tracking-tighter">
                THE QUIET <br /> RESIDENCE
              </h3>
              <p className="font-sans text-lg text-black/60 leading-relaxed max-w-xl">
                {t(
                  "A sanctuary designed around the principles of light and void, embodying the 'Ku' (Void) element. This space invites contemplation and connection with nature.",
                  "Một nơi trú ẩn được thiết kế dựa trên các nguyên tắc của ánh sáng và hư vô, hiện thân của yếu tố 'Ku' (Không). Không gian này mời gọi sự chiêm nghiệm và kết nối với thiên nhiên."
                )}
              </p>
            </div>

            <div className="flex flex-col gap-8">
              <div className="bg-primary p-12 max-w-xs relative overflow-hidden group">
                <span className="absolute top-4 right-4 text-white/10 text-6xl font-display font-bold">+1</span>
                <p className="font-mono text-[10px] text-white/50 uppercase tracking-[0.3em] mb-2">
                  FOCUS:
                </p>
                <p className="font-display text-2xl font-bold text-white uppercase tracking-tight">
                  MINDFUL <br /> LIVING
                </p>
              </div>

              <div>
                <a 
                  href="#projects" 
                  className="inline-block border-2 border-black px-12 py-4 font-mono text-xs font-bold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-300"
                >
                  {t('VIEW FULL PROJECT', 'XEM TOÀN BỘ DỰ ÁN')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProject;
