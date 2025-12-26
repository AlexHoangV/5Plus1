import Navbar from "@/components/sections/navbar";
import Hero from "@/components/sections/Hero";
import Philosophy from "@/components/sections/Philosophy";
import Services from "@/components/sections/Services";
import ProjectsSection from "@/components/sections/Projects";
import AboutUs from "@/components/sections/About";
import Manifesto from "@/components/sections/Manifesto";
import ContactSection from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      <main>
        <Hero />
        <Philosophy />
        <Services />
        <ProjectsSection />
        <AboutUs />
        <Manifesto />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
