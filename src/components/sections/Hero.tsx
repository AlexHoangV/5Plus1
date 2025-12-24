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
          src="https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&amp;w=2070&amp;auto=format&amp;fit=crop"
          alt="Hero Architecture"
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-white/90"></div>
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
          
          <div className="border-l-[6px] border-[#C6733B] pl-8">
            <p className="font-mono text-lg md:text-xl xl:text-2xl tracking-[0.2em] uppercase leading-tight">
              Architectural Design <br />
              &amp; Planning
            </p>
          </div>
        </div>

        {/* Right Column: Promotional Black Square */}
        <div className="hidden md:flex justify-center lg:justify-end">
          <div className="w-full max-w-[480px] lg:max-w-[560px] aspect-square bg-[#000000] p-12 lg:p-16 flex flex-col justify-between text-[#ffffff]">
            {/* Numerical 01 */}
            <span className="font-display text-8xl lg:text-9xl font-bold opacity-20 block leading-none">
              01
            </span>
            
            {/* Quote about architectural harmony */}
            <p className="font-mono text-sm sm:text-base leading-relaxed text-justify tracking-normal lowercase">
              &quot;Architecture is not just about building walls, but about creating spaces where nature, humanity, and light converge in harmony.&quot;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;