"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Navbar from '@/components/sections/navbar';
import Footer from '@/components/sections/Footer';
import { Upload, FileText, Image as ImageIcon, X, Send } from 'lucide-react';

export default function RequestOrderPage() {
  const [user, setUser] = useState<any>(null);
  const [description, setDescription] = useState('');
  const [briefFile, setBriefFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please login to submit a request');
        router.push('/login');
      } else {
        setUser(user);
      }
    };
    getUser();
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'brief' | 'images') => {
    if (e.target.files) {
      if (type === 'brief') {
        setBriefFile(e.target.files[0]);
      } else {
        setImageFiles([...imageFiles, ...Array.from(e.target.files)]);
      }
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);

    try {
      let briefUrl = '';
      const imageUrls: string[] = [];

      // Upload Brief
      if (briefFile) {
        const fileExt = briefFile.name.split('.').pop();
        const fileName = `${user.id}/${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('project-requests')
          .upload(`briefs/${fileName}`, briefFile);
        
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('project-requests').getPublicUrl(`briefs/${fileName}`);
        briefUrl = data.publicUrl;
      }

      // Upload Images
      for (const file of imageFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('project-requests')
          .upload(`images/${fileName}`, file);
        
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('project-requests').getPublicUrl(`images/${fileName}`);
        imageUrls.push(data.publicUrl);
      }

      // Insert Request
      const { error: insertError } = await supabase
        .from('project-requests')
        .insert({
          user_id: user.id,
          description,
          brief_url: briefUrl,
          image_urls: imageUrls,
        });

      if (insertError) throw insertError;

      toast.success('Your request has been submitted successfully!');
      router.push('/');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background font-mono flex flex-col">
      <Navbar />
      <main className="flex-grow py-24 md:py-32 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col gap-4 mb-16 text-center items-center">
            <h1 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tight">
              PROJECT REQUEST
              <span className="block text-lg md:text-xl font-mono mt-4 opacity-60 tracking-widest uppercase">
                Submit your vision to Kosuke
              </span>
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white/50 backdrop-blur-sm border border-border p-8 md:p-12">
            <div className="space-y-10">
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold">Project Brief & Description</label>
                <textarea
                  required
                  rows={8}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your project, requirements, and vision..."
                  className="w-full bg-transparent border border-border p-4 text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold">Attach Brief (PDF/DOC)</label>
                <div className="relative border-2 border-dashed border-border p-8 text-center hover:border-primary transition-colors group cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileChange(e, 'brief')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-xs uppercase tracking-widest">
                      {briefFile ? briefFile.name : 'Click or Drag File'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-10">
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold">Reference Images (.JPG)</label>
                <div className="relative border-2 border-dashed border-border p-8 text-center hover:border-primary transition-colors group cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept=".jpg,.jpeg"
                    onChange={(e) => handleFileChange(e, 'images')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-2">
                    <ImageIcon className="text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-xs uppercase tracking-widest">Add Images</span>
                  </div>
                </div>

                {imageFiles.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {imageFiles.map((file, idx) => (
                      <div key={idx} className="relative aspect-square border border-border overflow-hidden">
                        <img
                          src={URL.createObjectURL(file)}
                          alt="preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 bg-black/50 text-white p-1 hover:bg-black transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-6 bg-primary text-primary-foreground font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isSubmitting ? 'SUBMITTING...' : (
                    <>
                      SEND REQUEST
                      <Send size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
