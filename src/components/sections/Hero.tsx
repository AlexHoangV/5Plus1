"use client";

import React from 'react';

/**
 * Hero component for the Five + One Architecture website.
 * Features a large bold "FIVE + ONE" headline, architectural subtitle with a colored border,
 * and a black promotional square on the right.
 */
const Hero = () => {
  return (
    <section className="h-screen flex items-center justify-center relative overflow-hidden px-4 sm:px-8">
        {/* Background Layer with opacity and overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Kosuke-1766602117975.jpg?width=8000&height=8000&resize=contain"
            alt="Kosuke Osawa - Principal Architect"
            className="w-full h-full object-cover grayscale opacity-20"
          />
          <div className="absolute inset-0 bg-background/40"></div>
        </div>

      {/* Content Container */}
      <div className="container mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Column: Headline and Subtitle */}
        <div className="flex flex-col">
          <h1 className="text-[5.5rem] md:text-[8rem] lg:text-[11rem] font-display font-bold leading-[0.80] tracking-[-0.06em] mb-12 flex flex-col uppercase">
            <span>FIVE</span>
            <span className="text-[#C6733B] my-2">+</span>
            <span>ONE</span>
          </h1>
          
            <div className="border-l-[6px] border-[#C6733B] pl-8 space-y-8">
              <p className="font-mono text-lg md:text-xl xl:text-2xl tracking-[0.2em] uppercase leading-tight">
                Architectural Design <br />
                &amp; Planning
              </p>
              <div className="pt-4">
                <a 
                  href="/login" 
                  className="inline-block bg-primary text-primary-foreground px-8 py-4 font-mono text-sm uppercase tracking-[0.2em] hover:bg-primary/90 transition-colors"
                >
                  Start Your Project
                </a>
              </div>
            </div>
        </div>

        {/* Right Column: Promotional Black Square */}
          <div className="hidden md:flex justify-center lg:justify-end">
            <div className="w-full max-w-[480px] lg:max-w-[560px] aspect-square relative overflow-hidden flex flex-col justify-between text-[#ffffff] p-12 lg:p-16">
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
              <span className="font-display text-8xl lg:text-9xl font-bold opacity-20 block leading-none relative z-10">
                01
              </span>
              
              {/* Quote about architectural harmony */}
              <p className="font-mono text-sm sm:text-base leading-relaxed text-justify tracking-normal lowercase relative z-10">
                &quot;Architecture is not just about building walls, but about creating spaces where nature, humanity, and light converge in harmony.&quot;
              </p>
            </div>
          </div>
      </div>
    </section>
  );
};

export default Hero;