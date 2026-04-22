import LifeSkills from '../components/sections/LifeSkills';
import Achievements from '../components/sections/Achievements';
import React, { useEffect } from 'react';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';

import Projects from '../components/sections/Projects';

import Contact from '../components/sections/Contact';

import { scrollToSection } from '../utils/navigation';

const HomePage: React.FC = () => {
  // Handle hash navigation when page loads (e.g., /#about)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const sectionId = hash.replace('#', '');
      // Small delay to ensure sections are rendered
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 100);
    }
  }, []);

  return (
    <>
      <Hero />
      <About />
      
      <Projects />
      <Achievements />
      <LifeSkills />
      
      <Contact />

    </>
  );
};

export default HomePage;
