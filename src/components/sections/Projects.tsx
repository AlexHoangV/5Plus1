"use client";

import React from 'react';

/**
 * ProjectsSection Component
 * 
 * Clones the "Selected Works" grid section.
 * Features:
 * - High-contrast "Selected Works" header with terracotta underline.
 * - Grid of 5 project cards.
 * - Grayscale-to-color transition on hover with 1.05x scale.
 * - Primary accent overlay on image hover.
 * - Bold display typography for titles and technical monospace for metadata.
 * - Top-border separation for card content.
 */

interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  size?: "small" | "medium" | "large";
}

const projects: Project[] = [
  {
    id: "01",
    title: "Project Mangetsu",
    category: "Da Nang / Renovation",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/2-1766603064607.png",
    size: "large"
  },
  {
    id: "02",
    title: "Truc Bach Saga",
    category: "Hanoi / Urban Mapping",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/2.2-1766603600381.png",
    size: "medium"
  },
  {
    id: "03",
    title: "Project Barbaros",
    category: "Hanoi / Social Space",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/2.3-1766603600383.png",
    size: "medium"
  },
  {
    id: "04",
    title: "Asobi Bar",
    category: "Da Nang / Commercial",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/2.4-1766603600605.png",
    size: "medium"
  },
  {
    id: "05",
    title: "Mangetsu Anatomy",
    category: "Architectural Analysis",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/4-1766603064608.png",
    size: "medium"
  },
  {
    id: "06",
    title: "Tay Ho Section",
    category: "Spatial Study / In-Progress",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/3-2-1766603600397.png",
    size: "large"
  },
  {
    id: "07",
    title: "Mangetsu Volumetric",
    category: "Exploded Axonometric",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/3-1766603064607.png",
    size: "medium"
  },
  {
    id: "08",
    title: "Lang Thang",
    category: "Cafe / Social",
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=800",
    size: "medium"
  },
  {
    id: "09",
    title: "Fu Hoo Cafe",
    category: "Commercial / Fusion",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
    size: "medium"
  },
  {
    id: "10",
    title: "Goodtime Burger",
    category: "Brutalist Dining",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
    size: "medium"
  },
  {
    id: "11",
    title: "Dot Cafe",
    category: "Compact Interior",
    image: "https://images.unsplash.com/photo-1449156001437-3a144174828b?auto=format&fit=crop&q=80&w=800",
    size: "medium"
  },
  {
    id: "12",
    title: "Tita Art Space",
    category: "Cultural Installation",
    image: "https://images.unsplash.com/photo-1503387762-592dea58ef23?auto=format&fit=crop&q=80&w=800",
    size: "large"
  },
];

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <div className="group cursor-pointer">
      {/* Image Container */}
      <div className={`relative ${project.size === 'large' ? 'aspect-[16/9]' : 'aspect-[4/5]'} overflow-hidden mb-4 bg-[#f5f5f5]`}>
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 z-10" />
        
        {/* Project Image */}
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
        />

        {/* Project Number (Revealed on hover) */}
        <span className="absolute top-4 right-4 text-4xl font-display font-black text-white opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-20">
          {project.id}
        </span>
      </div>

      {/* Content Area */}
      <div className="flex flex-col pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <h3 className="text-xl md:text-2xl font-display font-black uppercase tracking-tight mb-1 group-hover:text-[#c6733b] transition-colors leading-none">
          {project.title}
        </h3>
        <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#737373]">
          {project.category}
        </p>
      </div>
    </div>
  );
};

const ProjectsSection = () => {
  return (
    <section id="projects" className="py-24 md:py-32 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col gap-4 mb-24 md:mb-32 text-left items-start">
          <h2 className="relative text-5xl md:text-7xl lg:text-8xl font-display font-black uppercase tracking-tighter leading-none">
            Projects
            {/* The signature terracotta underline */}
            <span className="absolute -bottom-4 left-0 w-[160px] h-3 bg-[#c6733b]" />
          </h2>
          <p className="font-mono text-xs md:text-sm text-[#737373] uppercase tracking-[0.2em] mt-8 max-w-2xl">
            Selected architectural interventions / Residential, Commercial & Urban Studies
          </p>
        </div>

        {/* Project Grid - Artistic Brutalist Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-16 md:gap-x-8 md:gap-y-24">
          {/* Project 01 - Large */}
          <div className="md:col-span-12">
            <ProjectCard project={projects[0]} />
          </div>

          {/* Projects 02 & 03 - Side by Side */}
          <div className="md:col-span-6">
            <ProjectCard project={projects[1]} />
          </div>
          <div className="md:col-span-6">
            <ProjectCard project={projects[2]} />
          </div>

          {/* Project 04 - Offset */}
          <div className="md:col-span-7 md:col-start-6">
            <ProjectCard project={projects[3]} />
          </div>

          {/* Project 05 - Vertical Focus */}
          <div className="md:col-span-4">
            <ProjectCard project={projects[4]} />
          </div>

          {/* Project 06 - Large Central */}
          <div className="md:col-span-12 my-12">
            <ProjectCard project={projects[5]} />
          </div>

          {/* Projects 07 & 08 */}
          <div className="md:col-span-5">
            <ProjectCard project={projects[6]} />
          </div>
          <div className="md:col-span-7">
            <ProjectCard project={projects[7]} />
          </div>

          {/* Projects 09, 10, 11 - Triple Grid */}
          <div className="md:col-span-4">
            <ProjectCard project={projects[8]} />
          </div>
          <div className="md:col-span-4">
            <ProjectCard project={projects[9]} />
          </div>
          <div className="md:col-span-4">
            <ProjectCard project={projects[10]} />
          </div>

          {/* Project 12 - Final Large Statement */}
          <div className="md:col-span-10 md:col-start-2">
            <ProjectCard project={projects[11]} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;