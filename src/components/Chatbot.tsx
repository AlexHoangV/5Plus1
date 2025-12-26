"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, User, Bot, Loader2, Linkedin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import Image from 'next/image';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const KOSUKE_AVATAR = "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Kosuke-3-1766614999280.jpg";

export function Chatbot() {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [deviceId, setDeviceId] = useState<string>('');
  const [sessionId] = useState<string>(() => Math.random().toString(36).substring(7));
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize deviceId and messages
  useEffect(() => {
    let storedId = localStorage.getItem('chatbot_device_id');
    if (!storedId) {
      storedId = 'dev_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('chatbot_device_id', storedId);
    }
    setDeviceId(storedId);

    if (messages.length === 0) {
    setMessages([
      { 
        role: 'assistant', 
        content: language === 'en' 
          ? "Welcome to the space of Five Plus One. Here, we believe architecture is not just building walls, but creating a place where Nature, People, and Light converge in harmony. I am the AI assistant of Architect Kosuke. Today, what are you looking for in your life's flow?"
          : "Chào mừng bạn đến với không gian của Five Plus One. Tại đây, chúng tôi tin rằng kiến trúc không chỉ là dựng lên những bức tường, mà là tạo ra nơi Thiên nhiên, Con người và Ánh sáng hội tụ trong sự hài hòa. Tôi là trợ lý AI của KTS Kosuke. Hôm nay, bạn ghé thăm 5plus1 để tìm kiếm điều gì cho dòng chảy cuộc sống của mình?"
      }
    ]);
    }
  }, [language, t, messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, userMessage],
          language,
          deviceId,
          sessionId
        }),
      });

      const data = await response.json();
      if (data.content) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
      } else {
        throw new Error(data.error || 'No content received');
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: t(
          'Sorry, an error occurred. Please try again later.', 
          'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.'
        ) 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-mono">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-white border border-black flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-black text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative w-10 h-10 border border-white/20 overflow-hidden">
                  <Image 
                    src={KOSUKE_AVATAR} 
                    alt="Kosuke Osawa" 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">K. Osawa</span>
                  <span className="text-[10px] opacity-70 uppercase tracking-tighter">AI Assistant</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <a 
                  href="https://www.linkedin.com/in/kosuke-osawa/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                  title="Connect on LinkedIn"
                >
                  <Linkedin size={16} />
                </a>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="hover:rotate-90 transition-transform duration-300"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 text-sm leading-relaxed ${
                    m.role === 'user' 
                    ? 'bg-primary text-white' 
                    : 'bg-secondary text-black border border-border'
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start italic text-muted-foreground text-[10px] animate-pulse">
                  Assistant is typing...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border bg-white flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Hỏi về Five + One..."
                className="flex-1 text-sm bg-transparent border-none focus:ring-0 outline-none placeholder:text-muted-foreground"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="p-2 hover:text-primary disabled:opacity-50 transition-colors"
              >
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-black text-white flex items-center justify-center shadow-xl hover:bg-primary transition-colors"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </motion.button>
    </div>
  );
}
