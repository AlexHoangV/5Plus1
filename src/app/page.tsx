import Navbar from "@/components/sections/navbar";
import Hero from "@/components/sections/Hero";
import ProjectsSection from "@/components/sections/Projects";
import AboutUs from "@/components/sections/About";
import ContactSection from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      <Navbar />
      <main>
        <Hero />
        <ProjectsSection />
        <AboutUs />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
