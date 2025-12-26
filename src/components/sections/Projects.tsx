"use client";

import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Project {
  id: string;
  titleEn: string;
  titleVi: string;
  categoryEn: string;
  categoryVi: string;
  image: string;
  sketchUrl?: string;
}

const projects: Project[] = [
  {
    id: "01",
    titleEn: "Project Mangetsu",
    titleVi: "Dự Án Mangetsu",
    categoryEn: "Da Nang / Renovation",
    categoryVi: "Đà Nẵng / Cải Tạo",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/2-1766603064607.png",
  },
  {
    id: "02",
    titleEn: "Truc Bach Saga",
    titleVi: "Truyền Thuyết Trúc Bạch",
    categoryEn: "Hanoi / Urban Mapping",
    categoryVi: "Hà Nội / Quy Hoạch Đô Thị",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/2.2-1766603600381.png",
  },
  {
    id: "03",
    titleEn: "Project Barbaros",
    titleVi: "Dự Án Barbaros",
    categoryEn: "Hanoi / Social Space",
    categoryVi: "Hà Nội / Không Gian Xã Hội",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/2.3-1766603600383.png",
  },
  {
    id: "04",
    titleEn: "The Quiet Residence",
    titleVi: "Nơi Ở Tĩnh Lặng",
    categoryEn: "Residential / Interior",
    categoryVi: "Nhà Ở / Nội Thất",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/99-1766774982898.png",
  }
];

const ProjectCard = ({ project }: { project: Project }) => {
  const { t } = useLanguage();
  
  return (
    <div className="group cursor-pointer relative">
      {/* Image Container with Sketch Overlay */}
      <div className="relative aspect-[4/5] overflow-hidden mb-6 border border-white/10">
        <Image
          src={project.image}
          alt={project.titleEn}
          fill
          className="object-cover grayscale transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0"
        />
        {/* Architectural Sketch Overlay Effect */}
        <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none group-hover:opacity-60 transition-opacity duration-500">
           <Image 
             src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/97-1766774983121.png"
             alt="Sketch Overlay"
             fill
             className="object-cover invert"
           />
        </div>
        
        {/* Hover Info Overlay */}
        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
          <span className="font-mono text-xs text-white tracking-[0.3em] uppercase border border-white/50 px-6 py-2 backdrop-blur-sm">
            {t('View Project', 'Xem Dự Án')}
          </span>
        </div>
      </div>

      {/* Project Info */}
      <div className="flex flex-col gap-1">
        <h3 className="font-display text-2xl font-bold text-white tracking-tight uppercase group-hover:text-primary transition-colors">
          {t(project.titleEn, project.titleVi)}
        </h3>
        <p className="font-mono text-[10px] text-white/50 uppercase tracking-[0.2em]">
          {t(project.categoryEn, project.categoryVi)}
        </p>
      </div>
    </div>
  );
};

const ProjectsSection = () => {
  const { t } = useLanguage();
  
  return (
    <section id="projects" className="py-32 bg-[#0a0a0a] overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="mb-20">
          <h2 className="font-display text-5xl md:text-7xl font-bold text-white tracking-tight mb-8 relative inline-block">
            PROJECTS
            <div className="absolute bottom-0 left-0 w-full h-[6px] bg-primary"></div>
          </h2>
          <p className="font-mono text-xs md:text-sm text-white/40 uppercase tracking-[0.3em] max-w-2xl leading-relaxed">
            {t(
              'Selected architectural interventions / Residential, Commercial & Urban Studies',
              'Các Dự Án Kiến Trúc Tiêu Biểu / Nhà Ở, Thương Mại & Nghiên Cứu Đô Thị'
            )}
          </p>
        </div>

        {/* Project Grid / Carousel Placeholder */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {/* Navigation Arrows (Visual) */}
          <div className="hidden lg:flex absolute top-1/2 -left-16 -right-16 -translate-y-1/2 justify-between pointer-events-none">
            <button className="p-4 text-primary animate-pulse pointer-events-auto">
              <ChevronLeft size={48} className="drop-shadow-[0_0_10px_rgba(198,115,59,0.8)]" />
            </button>
            <button className="p-4 text-primary animate-pulse pointer-events-auto">
              <ChevronRight size={48} className="drop-shadow-[0_0_10px_rgba(198,115,59,0.8)]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
