"use client";

import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';

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
    title: "Project Asobi Bar",
    category: "Da Nang / Commercial",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/2.4-1766603962182.png",
    size: "medium"
  },
  {
    id: "08",
    title: "Project Tho",
    category: "Hanoi / Interior Space",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/2.7-1766603962180.png",
    size: "medium"
  },
  {
    id: "09",
    title: "Project Mangetsu Da Nang",
    category: "Axonometric Diagram",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/4-1766603962281.png",
    size: "medium"
  },
  {
    id: "10",
    title: "Project Tần Mẫn Bakery",
    category: "Commercial / Bakery",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/1.6-1766604061650.png",
    size: "medium"
  },
  {
    id: "11",
    title: "Project Mangetsu Da Nang",
    category: "Material Analysis",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/5-1766604061733.png",
    size: "medium"
  },
  {
    id: "12",
    title: "Case Study: Casa Gilardi",
    category: "Luis Barragán / Analysis",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/9-1766604061733.png",
    size: "large"
  },
];

  const ProjectCard = ({ project }: { project: Project }) => {
    return (
      <div className="group cursor-default">
        {/* Image Container */}
        <div className={`relative ${project.size === 'large' ? 'aspect-[16/9]' : 'aspect-[4/5]'} overflow-hidden mb-4 bg-[#f5f5f5]`}>
          {/* Overlay removed */}
          
            {/* Project Image */}
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover grayscale-0 transition-none"
            />
  
            {/* Project Number (Always visible) */}
            <span className="absolute top-4 right-4 text-4xl font-display font-black text-white opacity-100 z-20">
              {project.id}
            </span>
          </div>
  
          {/* Content Area (Always visible) */}
          <div className="flex flex-col pt-4 opacity-100">
          <h3 className="text-xl md:text-2xl font-display font-black uppercase tracking-tight mb-1 transition-none leading-none text-black">
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
    const { t } = useLanguage();
    
    return (
      <section id="projects" className="py-24 md:py-32 bg-white">
        <div className="container mx-auto">
          {/* Section Header */}
          <div className="flex flex-col gap-4 mb-24 md:mb-32 text-left items-start">
            <h2 className="relative section-header font-display font-black uppercase tracking-tighter leading-none">
              {t('Projects', 'Dự Án')}
            </h2>
            <p className="font-mono text-xs md:text-sm text-[#737373] uppercase tracking-[0.2em] mt-8 max-w-2xl">
              {t(
                'Selected architectural interventions / Residential, Commercial & Urban Studies',
                'Các Dự Án Kiến Trúc Tiêu Biểu / Nhà Ở, Thương Mại & Nghiên Cứu Đô Thị'
              )}
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

            {/* Poem Part 1 - Interleaved in White Space */}
            <div className="md:col-span-5 flex flex-col justify-center space-y-12">
              <div className="space-y-6">
                <p className="font-mono text-sm md:text-base leading-relaxed text-black italic">
                  ... "First in the heart is the dream-<br />
                  Then the mind starts seeking a way.<br /><br />
                  His eyes look out on the world,<br />
                  On the great wooded world,<br />
                  On the rich soil of the world,<br />
                  On the rivers of the world.<br /><br />
                  The eyes see there materials for building,<br />
                  See the difficulties, too, and the obstacles."
                </p>
                <p className="font-mono text-sm md:text-base leading-relaxed text-[#737373]">
                  ... "Ban đầu là ước mơ trong tim<br />
                  Rồi khối óc đi tìm lấy con đường<br /><br />
                  Đôi mắt hắn nhìn quanh thế giới,<br />
                  Trên thế giới rộng lớn của rừng cây<br />
                  Trên thế giới của đất đai màu mỡ<br />
                  Trên thế giới của những dòng sông<br /><br />
                  Đôi mắt thấy ở đó là vật liệu cho xây dựng,<br />
                  Và những khó khăn và cả những chướng ngại"
                </p>
              </div>
            </div>

            {/* Project 04 - Offset */}
            <div className="md:col-span-7">
              <ProjectCard project={projects[3]} />
            </div>

            {/* Project 05 - Vertical Focus */}
            <div className="md:col-span-4">
              <ProjectCard project={projects[4]} />
            </div>

            {/* Poem Part 2 - Interleaved in White Space */}
            <div className="md:col-span-8 flex flex-col justify-center pl-0 md:pl-24 space-y-12">
              <div className="space-y-6">
                <p className="font-mono text-sm md:text-base leading-relaxed text-black italic">
                  "The mind seeks a way to overcome these obstacles.<br /><br />
                  The hand seeks tools to cut the wood,<br />
                  To till the soil, and harness the power of the waters.<br /><br />
                  Then the hand seeks other hands to help,<br />
                  A community of hands to help-<br />
                  Thus, the dream becomes not one man's dream alone,<br />
                  But a community dream.<br /><br />
                  Not my dream alone, but our dream"....<br /><br />
                  <span className="not-italic font-bold">— Langston Hughes</span>
                </p>
                <p className="font-mono text-sm md:text-base leading-relaxed text-[#737373]">
                  "Khối óc lại đi tìm cách để vượt qua những chướng ngại.<br /><br />
                  Bàn tay đi tìm công cụ để chặt gỗ,<br />
                  Để xới đất và tận dụng sức mạnh của dòng nước.<br /><br />
                  Rồi bàn tay tìm kiếm sự giúp đỡ từ những bàn tay khác,<br />
                  Một cộng đồng của những bàn tay trợ lực<br />
                  Rồi, ước mơ không còn của riêng ai mà là ước mơ của cả một cộng đồng<br /><br />
                  Không phải ước mơ của mình tôi, mà của tất cả chúng ta"...
                </p>
              </div>
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
