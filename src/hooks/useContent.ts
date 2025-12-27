"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from './useLanguage';

export const useContent = (key: string, initialValue: string) => {
  const { language } = useLanguage();
  const [content, setContent] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from('site_contents')
          .select('*')
          .eq('key', key)
          .single();

        if (error && error.code !== 'PGRST116') throw error;
        
        if (data) {
          setContent(language === 'en' ? (data.content_en || initialValue) : (data.content_vi || initialValue));
        }
      } catch (err) {
        console.error('Error fetching content:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [key, language, initialValue]);

  const updateContent = async (newContent: string) => {
    try {
      const field = language === 'en' ? 'content_en' : 'content_vi';
      
      const { error } = await supabase
        .from('site_contents')
        .upsert({ 
          key, 
          [field]: newContent,
          updated_at: new Date().toISOString()
        }, { onConflict: 'key' });

      if (error) throw error;
      setContent(newContent);
      return true;
    } catch (err) {
      console.error('Error updating content:', err);
      return false;
    }
  };

  return { content, isLoading, updateContent };
};
