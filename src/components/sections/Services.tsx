"use client";

import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Compass, Armchair, Grid3X3, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Services = () => {
  const { t } = useLanguage();

  const services = [
    {
      icon: <Compass className="w-12 h-12 text-[#C6733B]" />,
      titleEn: "ARCHITECTURAL DESIGN",
      titleVi: "THIẾT KẾ KIẾN TRÚC",
      descriptionEn: "Architectural design integrates innovation, aesthetics, and functionality to create harmonious and sustainable architectural solutions.",
      descriptionVi: "Thiết kế kiến trúc tích hợp sự đổi mới, thẩm mỹ và công năng để tạo ra các giải pháp kiến trúc hài hòa và bền vững.",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/2.2-1766603600381.png"
    },
    {
      icon: <Armchair className="w-12 h-12 text-[#C6733B]" />,
      titleEn: "INTERIOR DESIGN",
      titleVi: "THIẾT KẾ NỘI THẤT",
      descriptionEn: "Interior design creates inspired living spaces, blending aesthetics with practical architectural solutions and creative consulting.",
      descriptionVi: "Thiết kế nội thất tạo ra không gian sống đầy cảm hứng, kết hợp thẩm mỹ với các giải pháp kiến trúc thực tế và tư vấn sáng tạo.",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/3-2-1766603600397.png"
    },
    {
      icon: <Grid3X3 className="w-12 h-12 text-[#C6733B]" />,
      titleEn: "MASTER PLANNING & URBANISM",
      titleVi: "QUY HOẠCH & ĐÔ THỊ",
      descriptionEn: "Master planning & urbanism involves large-scale architectural management, innovative spatial design and sustainable structural planning.",
      descriptionVi: "Quy hoạch và đô thị bao gồm quản lý kiến trúc quy mô lớn, thiết kế không gian đổi mới và lập kế hoạch cấu trúc bền vững.",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/5-1766604061733.png"
    }
  ];

  return (
    <section id="services" className="relative py-24 md:py-32 bg-[#1A1A1A] text-white overflow-hidden">
      {/* Background Architectural Sketch Effect */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-[url('https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/2-1766603064607.png')] bg-cover bg-center grayscale contrast-125 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="mb-16 md:mb-24">
          <h2 className="text-5xl md:text-7xl font-display font-bold uppercase mb-4 tracking-tight">
            {t('SERVICES', 'DỊCH VỤ')}
          </h2>
          <div className="w-32 h-1.5 bg-[#C6733B] mb-8"></div>
          <p className="font-mono text-sm md:text-base tracking-[0.3em] uppercase opacity-70">
            {t('COMPREHENSIVE ARCHITECTURAL SOLUTIONS & CREATIVE CONSULTING', 'GIẢI PHÁP KIẾN TRÚC TOÀN DIỆN & TƯ VẤN SÁNG TẠO')}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {services.map((service, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-black/40 border border-white/10 p-8 md:p-10 transition-none rounded-lg flex flex-col h-full overflow-hidden"
              >
                {/* Card Glow Effect removed */}
                
                <div className="mb-8 relative z-10 transition-none">
                  {service.icon}
                </div>
                
                <h3 className="text-2xl font-display font-bold mb-6 tracking-tight relative z-10 transition-none">
                  {t(service.titleEn, service.titleVi)}
                </h3>
                
                <p className="text-sm md:text-base text-gray-400 mb-10 leading-relaxed font-sans relative z-10 transition-none">
                  {t(service.descriptionEn, service.descriptionVi)}
                </p>
  
                {/* Illustration Sketch inside Card */}
                <div className="mt-auto relative h-48 w-full overflow-hidden rounded border border-white/5 transition-none">
                  <img 
                    src={service.image} 
                    alt={service.titleEn}
                    className="w-full h-full object-cover opacity-100 transition-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                  {/* Sketch overlay line effect */}
                  <div className="absolute inset-0 opacity-20 transition-none bg-[linear-gradient(45deg,rgba(198,115,59,0.2)_25%,transparent_25%,transparent_50%,rgba(198,115,59,0.2)_50%,rgba(198,115,59,0.2)_75%,transparent_75%,transparent)] bg-[length:4px_4px]"></div>
                </div>
              </motion.div>
            ))}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <motion.a 
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#C6733B] text-white px-10 py-5 rounded-md font-mono text-sm md:text-base uppercase tracking-[0.2em] font-bold shadow-[0_0_20px_rgba(198,115,59,0.4)] hover:shadow-[0_0_30px_rgba(198,115,59,0.6)] transition-all flex items-center gap-3"
          >
            {t('REQUEST A CONSULTATION', 'YÊU CẦU TƯ VẤN')}
            <ArrowRight className="w-5 h-5" />
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default Services;
