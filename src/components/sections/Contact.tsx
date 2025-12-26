"use client";

import React, { useState } from 'react';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const ContactSection = () => {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([formData]);

      if (error) throw error;

      toast.success(t('Message sent successfully!', 'Gửi tin nhắn thành công!'));
      setFormData({ name: '', email: '', message: '' });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="flex flex-col gap-4 mb-20 md:mb-24 text-center items-center">
          <h2 className="relative text-5xl md:text-7xl lg:text-8xl font-display font-bold uppercase tracking-tight">
            {t('Get in Touch', 'Liên Hệ')}
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-24 md:w-32 h-2 bg-primary"></span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 max-w-6xl mx-auto mt-20">
          {/* Left Column: Contact Info */}
          <div className="flex flex-col space-y-12">
            <div>
              <h3 className="font-display text-2xl font-bold uppercase tracking-wide mb-8">
                {t('Contact Info', 'Thông Tin')}
              </h3>
              
              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start gap-4 group">
                  <div className="mt-1 p-2 bg-muted transition-colors group-hover:text-primary">
                    <Mail size={18} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Email</p>
                    <a href="mailto:contact@5plusone.com" className="font-mono text-sm tracking-tight hover:text-primary transition-colors">
                      contact@5plusone.com
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4 group">
                  <div className="mt-1 p-2 bg-muted transition-colors group-hover:text-primary">
                    <Phone size={18} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{t('Phone', 'Điện Thoại')}</p>
                    <a href="tel:+84901234567" className="font-mono text-sm tracking-tight hover:text-primary transition-colors">
                      +84 90 123 4567
                    </a>
                  </div>
                </div>

                {/* Office */}
                <div className="flex items-start gap-4 group">
                  <div className="mt-1 p-2 bg-muted transition-colors group-hover:text-primary">
                    <MapPin size={18} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{t('Office', 'Văn Phòng')}</p>
                    <p className="font-mono text-sm tracking-tight">
                      District 1, Ho Chi Minh City, Vietnam
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quote Block */}
            <div className="border border-border p-8 md:p-10 relative overflow-hidden">
              <p className="font-mono text-sm leading-relaxed text-muted-foreground relative z-10 italic">
                {t(
                  '"We believe that great architecture comes from great communication. Let\'s discuss your vision."',
                  '"Chúng tôi tin rằng kiến trúc tuyệt vời đến từ sự kết nối tuyệt vời. Hãy thảo luận về tầm nhìn của bạn."'
                )}
              </p>
            </div>
          </div>

            {/* Right Column: Contact Form */}
            <div className="flex flex-col">
              <form className="flex flex-col space-y-10" onSubmit={handleSubmit}>
                {/* Name Input */}
                <div className="flex flex-col space-y-3">
                  <label className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold">{t('Name', 'Họ Tên')}</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t('ENTER YOUR NAME', 'NHẬP HỌ TÊN')}
                    className="input-underline font-mono text-xs placeholder:text-muted-foreground/40"
                    required
                  />
                </div>
  
                {/* Email Input */}
                <div className="flex flex-col space-y-3">
                  <label className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold">Email</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={t('ENTER YOUR EMAIL', 'NHẬP EMAIL')}
                    className="input-underline font-mono text-xs placeholder:text-muted-foreground/40"
                    required
                  />
                </div>
  
                {/* Message Input */}
                <div className="flex flex-col space-y-3">
                  <label className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold">{t('Message', 'Lời Nhắn')}</label>
                  <textarea 
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={t('TELL US ABOUT YOUR PROJECT', 'HÃY CHO CHÚNG TÔI BIẾT VỀ DỰ ÁN CỦA BẠN')}
                    className="input-underline font-mono text-xs placeholder:text-muted-foreground/40 resize-none min-h-[100px]"
                    required
                  ></textarea>
                </div>
  
                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn-primary group w-full justify-center py-5 mt-4 disabled:opacity-50"
                >
                  {isSubmitting ? t('Sending...', 'Đang gửi...') : t('Send Message', 'Gửi Lời Nhắn')}
                  {!isSubmitting && <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />}
                </button>
              </form>
            </div>
          </div>

          {/* New CTA Section */}
          <div className="mt-32 pt-24 border-t border-border">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="max-w-xl text-center md:text-left">
                <h3 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tight mb-6">
                  {t('Book a Consultant Today!', 'Đặt Lịch Tư Vấn Ngay!')}
                </h3>
                <p className="font-mono text-sm tracking-widest opacity-60 uppercase mb-8">
                  {t(
                    'Explore our vision through these exclusive showcases.',
                    'Khám phá tầm nhìn của chúng tôi qua các buổi giới thiệu độc quyền.'
                  )}
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <a 
                    href="https://www.youtube.com/watch?v=kgQ1mJcg2UA&t=3s" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-6 py-3 border border-border font-mono text-[10px] uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    Vision 01
                  </a>
                  <a 
                    href="https://www.youtube.com/watch?v=qqk0fI4iGyU" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-6 py-3 border border-border font-mono text-[10px] uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    Vision 02
                  </a>
                  <a 
                    href="https://www.youtube.com/watch?v=xeDwV6fesLQ" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-6 py-3 border border-border font-mono text-[10px] uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    Vision 03
                  </a>
                </div>
              </div>
              
              <div className="w-full md:w-auto">
                <a 
                  href="/request-order"
                  className="block w-full md:w-[400px] h-[150px] bg-primary text-primary-foreground flex items-center justify-center font-display text-2xl font-bold uppercase tracking-tighter hover:opacity-90 transition-opacity text-center px-8"
                >
                  {t('Start Your Project Journey', 'Bắt Đầu Hành Trình Dự Án')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
};


export default ContactSection;
