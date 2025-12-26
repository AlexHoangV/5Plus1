import React from 'react';
import { Metadata } from 'next';
import Navbar from "@/components/sections/navbar";
import Footer from "@/components/sections/Footer";

interface ProjectData {
  title: string;
  category: string;
  overview: string;
  concept: string;
  material: string;
  spatial: string;
  image: string;
  related: string[];
}

const projectDatabase: Record<string, ProjectData> = {
  "project-mangetsu": {
    title: "Project Mangetsu",
    category: "Brutalist Residential Architecture",
    overview: "Project Mangetsu is a contemporary Brutalist residence designed by architect KOSUKE of FIVE + ONE. The project explores the relationship between raw materials, natural light, and human scale within an urban context.",
    concept: "Rather than imposing form, the architecture responds to its surroundings. Exposed concrete, structural clarity and spatial restraint allow the building to age naturally with time.",
    material: "The project utilizes honest materials: exposed concrete architecture, brutalist residential design, and structural expression.",
    spatial: "Quiet spaces for contemplation. The spatial sequence is designed to allow personal interpretation and a sense of stillness.",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/2-1766603064607.png",
    related: ["truc-bach-saga", "project-barbaros"]
  },
  "truc-bach-saga": {
    title: "Truc Bach Saga",
    category: "Urban Mapping & Residential",
    overview: "A study on urban density and residential life in Hanoi's Truc Bach area, resulting in a unique spatial arrangement.",
    concept: "Mapping the cultural memory of the neighborhood into a modern vertical living space.",
    material: "Honest materials used to reflect the local context while maintaining a contemporary brutalist aesthetic.",
    spatial: "Dialogue between internal void and external urban texture.",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/2.2-1766603600381.png",
    related: ["project-mangetsu", "tay-ho-section"]
  }
};

// Default for other slugs to keep it simple but functional
const getDefaultData = (slug: string): ProjectData => ({
  title: slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
  category: "Contemporary Architecture Studio",
  overview: `${slug.split('-').join(' ')} is a contemporary architectural project by architect KOSUKE of FIVE + ONE.`,
  concept: "Focusing on material honesty, structural clarity, and the flow of natural light.",
  material: "Exposed concrete and natural materials are used throughout to create a sense of timelessness.",
  spatial: "A sequence of spaces designed for human experience and contemplation.",
  image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/2-1766603064607.png",
  related: ["project-mangetsu", "truc-bach-saga"]
});

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const data = projectDatabase[params.slug] || getDefaultData(params.slug);
  return {
    title: `${data.title} | Brutalist Architecture by KOSUKE`,
    description: data.overview.substring(0, 160),
  };
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const data = projectDatabase[params.slug] || getDefaultData(params.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ArchitecturalProject",
    "name": data.title,
    "description": data.overview,
    "creator": {
      "@type": "Architect",
      "name": "KOSUKE – FIVE + ONE"
    },
    "image": data.image
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <Navbar />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4 md:px-8">
          {/* H1 Header */}
          <h1 className="text-5xl md:text-8xl font-display font-black uppercase tracking-tighter mb-12">
            {data.title}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24">
            {/* Project Image */}
            <div className="md:col-span-12">
              <div className="aspect-[21/9] bg-[#f5f5f5] overflow-hidden">
                <img 
                  src={data.image} 
                  alt={`Architectural detail of ${data.title} in contemporary brutalist design by Five Plus One`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Project Details */}
            <div className="md:col-span-8 space-y-16">
              <section>
                <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-[#737373] mb-4">Project Overview</h2>
                <h3 className="text-2xl md:text-3xl font-display font-bold mb-6">{data.category} in Contemporary Context</h3>
                <p className="text-lg md:text-xl font-mono leading-relaxed">{data.overview}</p>
              </section>

              <section>
                <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-[#737373] mb-4">Design Concept</h2>
                <h3 className="text-2xl md:text-3xl font-display font-bold mb-6">Architecture Responding to Light, Material and Time</h3>
                <p className="text-lg md:text-xl font-mono leading-relaxed">{data.concept}</p>
              </section>

              <section>
                <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-[#737373] mb-4">Material & Structure</h2>
                <h3 className="text-2xl md:text-3xl font-display font-bold mb-6">Honest Materials and Structural Expression</h3>
                <p className="text-lg md:text-xl font-mono leading-relaxed italic text-primary">{data.material}</p>
              </section>

              <section>
                <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-[#737373] mb-4">Spatial Experience</h2>
                <h3 className="text-2xl md:text-3xl font-display font-bold mb-6">Quiet Spaces for Contemplation</h3>
                <p className="text-lg md:text-xl font-mono leading-relaxed">{data.spatial}</p>
              </section>
            </div>

            {/* Sidebar / Info */}
            <div className="md:col-span-4 border-l border-black/10 pl-8">
              <div className="sticky top-32 space-y-12">
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-widest text-[#737373] mb-4">Studio</h4>
                  <p className="font-display font-bold">KOSUKE — FIVE + ONE</p>
                </div>
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-widest text-[#737373] mb-4">Focus</h4>
                  <ul className="space-y-2 font-mono text-sm">
                    <li>Exposed Concrete</li>
                    <li>Brutalist Design</li>
                    <li>Zen Stillness</li>
                  </ul>
                </div>
                
                {/* Related Projects - Internal Linking */}
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-widest text-[#737373] mb-4">Related Projects</h4>
                  <ul className="space-y-4">
                    {data.related.map(slug => (
                      <li key={slug}>
                        <a href={`/projects/${slug}`} className="font-mono text-sm uppercase hover:text-primary transition-colors underline decoration-black/20 underline-offset-4">
                          — {slug.split('-').join(' ')}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
