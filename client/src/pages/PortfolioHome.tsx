import React from 'react';
import PortfolioNavbar from '@/components/portfolio/PortfolioNavbar';
import PortfolioHero from '@/components/portfolio/PortfolioHero';
import About from '@/components/portfolio/About';
import Skills from '@/components/portfolio/Skills';
import Projects from '@/components/portfolio/Projects';
import Contact from '@/components/portfolio/Contact';
import PortfolioFooter from '@/components/portfolio/PortfolioFooter';

const PortfolioHome = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PortfolioNavbar />
      <main>
        <section id="hero">
          <PortfolioHero />
        </section>
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <PortfolioFooter />
    </div>
  );
};

export default PortfolioHome;