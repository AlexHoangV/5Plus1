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
        <div className="max-w-5xl mx-auto">
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
                <div className="w-full h-[1px] bg-black/10 my-12" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* New Poem/Manifesto Section */}
        <div className="mt-48 max-w-4xl mx-auto border-t border-black pt-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32">
            {/* Vietnamese Version */}
            <div className="space-y-6 font-mono text-sm md:text-base leading-relaxed text-black">
              <h4 className="font-bold text-xl mb-8 uppercase tracking-tighter">KIẾN TRÚC TƯƠNG TỰ NHƯ CƠ THỂ NGƯỜI.</h4>
              <p>Nó thở.<br />Nó lắng nghe.<br />Nó già đi cùng thời gian.</p>
              <p>Kiến trúc có ngôn ngữ của riêng nó —<br />không cần lời giải thích,<br />không cần phô trương.</p>
              <p>Việc của bạn<br />không phải là hiểu ngay,<br />mà là dừng lại.</p>
              <p>Lắng lại để chiêm nghiệm.<br />Quan sát những gì đang diễn ra<br />giữa không gian – ánh sáng – vật liệu – con người.</p>
              <p>Ở đó tồn tại<br />dòng chảy của tâm hồn,<br />và nhịp đập của thời đại.</p>
              <p>Chúng tôi không tạo ra hình thức.<br />Chúng tôi đáp lại bối cảnh.</p>
              <p>Không ép buộc thiên nhiên,<br />không chiều chuộng thị hiếu,<br />không chạy theo xu hướng.</p>
              <p>Chỉ là<br />sự thật thà của vật liệu,<br />sự tĩnh tại của cấu trúc,<br />và dấu ấn cá nhân không thể sao chép.</p>
              <p>Kiến trúc không cần phải ồn ào.<br />Nó chỉ cần đúng.</p>
              <p className="pt-8">Còn bạn —<br />hôm nay, bạn đang ở trạng thái nào?</p>
            </div>

            {/* English Version */}
            <div className="space-y-6 font-mono text-sm md:text-base leading-relaxed text-[#737373] italic">
              <h4 className="font-bold text-xl mb-8 uppercase tracking-tighter not-italic text-black/40">ARCHITECTURE IS LIKE THE HUMAN BODY.</h4>
              <p>It breathes.<br />It listens.<br />It ages with time.</p>
              <p>Architecture has its own language —<br />unspoken,<br />unforced,<br />unexplained.</p>
              <p>Your role<br />is not to understand immediately,<br />but to pause.</p>
              <p>To pause and contemplate.<br />To observe what unfolds<br />between space, light, material, and people.</p>
              <p>Within this dialogue flows<br />the rhythm of the human soul,<br />and the pulse of the era.</p>
              <p>We do not design forms.<br />We respond to context.</p>
              <p>We do not dominate nature,<br />we do not flatter trends,<br />we do not chase attention.</p>
              <p>Only<br />the honesty of materials,<br />the stillness of structure,<br />and an irreproducible personal signature.</p>
              <p>Architecture does not need to be loud.<br />It only needs to be true.</p>
              <p className="pt-8 not-italic">And you —<br />how are you today?</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
