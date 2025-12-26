import Navbar from "@/components/sections/navbar";
import Hero from "@/components/sections/Hero";
import Philosophy from "@/components/sections/Philosophy";
import FeaturedProject from "@/components/sections/FeaturedProject";
import ProjectsSection from "@/components/sections/Projects";
import AboutUs from "@/components/sections/About";
import ContactSection from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      <main>
        <Hero />
        <Philosophy />
        <FeaturedProject />
        <ProjectsSection />
        <AboutUs />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
