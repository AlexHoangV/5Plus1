"use client";

import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';

const Philosophy = () => {
  const [mounted, setMounted] = React.useState(false);
  const { t } = useLanguage();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const philosophies = [
    {
      titleEn: "Balance",
      titleVi: "Cân Bằng",
      contentEn: "Of course, I also need private time, time to be creative. But when you are truly passionate about your work, that time becomes very important — you just want to work more. Therefore, when there is passion, there is almost no balance. You just work, because you feel you need to.",
      contentVi: "Tất nhiên, tôi cũng cần thời gian riêng tư, cần thời gian để sáng tạo. Nhưng khi bạn thật sự đam mê công việc của mình, quãng thời gian đó lại trở nên rất quan trọng — bạn chỉ muốn làm việc nhiều hơn. Vì thế, khi đã có đam mê, thì gần như không có sự cân bằng nào cả. Bạn chỉ làm việc, bởi vì bạn cảm thấy mình cần phải làm.",
      highlightEn: "Therefore, when there is passion, there is almost no balance. You just work, because you feel you need to.",
      highlightVi: "Vì thế, khi đã có đam mê, thì gần như không có sự cân bằng nào cả. Bạn chỉ làm việc, bởi vì bạn cảm thấy mình cần phải làm.",
    },
    {
      titleEn: "Efficiency",
      titleVi: "Hiệu Quả",
      contentEn: "Efficiency does not mean doing it fast, but using time wisely. To work efficiently, you need experience — and that means you have to accept failure. I have failed a lot, wasted a lot of time. But thanks to those experiences, I have changed. Either way, learning from failure is the key to working efficiently.",
      contentVi: "Hiệu quả không có nghĩa là làm nhanh, mà là sử dụng thời gian một cách thông minh. Để làm việc hiệu quả, bạn cần có kinh nghiệm — và điều đó có nghĩa là bạn phải chấp nhận thất bại. Tôi từng thất bại rất nhiều, lãng phí không ít thời gian. Nhưng nhờ những trải nghiệm đó, tôi đã thay đổi. Dù bằng cách nào, việc học hỏi từ thất bại chính là chìa khóa để làm việc hiệu quả.",
      highlightEn: "Either way, learning from failure is the key to working efficiently.",
      highlightVi: "Dù bằng cách nào, việc học hỏi từ thất bại chính là chìa khóa để làm việc hiệu quả.",
    }
  ];

  if (!mounted) return null;

  return (
    <section id="philosophy" className="py-24 md:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        {/* SEO H1 Hidden or Subtle */}
        <h1 className="sr-only">ARCHITECT KOSUKE | FIVE + ONE – Brutalist, Zen & Natural Architecture Studio</h1>
        
        <div className="max-w-5xl mx-auto">
          <h2 className="section-header font-display font-black uppercase tracking-tighter leading-none mb-16">
            ARCHITECTURAL PHILOSOPHY
          </h2>
          
          {philosophies.map((item, index) => (
            <React.Fragment key={index}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-start py-12">
                  <div className="space-y-2">
                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-black tracking-tight leading-none">
                      “{t(item.titleEn, item.titleVi)}”
                    </h3>
                    <p className="text-xl md:text-2xl font-mono text-black/40 uppercase tracking-widest">
                      {item.titleEn}
                    </p>
                  </div>
                  
                  <div className="space-y-8 relative">
                    <div className="text-base md:text-lg leading-relaxed text-[#737373] font-mono">
                      {t(item.contentEn, item.contentVi)}
                    </div>
                    
                    <div className="relative pl-6 border-l-2 border-black">
                      <p className="text-lg md:text-xl font-bold text-black font-mono">
                        {t(item.highlightEn, item.highlightVi)}
                      </p>
                    </div>
                  </div>
              </div>
                {index === 0 && (
                  <div className="w-full h-[1px] bg-black/20 my-12" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  export default Philosophy;
