"use client";

import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Image from 'next/image';

const GodaiElement = ({ 
  kanji, 
  titleEn, 
  titleVi, 
  descEn, 
  descVi, 
  imageUrl 
}: { 
  kanji: string; 
  titleEn: string; 
  titleVi: string; 
  descEn: string; 
  descVi: string; 
  imageUrl: string;
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="relative group overflow-hidden border-r border-black/5 last:border-r-0 h-[600px] md:h-[700px] transition-all duration-700 flex flex-col justify-end p-8">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 transition-transform duration-1000 group-hover:scale-110">
        <Image 
          src={imageUrl} 
          alt={titleEn} 
          fill 
          className="object-cover grayscale"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-4 translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
        <span className="font-serif-jp text-5xl text-white opacity-80">{kanji}</span>
        <div className="flex flex-col">
          <h3 className="font-mono text-xl text-white tracking-[0.2em] uppercase">
            {titleEn}
          </h3>
          <span className="font-mono text-[10px] text-white/50 tracking-[0.3em] uppercase">
            ({t(titleEn, titleVi)})
          </span>
        </div>
        <p className="font-sans text-xs text-white/70 leading-relaxed max-w-[200px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
          {t(descEn, descVi)}
        </p>
      </div>
    </div>
  );
};

const Philosophy = () => {
  const { t } = useLanguage();

  const elements = [
    {
      kanji: "地",
      titleEn: "CHI",
      titleVi: "Đất",
      descEn: "Stability and grounding. The foundation of existence.",
      descVi: "Sự ổn định và nền tảng. Gốc rễ của sự tồn tại.",
      imageUrl: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=2574&auto=format&fit=crop"
    },
    {
      kanji: "水",
      titleEn: "SUI",
      titleVi: "Nước",
      descEn: "Adaptability and flow. The power of change.",
      descVi: "Sự thích nghi và dòng chảy. Sức mạnh của sự thay đổi.",
      imageUrl: "https://images.unsplash.com/photo-1439405326854-014607f694d7?q=80&w=2670&auto=format&fit=crop"
    },
    {
      kanji: "火",
      titleEn: "KA",
      titleVi: "Lửa",
      descEn: "Passion and transformation. The energy of life.",
      descVi: "Đam mê và sự chuyển hóa. Năng lượng của sự sống.",
      imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2670&auto=format&fit=crop"
    },
    {
      kanji: "風",
      titleEn: "FU",
      titleVi: "Gió",
      descEn: "Freedom and movement. The breath of space.",
      descVi: "Tự do và chuyển động. Hơi thở của không gian.",
      imageUrl: "https://images.unsplash.com/photo-1508780709619-7956203a4458?q=80&w=2670&auto=format&fit=crop"
    },
    {
      kanji: "空",
      titleEn: "KU",
      titleVi: "Không",
      descEn: "Creative potential. The void where everything begins.",
      descVi: "Tiềm năng sáng tạo. Hư vô nơi mọi thứ bắt đầu.",
      imageUrl: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=2670&auto=format&fit=crop"
    },
    {
      kanji: "+1",
      titleEn: "HUMAN",
      titleVi: "Con Người",
      descEn: "The soul of the space. The observer and the center.",
      descVi: "Linh hồn của không gian. Người quan sát và trung tâm.",
      imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2670&auto=format&fit=crop"
    }
  ];

    return (
      <section id="about" className="py-24 bg-white overflow-hidden border-y border-black/5">
        <div className="container mx-auto px-6 md:px-12 mb-16 text-center">
        <h2 className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-4">
          Godai + Human
        </h2>
        <div className="w-24 h-[1px] bg-primary mx-auto mb-8"></div>
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-black/50">
          {t('Our Design Philosophy', 'Triết Lý Thiết Kế Của Chúng Tôi')}
        </p>
      </div>

      <div className="flex flex-col md:flex-row w-full max-w-[1800px] mx-auto">
        {elements.map((el, i) => (
          <GodaiElement key={i} {...el} />
        ))}
      </div>
    </section>
  );
};

export default Philosophy;
