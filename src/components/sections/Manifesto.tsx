"use client";

import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';

const Manifesto = () => {
  const { t } = useLanguage();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section id="manifesto" className="py-24 md:py-32 bg-white overflow-hidden border-t border-black">
      <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-16 uppercase tracking-tight">
              {t("ARCHITECTURE IS LIKE THE HUMAN BODY", "KIẾN TRÚC TƯƠNG TỰ NHƯ CƠ THỂ NGƯỜI")}
            </h2>
            
            <div className="space-y-8 font-mono text-sm md:text-base leading-relaxed">
              {language === 'en' ? (
                /* English Version */
                <div className="space-y-8 text-black">
                  <div className="space-y-4">
                    <p>Architecture is not merely form.<br />It is a living system — breathing, aging, remembering.</p>
                    <p>At FIVE + ONE, architecture is approached as a quiet dialogue<br />between people, materials, and time.</p>
                    <p>Architecture has its own language —<br />spoken through light,<br />raw materials,<br />and exposed Brutalist structures.</p>
                  </div>

                  <div className="pt-12 border-t border-black/10">
                    <h3 className="text-lg font-bold mb-6 uppercase text-primary">AND YOU — HOW ARE YOU TODAY?</h3>
                    <p>Space reflects the human condition.<br />Architecture mirrors its era.</p>
                    <p className="mt-4">If you seek architecture that is<br />quiet yet powerful,<br />raw yet thoughtful,<br />we are here to listen.</p>
                  </div>
                </div>
              ) : (
                /* Vietnamese Version */
                <div className="space-y-4 text-[#737373]">
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
              )}
            </div>
          </div>
      </div>
    </section>
  );
};

export default Manifesto;
