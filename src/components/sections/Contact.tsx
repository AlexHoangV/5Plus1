"use client";

import React, { useState, useRef } from 'react';
import { Mail, Phone, MapPin, ArrowRight, Upload, X, FileText, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const ContactSection = () => {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    notes: '',
    estimated_budget: '',
    country: '',
    project_type: '',
    start_date: '',
    location: '',
    role: '',
    description: '',
    worked_with_architect: '',
    hear_about_us: ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return [];
    
    setIsUploading(true);
    const uploadedUrls = [];
    
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `contact-attachments/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('project-requests')
        .upload(filePath, file);
        
      if (error) {
        console.error('Upload error:', error);
        toast.error(`Failed to upload ${file.name}`);
        continue;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('project-requests')
        .getPublicUrl(filePath);
        
      uploadedUrls.push({
        name: file.name,
        url: publicUrl,
        type: file.type
      });
    }
    
    setIsUploading(false);
    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.email || !formData.description) {
      toast.error(t('Please fill in required fields', 'Vui lòng điền các trường bắt buộc'));
      return;
    }

    setIsSubmitting(true);
    try {
      const attachments = await uploadFiles();
      
      const { error } = await supabase
        .from('contact_messages')
        .insert([{
          ...formData,
          name: formData.full_name, // Map for backward compatibility if needed
          message: formData.description, // Map for backward compatibility
          attachments: attachments
        }]);

      if (error) throw error;

      toast.success(t('Project request sent successfully!', 'Yêu cầu dự án đã được gửi thành công!'));
      setFormData({
        full_name: '',
        phone: '',
        email: '',
        notes: '',
        estimated_budget: '',
        country: '',
        project_type: '',
        start_date: '',
        location: '',
        role: '',
        description: '',
        worked_with_architect: '',
        hear_about_us: ''
      });
      setFiles([]);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full bg-transparent border-b border-border/50 py-3 font-mono text-xs focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/30";
  const labelClasses = "font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/70";

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-20 max-w-7xl mx-auto mt-20">
          {/* Left Column: Contact Info */}
          <div className="lg:col-span-1 flex flex-col space-y-12">
            <div>
              <h3 className="font-display text-2xl font-bold uppercase tracking-wide mb-8">
                {t('Contact Info', 'Thông Tin')}
              </h3>
              
              <div className="space-y-8">
                {/* Email */}
                <div className="flex items-start gap-4 group">
                  <div className="mt-1 p-2 bg-muted transition-colors group-hover:text-primary">
                    <Mail size={18} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className={labelClasses}>Email</p>
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
                    <p className={labelClasses}>{t('Phone', 'Điện Thoại')}</p>
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
                      <p className={labelClasses}>{t('Office', 'Văn Phòng')}</p>
                      <p className="font-mono text-sm tracking-tight">
                        {t('District 1, Ho Chi Minh City, Vietnam', 'Quận 1, TP. Hồ Chí Minh, Việt Nam')}
                      </p>
                    </div>
                </div>
              </div>
            </div>

            {/* Quote Block */}
            <div className="border border-border p-8 md:p-10 relative overflow-hidden bg-muted/30">
              <p className="font-mono text-sm leading-relaxed text-muted-foreground relative z-10 italic">
                {t(
                  '"We believe that great architecture comes from great communication. Let\'s discuss your vision."',
                  '"Chúng tôi tin rằng kiến trúc tuyệt vời đến từ sự kết nối tuyệt vời. Hãy thảo luận về tầm nhìn của bạn."'
                )}
              </p>
            </div>
          </div>

          {/* Right Column: Detailed Data Collection Form */}
          <div className="lg:col-span-2">
            <form className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10" onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="flex flex-col space-y-2">
                <label className={labelClasses}>{t('What is your full name?', 'Họ và tên của bạn là gì?')}</label>
                <input 
                  type="text" 
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder={t('NAME', 'HỌ TÊN')}
                  className={inputClasses}
                  required
                />
              </div>

              {/* Phone Number */}
              <div className="flex flex-col space-y-2">
                <label className={labelClasses}>{t('May we have your phone number?', 'Số điện thoại của bạn?')}</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder={t('PHONE NUMBER', 'SỐ ĐIỆN THOẠI')}
                  className={inputClasses}
                />
              </div>

              {/* Emails */}
              <div className="flex flex-col space-y-2">
                <label className={labelClasses}>{t('Your Emails?', 'Email của bạn?')}</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={t('EMAIL ADDRESS', 'ĐỊA CHỈ EMAIL')}
                  className={inputClasses}
                  required
                />
              </div>

              {/* Country */}
              <div className="flex flex-col space-y-2">
                <label className={labelClasses}>{t('Which country are you located in?', 'Bạn đang ở quốc gia nào?')}</label>
                <input 
                  type="text" 
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder={t('COUNTRY', 'QUỐC GIA')}
                  className={inputClasses}
                />
              </div>

              {/* Project Type */}
              <div className="flex flex-col space-y-2">
                <label className={labelClasses}>{t('What type of project are you planning?', 'Loại hình dự án?')}</label>
                <select 
                  value={formData.project_type}
                  onChange={(e) => setFormData({ ...formData, project_type: e.target.value })}
                  className={inputClasses}
                >
                  <option value="">{t('SELECT TYPE', 'CHỌN LOẠI HÌNH')}</option>
                  <option value="residential">{t('Residential', 'Nhà ở')}</option>
                  <option value="commercial">{t('Commercial', 'Thương mại')}</option>
                  <option value="interior">{t('Interior', 'Nội thất')}</option>
                  <option value="hospitality">{t('Hospitality', 'Khách sạn/Nghỉ dưỡng')}</option>
                  <option value="other">{t('Other', 'Khác')}</option>
                </select>
              </div>

              {/* Start Date */}
              <div className="flex flex-col space-y-2">
                <label className={labelClasses}>{t('When would you like to start?', 'Khi nào bạn muốn bắt đầu?')}</label>
                <input 
                  type="text" 
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  placeholder={t('E.G. NEXT MONTH, AS SOON AS POSSIBLE', 'VD: THÁNG SAU, CÀNG SỚM CÀNG TỐT')}
                  className={inputClasses}
                />
              </div>

              {/* Project Location */}
              <div className="flex flex-col space-y-2 md:col-span-2">
                <label className={labelClasses}>{t('Where will your project take place?', 'Vị trí địa lý của dự án?')}</label>
                <input 
                  type="text" 
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder={t('ADDRESS OR AREA', 'ĐỊA CHỈ HOẶC KHU VỰC')}
                  className={inputClasses}
                />
              </div>

              {/* Estimated Budget */}
              <div className="flex flex-col space-y-2">
                <label className={labelClasses}>{t("What's your estimated project budget?", 'Ngân sách dự kiến?')}</label>
                <input 
                  type="text" 
                  value={formData.estimated_budget}
                  onChange={(e) => setFormData({ ...formData, estimated_budget: e.target.value })}
                  placeholder={t('BUDGET RANGE', 'KHOẢNG NGÂN SÁCH')}
                  className={inputClasses}
                />
              </div>

              {/* Role */}
              <div className="flex flex-col space-y-2">
                <label className={labelClasses}>{t('What is your role in this project?', 'Vai trò của bạn trong dự án?')}</label>
                <input 
                  type="text" 
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder={t('OWNER, DEVELOPER, ETC.', 'CHỦ ĐẦU TƯ, NHÀ PHÁT TRIỂN, ...')}
                  className={inputClasses}
                />
              </div>

              {/* Description */}
              <div className="flex flex-col space-y-2 md:col-span-2">
                <label className={labelClasses}>{t('Please share a brief description of your project.', 'Mô tả ngắn gọn về dự án của bạn.')}</label>
                <textarea 
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={t('DESCRIBE YOUR VISION...', 'MÔ TẢ TẦM NHÌN CỦA BẠN...')}
                  className={`${inputClasses} resize-none min-h-[80px]`}
                  required
                ></textarea>
              </div>

              {/* Worked with architect */}
              <div className="flex flex-col space-y-2">
                <label className={labelClasses}>{t('Have you worked with an architect before?', 'Bạn đã từng làm việc với kiến trúc sư chưa?')}</label>
                <div className="flex gap-6 py-2">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="architect" 
                      value="yes"
                      checked={formData.worked_with_architect === 'yes'}
                      onChange={(e) => setFormData({ ...formData, worked_with_architect: e.target.value })}
                      className="accent-primary"
                    />
                    <span className="font-mono text-[10px] uppercase tracking-wider">{t('Yes', 'Rồi')}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="architect" 
                      value="no"
                      checked={formData.worked_with_architect === 'no'}
                      onChange={(e) => setFormData({ ...formData, worked_with_architect: e.target.value })}
                      className="accent-primary"
                    />
                    <span className="font-mono text-[10px] uppercase tracking-wider">{t('No', 'Chưa')}</span>
                  </label>
                </div>
              </div>

              {/* Hear about us */}
              <div className="flex flex-col space-y-2">
                <label className={labelClasses}>{t('How did you hear about us?', 'Bạn biết đến chúng tôi qua đâu?')}</label>
                <input 
                  type="text" 
                  value={formData.hear_about_us}
                  onChange={(e) => setFormData({ ...formData, hear_about_us: e.target.value })}
                  placeholder={t('SOCIAL MEDIA, WORD OF MOUTH, ETC.', 'MẠNG XÃ HỘI, TRUYỀN MIỆNG, ...')}
                  className={inputClasses}
                />
              </div>

              {/* Attachments */}
              <div className="flex flex-col space-y-4 md:col-span-2">
                <label className={labelClasses}>{t('Request Doc/PDF attachments / Images', 'Tài liệu Doc/PDF / Hình ảnh đính kèm')}</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border/50 p-8 rounded-none hover:border-primary/50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 bg-muted/20"
                >
                  <Upload size={24} className="text-muted-foreground" />
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {t('Click or drag files to upload', 'Nhấp hoặc kéo tệp để tải lên')}
                  </p>
                  <p className="text-[9px] text-muted-foreground/50 font-mono italic">
                    {t('SUPPORTED: PDF, DOCX, JPG, PNG', 'HỖ TRỢ: PDF, DOCX, JPG, PNG')}
                  </p>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple 
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />

                {/* File List */}
                {files.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-border bg-muted/30">
                        <div className="flex items-center gap-3 overflow-hidden">
                          {file.type.includes('image') ? <ImageIcon size={16} /> : <FileText size={16} />}
                          <span className="font-mono text-[10px] truncate max-w-[150px]">{file.name}</span>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => removeFile(index)}
                          className="p-1 hover:text-destructive transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="flex flex-col space-y-2 md:col-span-2">
                <label className={labelClasses}>{t('Additional Notes', 'Ghi chú thêm')}</label>
                <textarea 
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder={t('ANYTHING ELSE YOU WANT US TO KNOW?', 'BẤT CỨ ĐIỀU GÌ KHÁC BẠN MUỐN CHÚNG TÔI BIẾT?')}
                  className={inputClasses}
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2 pt-6">
                <button 
                  type="submit" 
                  disabled={isSubmitting || isUploading}
                  className="btn-primary group w-full justify-center py-6 disabled:opacity-50"
                >
                  {isSubmitting || isUploading ? (
                    <span className="flex items-center gap-3">
                      <Loader2 size={18} className="animate-spin" />
                      {isUploading ? t('UPLOADING FILES...', 'ĐANG TẢI TỆP LÊN...') : t('SENDING REQUEST...', 'ĐANG GỬI YÊU CẦU...')}
                    </span>
                  ) : (
                    <span className="flex items-center gap-3">
                      {t('SEND REQUEST', 'GỬI YÊU CẦU')}
                      <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  )}
                </button>
              </div>
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
                  className="block w-full md:w-[324px] h-[200px] bg-primary text-primary-foreground flex items-center justify-center font-display text-2xl font-bold uppercase tracking-tighter hover:opacity-90 transition-opacity text-center px-8"
                >
                  {t('BUILD WITH US!', 'CÙNG XÂY NGAY!')}
                </a>
              </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
