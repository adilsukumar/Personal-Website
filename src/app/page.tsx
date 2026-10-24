import AmbientStarfield from "@/components/AmbientStarfield";
import Certifications from "@/components/Certifications";
import Capabilities from "@/components/Capabilities";
import Contact from "@/components/Contact";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import PopulationJourney from "@/components/PopulationJourney";
import PortraitReveal from "@/components/PortraitReveal";
import Projects from "@/components/Projects";
import SectionDivider from "@/components/SectionDivider";

export default function Home() {
  return (
    <div id="top" className="flex flex-1 flex-col">
      <Navbar />
      <PopulationJourney />
      <Hero />
      <PortraitReveal />
      {/* One shared starfield behind this whole stretch, not a separate one
          per section — keeps the "we're in space" thread from the sections
          above going instead of cutting to flat black right after the
          portrait reveal.

          Deliberately no bg-black on this wrapper itself: <body> already
          provides one at the document root. Confirmed (the hard way) that
          giving this wrapper its own opaque background hid the starfield
          entirely regardless of stacking order theory — negative z-index
          descendants painting "in front of" an ancestor's own background is
          how the spec describes it, but position:fixed descendants didn't
          honor that here in practice. Letting body's background show
          through instead sidesteps the question entirely. */}
      <div className="relative">
        <AmbientStarfield />
        <Capabilities />
        <Experience />
        <SectionDivider from="experience" to="certifications" />
        <Certifications />
        <SectionDivider from="certifications" to="projects" />
        <Projects />
        <SectionDivider from="projects" to="contact" />
        <Contact />
      </div>
      <Footer />
    </div>
  );
}
