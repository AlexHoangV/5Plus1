"use client";

import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const ClientStories = () => {
  const { t } = useLanguage();

  const stories = [
    {
      id: "01",
      nameEn: "Fu hoo Cafe",
      nameVi: "Fu hoo Cafe",
      descEn: "A coffee space where culture meets serenity.",
      descVi: "Một không gian cà phê giao thoa giữa văn hóa và sự tĩnh lặng.",
      image: "https://lstyxocqipkrbfoetzwd.supabase.co/storage/v1/render/image/public/document-uploads/Fu-hoo-1766607274341.jpg?width=8000&height=8000&resize=contain",
      hasVideo: true,
    },
    {
      id: "02",
      nameEn: "Xay To Am Community",
      nameVi: "Cộng đồng Xây Tổ Ấm",
      descEn: "Rated 5.0/5 from a prestigious construction community.",
      descVi: "Đánh giá 5.0/5 từ cộng đồng xây dựng uy tín.",
      quoteEn: "Five Plus One is not just an architectural design studio, but an inspiring creative journey.",
      quoteVi: "Five Plus One không chỉ là một studio thiết kế kiến trúc, mà là một hành trình sáng tạo đầy cảm hứng.",
      reviewerEn: "XAYTOAM.VN",
      reviewerVi: "XAYTOAM.VN",
      rating: 5,
    },
    {
      id: "03",
      nameEn: "Mangetsu Restaurant",
      nameVi: "Nhà Hàng Mangetsu",
      descEn: "Renovating spaces from the most rustic materials.",
      descVi: "Cải tạo không gian từ những vật liệu thô mộc nhất.",
      image: "https://lstyxocqipkrbfoetzwd.supabase.co/storage/v1/render/image/public/document-uploads/Mangetsu-1766607274341.jpg?width=8000&height=8000&resize=contain",
    },
    {
      id: "04",
      nameEn: "To Ngoc Van Apartment 'To Long'",
      nameVi: "Căn Hộ Tô Ngọc Vân 'Tơ Lòng'",
      descEn: "Apartment interior design with a strong personal touch.",
      descVi: "Thiết kế nội thất căn hộ mang đậm dấu ấn cá nhân.",
      image: "https://lstyxocqipkrbfoetzwd.supabase.co/storage/v1/render/image/public/document-uploads/To-Long-1766607274341.jpg?width=8000&height=8000&resize=contain",
    }
  ];

  return (
    <section id="stories" className="py-24 md:py-32 bg-black text-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tight">
            Client Stories
          </h2>
          <p className="text-[#737373] max-w-2xl mx-auto font-sans">
            {t(
              "Typical projects and feedback from customers about the creative journey with Five Plus One.",
              "Những dự án tiêu biểu và phản hồi từ khách hàng về hành trình sáng tạo cùng Five Plus One."
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {stories.map((story, index) => (
            <div key={index} className="space-y-6 group">
              <div className="relative aspect-video overflow-hidden bg-[#1A1A1A]">
                {story.image ? (
                  <img 
                    src={story.image} 
                    alt={story.nameEn} 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                ) : story.quoteEn ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 md:p-12 text-center space-y-6 bg-white text-black">
                    <div className="flex gap-1">
                      {[...Array(story.rating)].map((_, i) => (
                        <Star key={i} size={20} className="fill-primary text-primary" />
                      ))}
                    </div>
                    <blockquote className="text-xl md:text-2xl font-serif italic font-medium leading-relaxed">
                      "{t(story.quoteEn, story.quoteVi)}"
                    </blockquote>
                    <div className="space-y-1">
                      <p className="font-display font-bold uppercase tracking-wider">{story.reviewerEn}</p>
                      <p className="text-xs text-[#737373] uppercase tracking-widest">Review 5.0/5</p>
                    </div>
                  </div>
                ) : null}
                
                {story.hasVideo && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 cursor-pointer hover:scale-110 transition-transform">
                      <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
                    </div>
                  </div>
                )}
                
                {story.hasVideo && (
                  <div className="absolute bottom-4 left-4 bg-primary text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                    Video 01
                  </div>
                )}
              </div>
              
              <div className="space-y-1">
                <h3 className="text-xl md:text-2xl font-display font-bold uppercase">
                  KH {story.id} | {t(story.nameEn, story.nameVi)}
                </h3>
                <p className="text-[#737373] text-sm md:text-base font-sans italic">
                  {t(story.descEn, story.descVi)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Quote Section */}
        <div className="mt-32 max-w-4xl mx-auto text-center space-y-12">
          <div className="flex justify-center">
            <Quote size={60} className="text-primary opacity-50" />
          </div>
          
          <div className="space-y-8">
            <h3 className="text-3xl md:text-5xl font-display font-bold leading-tight uppercase tracking-tight">
              "{t(
                "The most important thing for me is persistence. Many people call it discipline, but to me, it's more like consistency — doing it steadily, a little bit every day.",
                "Điều quan trọng nhất với tôi là sự kiên định. Nhiều người gọi đó là kỷ luật, nhưng với tôi, nó giống như sự nhất quán hơn — làm đều đặn, mỗi ngày một chút."
              )}"
            </h3>
            
            <p className="text-[#737373] text-sm md:text-base leading-relaxed max-w-3xl mx-auto italic font-sans">
              {t(
                "When I was young, I often changed, but gradually, I realized that persistence is even stronger than severity. That's what I learned from Japan and from experiences abroad — discipline doesn't mean forcing yourself, but maintaining a rhythm and continuing to move forward every day.",
                "Khi còn trẻ, tôi hay thay đổi, nhưng dần dần, tôi nhận ra rằng sự kiên định còn mạnh mẽ hơn cả sự nghiêm khắc. Đó là điều tôi học được từ Nhật Bản và cả từ trải nghiệm ở nước ngoài — kỷ luật không có nghĩa là áp buộc bản thân, mà là duy trì nhịp điệu và tiếp tục tiến về phía trước mỗi ngày."
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientStories;
