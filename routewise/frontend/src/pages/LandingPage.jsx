import React from 'react';
import Navbar from '../components/landing/Navbar.jsx';
import Hero from '../components/landing/Hero.jsx';
import ProductIntro from '../components/landing/ProductIntro.jsx';
import InteractiveDemo from '../components/landing/InteractiveDemo.jsx';
import Features from '../components/landing/Features.jsx';
import HowItWorks from '../components/landing/HowItWorks.jsx';
import MapShowcase from '../components/landing/MapShowcase.jsx';
import FinalCTA from '../components/landing/FinalCTA.jsx';
import Footer from '../components/landing/Footer.jsx';
import CustomCursor from '../components/common/CustomCursor.jsx';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-base-950 overflow-x-clip">
      <CustomCursor />
      <Navbar />
      <Hero />
      <ProductIntro />
      <HowItWorks />
      <InteractiveDemo />
      <Features />
      <MapShowcase />
      <FinalCTA />
      <Footer />
    </div>
  );
}
