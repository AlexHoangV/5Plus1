"use client";

import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';

const AboutUs = () => {
  const [mounted, setMounted] = React.useState(false);
  const { t } = useLanguage();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const godaiElements = [
    {
      kanji: "地",
      title: "Chi",
      subtitle: t("Foundation & Stability", "Nền Tảng & Sự Ổn Định"),
      isAccent: false,
    },
    {
      kanji: "水",
      title: "Sui",
      subtitle: t("Adaptability & Flow", "Sự Linh Hoạt & Dòng Chảy"),
      isAccent: false,
    },
    {
      kanji: "火",
      title: "Ka",
      subtitle: t("Passion & Energy", "Đam Mê & Năng Lượng"),
      isAccent: false,
    },
    {
      kanji: "風",
      title: "Fu",
      subtitle: t("Freedom & Movement", "Tự Do & Chuyển Động"),
      isAccent: false,
    },
    {
      kanji: "空",
      title: "Ku",
      subtitle: t("Creative Potential", "Tiềm Năng Sáng Tạo"),
      isAccent: false,
    },
    {
      kanji: "+1",
      title: t("HUMAN", "CON NGƯỜI"),
      subtitle: t("The Soul of Space", "Linh Hồn Của Không Gian"),
      isAccent: true,
    },
  ];

  if (!mounted) return null;

  return (
    <section id="about" className="py-24 md:py-32 bg-[#F5F5F5] relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left Column: Biography */}
            <div className="lg:col-span-5">
              <div className="flex flex-col gap-4 mb-8 text-left items-start">
                <h2 className="relative text-4xl md:text-6xl lg:text-7xl font-display font-bold uppercase tracking-tight text-black">
                  {t("About Us", "Về Chúng Tôi")}
                  <span className="absolute -bottom-4 left-0 w-32 h-2 bg-[#C6733B]"></span>
                </h2>
              </div>
              
                <div className="mt-16 flex flex-col md:flex-row gap-12 items-start">
                  <div className="w-full md:w-1/3 shrink-0">
                    <div className="aspect-[3/4] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                      <img 
                        src="https://lstyxocqipkrbfoetzwd.supabase.co/storage/v1/render/image/public/document-uploads/Kosuke-1766600883475.jpg?width=8000&height=8000&resize=contain" 
                        alt={t("Mr. Kosuke Osawa", "KTS. Kosuke Osawa")} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-display font-bold mb-2 text-black uppercase">{t("Mr. Kosuke Osawa", "KTS. Kosuke Osawa")}</h3>
                    <p className="font-mono text-[#C6733B] text-sm uppercase tracking-wider mb-8">
                      {t("Principal Architect", "Kiến Trúc Sư Trưởng")}
                    </p>
                    
                    <div className="prose font-mono text-sm leading-relaxed text-[#737373] space-y-6">
                      <p>
                        {t(
                          "Established in 2010, Five + One brings a unique perspective to architectural design, blending traditional Japanese minimalism with modern brutalist aesthetics.",
                          "Được thành lập vào năm 2010, Five + One mang đến một góc nhìn độc đáo cho thiết kế kiến trúc, kết hợp giữa chủ nghĩa tối giản truyền thống của Nhật Bản với thẩm mỹ thô mộc hiện đại."
                        )}
                      </p>
                        <p>
                          {t(
                            "The 'Five + One' concept is developed from Godai (The Five Great Elements) - the ancient Japanese philosophy of the five elements that form the universe: Earth, Water, Fire, Wind, and Void. The '+ One' element represents humans, the factor that connects and brings life to the architectural space.",
                            "Khái niệm 'Five + One' được phát triển từ Godai (Ngũ Đại) - triết lý Nhật Bản cổ đại về năm yếu tố hình thành nên vũ trụ: Đất, Nước, Lửa, Gió và Không. Yếu tố '+ One' đại diện cho con người, nhân tố kết nối và mang lại sự sống cho không gian kiến trúc."
                          )}
                        </p>
                    </div>
                  </div>
                </div>
            </div>


          {/* Right Column: Godai Grid */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {godaiElements.map((element, index) => (
                <div
                  key={index}
                  className={`aspect-square p-8 flex flex-col justify-between border border-[#E5E5E5] transition-all duration-300 group cursor-default ${
                    element.isAccent 
                      ? "bg-[#C6733B] border-[#C6733B] text-white" 
                      : "bg-white hover:border-[#C6733B]"
                  }`}
                >
                  <span 
                    className={`text-5xl font-serif-jp leading-none ${
                      element.isAccent 
                      ? "opacity-30" 
                      : "text-[#E5E5E5] group-hover:text-[#C6733B]/20"
                    } transition-colors`}
                  >
                    {element.kanji}
                  </span>
                  
                  <div>
                    <h4 className={`font-display text-xl font-bold mb-1 uppercase ${
                      element.isAccent ? "text-white" : "text-black"
                    }`}>
                      {element.title}
                    </h4>
                    <p className={`font-mono text-[10px] md:text-xs uppercase tracking-tight ${
                      element.isAccent ? "text-white/80" : "text-[#737373]"
                    }`}>
                      {element.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;