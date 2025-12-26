"use client";

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
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
    <section id="contact" className="py-32 bg-black relative">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <h2 className="font-display text-5xl md:text-8xl font-bold text-white uppercase tracking-tighter mb-6">
              LET'S BUILD <br />
              <span className="text-primary">TOGETHER</span>
            </h2>
            <p className="font-mono text-xs md:text-sm text-white/50 uppercase tracking-[0.3em]">
              {t(
                "Have a project in mind? We are currently accepting commissions for 2025-2026.",
                "Bạn có ý tưởng cho dự án? Chúng tôi hiện đang nhận các hợp đồng cho năm 2025-2026."
              )}
            </p>
          </div>

          {/* Form */}
          <form className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <label className="font-mono text-[10px] text-primary uppercase tracking-widest font-bold">
                {t('Name', 'Họ Tên')}
              </label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                className="bg-transparent border-b border-white/20 py-4 text-white font-mono text-sm focus:border-primary outline-none transition-colors"
                required
              />
            </div>

            <div className="flex flex-col gap-4">
              <label className="font-mono text-[10px] text-primary uppercase tracking-widest font-bold">
                Email
              </label>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                className="bg-transparent border-b border-white/20 py-4 text-white font-mono text-sm focus:border-primary outline-none transition-colors"
                required
              />
            </div>

            <div className="md:col-span-2 flex flex-col gap-4">
              <label className="font-mono text-[10px] text-primary uppercase tracking-widest font-bold">
                {t('Project Details', 'Chi Tiết Dự Án')}
              </label>
              <textarea 
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder={t('Tell us about your vision...', 'Hãy kể cho chúng tôi nghe về tầm nhìn của bạn...')}
                className="bg-transparent border-b border-white/20 py-4 text-white font-mono text-sm focus:border-primary outline-none transition-colors resize-none"
                required
              ></textarea>
            </div>

            <div className="md:col-span-2 flex justify-center mt-8">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-white text-black px-12 py-4 font-mono text-xs uppercase tracking-[0.2em] font-bold hover:bg-primary hover:text-white transition-all duration-300 flex items-center gap-4 group"
              >
                {isSubmitting ? t('SENDING...', 'ĐANG GỬI...') : t('SEND MESSAGE', 'GỬI TIN NHẮN')}
                <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
