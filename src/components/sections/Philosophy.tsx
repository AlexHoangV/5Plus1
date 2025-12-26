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

        {/* New Poem/Manifesto Section - SEO OPTIMIZED */}
        <div className="mt-48 max-w-4xl mx-auto border-t border-black pt-24">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-16 uppercase tracking-tight">
            ARCHITECTURE IS LIKE THE HUMAN BODY
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32">
            {/* English Version - Primary for Global SEO */}
            <div className="space-y-8 font-mono text-sm md:text-base leading-relaxed text-black">
              <div className="space-y-4">
                <p>Architecture is not merely form.<br />It is a living system — breathing, aging, remembering.</p>
                <p>At FIVE + ONE, architecture is approached as a quiet dialogue<br />between people, materials, and time.</p>
                <p>Architecture has its own language —<br />spoken through light,<br />raw materials,<br />and exposed Brutalist structures.</p>
              </div>

              <div className="pt-12 border-t border-black/10">
                <h3 className="text-lg font-bold mb-6 uppercase">CONTEXT & CONTEMPORARY ERA</h3>
                <p className="font-bold mb-4">THE FLOW OF SOUL AND TIME</p>
                <p>Every project is a response.<br />Never imposed.<br />Never repeated.</p>
                <p className="mt-4">Our architecture is shaped by:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Natural context</li>
                  <li>Cultural memory</li>
                  <li>Contemporary social conditions</li>
                </ul>
                <p className="mt-4">FIVE + ONE exists at the intersection of<br />Zen stillness and modern reality.</p>
              </div>

              <div className="pt-12 border-t border-black/10">
                <h3 className="text-lg font-bold mb-6 uppercase">DESIGN APPROACH</h3>
                <p className="font-bold mb-4">NATURAL BRUTALIST ARCHITECTURE</p>
                <p>We do not conceal materials.<br />We do not decorate structure.<br />We do not follow trends.</p>
                <p className="mt-4">We believe in:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Honest concrete</li>
                  <li>Clear structural logic</li>
                  <li>Spaces that allow personal interpretation</li>
                </ul>
                <p className="mt-6 font-bold italic text-primary">Architecture does not need to be loud.<br />It only needs to be true.</p>
              </div>

              <div className="pt-12 border-t border-black/10">
                <h3 className="text-lg font-bold mb-6 uppercase text-primary">AND YOU — HOW ARE YOU TODAY?</h3>
                <p>Space reflects the human condition.<br />Architecture mirrors its era.</p>
                <p className="mt-4">If you seek architecture that is<br />quiet yet powerful,<br />raw yet thoughtful,<br />we are here to listen.</p>
              </div>
            </div>

            {/* Vietnamese Version - SEO & Engagement */}
            <div className="space-y-8 font-mono text-sm md:text-base leading-relaxed text-[#737373]">
              <div className="space-y-4">
                <h4 className="font-bold text-black uppercase">KIẾN TRÚC TƯƠNG TỰ NHƯ CƠ THỂ NGƯỜI.</h4>
                <p>Nó thở.<br />Nó lắng nghe.<br />Nó già đi cùng thời gian.</p>
                <p>Kiến trúc có ngôn ngữ của riêng nó —<br />không cần lời giải thích,<br />không cần phô trương.</p>
                <p>Việc của bạn<br />không phải là hiểu ngay,<br />mà là dừng lại.</p>
                <p>Lắng lại để chiêm nghiệm.<br />Quan sát những gì đang diễn ra<br />giữa không gian – ánh sáng – vật liệu – con người.</p>
                <p>Ở đó tồn tại<br />dòng chảy của tâm hồn,<br />và nhịp đập của thời đại.</p>
                <p>Chúng tôi không tạo ra hình thức.<br />Chúng tôi đáp lại bối cảnh.</p>
                <p>Không ép buộc thiên nhiên,<br />không chiều chuộng thị hiếu,<br />không chạy theo xu hướng.</p>
                <p>Chỉ là<br />sự thật thà của vật liệu,<br />sự tĩnh tại của cấu trúc,<br />và dấu ấn cá nhân không thể sao chép.</p>
                <p>Kiến trúc không cần phải ồn ào.<br />Nó chỉ cần đúng.</p>
                <p className="pt-4 font-bold text-black">Còn bạn —<br />hôm nay, bạn đang ở trạng thái nào?</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
