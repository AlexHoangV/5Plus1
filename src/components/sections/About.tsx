"use client";

import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Ruler, Sofa, Map as MapIcon } from 'lucide-react';

const ExpertiseCard = ({ 
  icon: Icon, 
  titleEn, 
  titleVi, 
  descEn, 
  descVi 
}: { 
  icon: any; 
  titleEn: string; 
  titleVi: string; 
  descEn: string; 
  descVi: string;
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="bg-[#111111] p-10 border border-white/5 hover:border-primary/30 transition-all duration-500 group">
      <div className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-full mb-8 group-hover:bg-primary/20 transition-colors">
        <Icon size={24} className="text-white/50 group-hover:text-primary transition-colors" />
      </div>
      <h3 className="font-display text-2xl font-bold text-white mb-4 uppercase tracking-tight">
        {t(titleEn, titleVi)}
      </h3>
      <div className="w-10 h-[1px] bg-white/10 mb-6 group-hover:w-full group-hover:bg-primary/30 transition-all duration-700"></div>
      <p className="font-mono text-xs leading-relaxed text-white/40 uppercase tracking-widest">
        {t(descEn, descVi)}
      </p>
    </div>
  );
};

const AboutUs = () => {
  const { t } = useLanguage();

  return (
    <section id="services" className="py-32 bg-black">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20 items-end">
          <div className="lg:col-span-6">
            <h2 className="font-display text-6xl md:text-8xl font-bold text-white leading-none uppercase tracking-tighter">
              OUR <br />
              <span className="text-primary">EXPERTISE</span>
            </h2>
          </div>
          <div className="lg:col-span-6">
            <p className="font-mono text-sm text-white/50 leading-relaxed uppercase tracking-[0.2em] max-w-xl">
              {t(
                "We approach every project as a unique 'Ba' (Place/Field) - a shared space for emerging relationships. Our expertise spans across multiple scales of architectural intervention.",
                "Chúng tôi tiếp cận mỗi dự án như một 'Ba' (Địa điểm/Trường) duy nhất - một không gian chung cho các mối quan hệ mới nổi. Chuyên môn của chúng tôi trải dài trên nhiều quy mô can thiệp kiến trúc."
              )}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ExpertiseCard 
            icon={Ruler}
            titleEn="Architectural Design"
            titleVi="Thiết Kế Kiến Trúc"
            descEn="Comprehensive design solutions from concept to execution. We prioritize spatial fluidity and structural honesty."
            descVi="Giải pháp thiết kế toàn diện từ ý tưởng đến thực thi. Chúng tôi ưu tiên sự lưu thông không gian và tính trung thực của cấu trúc."
          />
          <ExpertiseCard 
            icon={Sofa}
            titleEn="Interior Design"
            titleVi="Thiết Kế Nội Thất"
            descEn="Creating internal landscapes that resonate with the human spirit. Materiality, lighting, and acoustics in harmony."
            descVi="Tạo ra những cảnh quan nội bộ cộng hưởng với tinh thần con người. Vật liệu, ánh sáng và âm học trong sự hài hòa."
          />
          <ExpertiseCard 
            icon={MapIcon}
            titleEn="Master Planning"
            titleVi="Quy Hoạch Tổng Thể"
            descEn="Urbanism and landscape strategy. Thinking beyond the building to create sustainable ecosystems."
            descVi="Đô thị và chiến lược cảnh quan. Suy nghĩ vượt ra ngoài tòa nhà để tạo ra các hệ sinh thái bền vững."
          />
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
