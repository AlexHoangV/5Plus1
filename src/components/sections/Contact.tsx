"use client";

import React, { useState, useRef } from 'react';
import { Upload, FileText, Image as ImageIcon, X, Send, Loader2 } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const ContactSection = () => {
  const { t } = useLanguage();
  const [customerName, setCustomerName] = useState('');
  const [budget, setBudget] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [briefFile, setBriefFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const briefInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'brief' | 'images') => {
    if (e.target.files) {
      if (type === 'brief') {
        setBriefFile(e.target.files[0]);
      } else {
        setImageFiles(prev => [...prev, ...Array.from(e.target.files!)]);
      }
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    setIsUploading(true);
    let briefUrl = '';
    const imageUrls: string[] = [];

    try {
      // Upload Brief
      if (briefFile) {
        const fileExt = briefFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `briefs/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('project-requests')
          .upload(filePath, briefFile);
        
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('project-requests').getPublicUrl(filePath);
        briefUrl = data.publicUrl;
      }

      // Upload Images
      for (const file of imageFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `images/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('project-requests')
          .upload(filePath, file);
        
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('project-requests').getPublicUrl(filePath);
        imageUrls.push(data.publicUrl);
      }
    } catch (error: any) {
      toast.error(`Upload failed: ${error.message}`);
      return null;
    } finally {
      setIsUploading(false);
    }

    return { briefUrl, imageUrls };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !description) {
      toast.error(t('Please fill in required fields', 'Vui lòng điền các trường bắt buộc'));
      return;
    }

    setIsSubmitting(true);
    try {
      const uploads = await uploadFiles();
      if (!uploads) return;

      const { error } = await supabase
        .from('contact_messages')
        .insert([{
          full_name: customerName,
          estimated_budget: budget,
          description: description,
          notes: notes,
          attachments: {
            brief: uploads.briefUrl,
            images: uploads.imageUrls
          },
          status: 'pending'
        }]);

      if (error) throw error;

      toast.success(t('Project request sent successfully!', 'Yêu cầu dự án đã được gửi thành công!'));
      setCustomerName('');
      setBudget('');
      setDescription('');
      setNotes('');
      setBriefFile(null);
      setImageFiles([]);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-background border-t border-border/50">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        <div className="flex flex-col gap-4 mb-16 text-center items-center">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold uppercase tracking-tight">
            PROJECT REQUEST
            <span className="block text-lg md:text-xl font-mono mt-4 opacity-60 tracking-widest uppercase">
              {t('SUBMIT YOUR VISION TO KOSUKE', 'GỬI TẦM NHÌN CỦA BẠN ĐẾN KOSUKE')}
            </span>
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="bg-background/50 backdrop-blur-sm border border-border p-6 md:p-12 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left Column */}
            <div className="space-y-10">
              <div className="space-y-4">
                <label className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold opacity-70">
                  {t('Customer Name', 'Họ Tên Khách Hàng')}
                </label>
                <input
                  required
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={t('Enter your full name...', 'Nhập họ tên của bạn...')}
                  className="w-full bg-transparent border border-border p-4 text-sm font-mono focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="space-y-4">
                <label className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold opacity-70">
                  {t('Estimated Budget', 'Ngân Sách Dự Kiến')}
                </label>
                <input
                  required
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. $10,000 - $20,000"
                  className="w-full bg-transparent border border-border p-4 text-sm font-mono focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="space-y-4">
                <label className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold opacity-70">
                  {t('Project Brief & Description', 'Mô Tả & Tầm Nhìn Dự Án')}
                </label>
                <textarea
                  required
                  rows={8}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('Describe your project, requirements, and vision...', 'Mô tả dự án, yêu cầu và tầm nhìn của bạn...')}
                  className="w-full bg-transparent border border-border p-4 text-sm font-mono focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              <div className="space-y-4">
                <label className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold opacity-70">
                  {t('Attach Brief (PDF/DOC)', 'Đính Kèm Brief (PDF/DOC)')}
                </label>
                <div 
                  onClick={() => briefInputRef.current?.click()}
                  className="relative border-2 border-dashed border-border p-8 text-center hover:border-primary transition-colors group cursor-pointer bg-muted/20"
                >
                  <input
                    type="file"
                    ref={briefInputRef}
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileChange(e, 'brief')}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="font-mono text-[10px] uppercase tracking-widest">
                      {briefFile ? briefFile.name : t('Click or Drag File', 'Nhấp hoặc Kéo Tệp')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-10">
              <div className="space-y-4">
                <label className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold opacity-70">
                  {t('Reference Images (.JPG)', 'Hình Ảnh Tham Khảo (.JPG)')}
                </label>
                <div 
                  onClick={() => imageInputRef.current?.click()}
                  className="relative border-2 border-dashed border-border p-8 text-center hover:border-primary transition-colors group cursor-pointer bg-muted/20"
                >
                  <input
                    type="file"
                    ref={imageInputRef}
                    multiple
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, 'images')}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center gap-2">
                    <ImageIcon className="text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="font-mono text-[10px] uppercase tracking-widest">{t('Add Images', 'Thêm Hình Ảnh')}</span>
                  </div>
                </div>

                {imageFiles.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {imageFiles.map((file, idx) => (
                      <div key={idx} className="relative aspect-square border border-border overflow-hidden group/img">
                        <img
                          src={URL.createObjectURL(file)}
                          alt="preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                          className="absolute top-1 right-1 bg-black/50 text-white p-1 hover:bg-black transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* NOTES for Five+One's Team */}
              <div className="space-y-4">
                <label className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold opacity-70">
                  {t('NOTES for Five+One\'s Team', 'GHI CHÚ cho Đội Ngũ Five+One')}
                </label>
                <textarea
                  rows={6}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t('Any additional notes or specific requests...', 'Bất kỳ ghi chú bổ sung hoặc yêu cầu cụ thể nào...')}
                  className="w-full bg-transparent border border-border p-4 text-sm font-mono focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          {/* SEND REQUEST button */}
          <div className="flex justify-end pt-8 border-t border-border">
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="px-12 py-5 bg-[#D17D4B] text-white font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:opacity-90 transition-opacity disabled:opacity-50 text-xs font-mono"
            >
              {isSubmitting || isUploading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {isUploading ? t('UPLOADING...', 'ĐANG TẢI LÊN...') : t('SUBMITTING...', 'ĐANG GỬI...')}
                </>
              ) : (
                <>
                  {t('SEND REQUEST', 'GỬI YÊU CẦU')}
                  <Send size={16} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;
