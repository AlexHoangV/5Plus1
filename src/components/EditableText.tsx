"use client";

import React, { useState, useEffect } from 'react';
import { useAdmin } from './AdminProvider';
import { useContent } from '@/hooks/useContent';
import { Check, X, Loader2 } from 'lucide-react';

interface EditableTextProps {
  contentKey: string;
  initialValue: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
}

export const EditableText: React.FC<EditableTextProps> = ({ 
  contentKey, 
  initialValue, 
  className = "", 
  as: Component = "span" 
}) => {
  const { isEditMode } = useAdmin();
  const { content, updateContent } = useContent(contentKey, initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(content);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setTempValue(content);
  }, [content]);

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaving(true);
    const success = await updateContent(tempValue);
    if (success) {
      setIsEditing(false);
    }
    setIsSaving(false);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTempValue(content);
    setIsEditing(false);
  };

  if (isEditMode) {
    if (isEditing) {
      return (
        <div className="relative inline-block w-full group">
          <textarea
            autoFocus
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className={`${className} w-full bg-muted/50 border border-primary p-2 focus:outline-none resize-none`}
            rows={tempValue.split('\n').length || 1}
          />
          <div className="absolute top-0 right-0 -translate-y-full flex gap-1 bg-primary p-1 shadow-lg z-50">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="p-1 hover:bg-white/20 text-white transition-colors"
            >
              {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            </button>
            <button 
              onClick={handleCancel}
              className="p-1 hover:bg-white/20 text-white transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      );
    }

    return (
      <Component 
        onClick={() => setIsEditing(true)}
        className={`${className} cursor-pointer hover:outline hover:outline-2 hover:outline-primary/50 hover:outline-dashed transition-all relative group`}
      >
        {content}
        <span className="absolute -top-4 right-0 text-[8px] bg-primary text-white px-1 opacity-0 group-hover:opacity-100 transition-opacity uppercase font-mono">
          Click to Edit
        </span>
      </Component>
    );
  }

  return <Component className={className}>{content}</Component>;
};
