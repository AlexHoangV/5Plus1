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
}

const projects: Project[] = [
  {
    id: "01",
    title: "Museum Residence",
    category: "Residential",
    image: "https://images.unsplash.com/photo-1600596542815-2a4d9fdd40d7?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "02",
    title: "Townbridge",
    category: "Commercial",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "03",
    title: "Savory Residence",
    category: "Interior",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "04",
    title: "Fire Ceramic",
    category: "Installation",
    image: "https://images.unsplash.com/photo-1600566753086-00f18cf27f43?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "05",
    title: "MW/G Apartment",
    category: "Interior",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
  },
];

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <div className="group cursor-pointer">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden mb-4 bg-[#f5f5f5]">
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-[#c6733b]/0 group-hover:bg-[#c6733b]/20 transition-colors duration-500 z-10" />
        
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
      <div className="flex flex-col border-t border-[#e5e5e5] pt-4">
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
      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="flex flex-col gap-4 mb-16 md:mb-24 text-left items-start">
          <h2 className="relative text-4xl md:text-6xl lg:text-7xl font-display font-black uppercase tracking-tighter leading-none">
            Selected Works
            {/* The signature terracotta underline */}
            <span className="absolute -bottom-4 left-0 w-[120px] h-2 bg-[#c6733b]" />
          </h2>
          <p className="font-mono text-xs md:text-sm text-[#737373] uppercase tracking-[0.15em] mt-6 max-w-xl">
            Curated collection of residential and commercial projects
          </p>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 md:gap-x-12 md:gap-y-20">
          {projects.map((project, index) => (
            <div 
              key={project.id}
              className={`${
                // Responsive layout logic if needed to match specific grid flow 
                // but standard 3-col grid handles 5 items well with an empty slot
                ""
              }`}
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;