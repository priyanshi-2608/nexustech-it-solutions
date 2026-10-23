import React from 'react';
import useScrollAnimation from '../hooks/useScrollAnimation';
import Hero from '../components/home/Hero';
import StatsSection from '../components/home/StatsSection';
import ClientsTicker from '../components/home/ClientsTicker';
import ServicesOverview from '../components/home/ServicesOverview';
import TechStack from '../components/home/TechStack';
import Testimonials from '../components/home/Testimonials';

const Home = () => {
  useScrollAnimation();

  return (
    <>
      <Hero />
      <main style={{ position: 'relative', zIndex: 2, marginTop: '10px' }}>
        <div className="animate-on-scroll"><StatsSection /></div>
        <div className="animate-on-scroll"><ClientsTicker /></div>
        <div className="animate-on-scroll"><ServicesOverview /></div>
        <div className="animate-on-scroll"><TechStack /></div>
        <div className="animate-on-scroll"><Testimonials /></div>
      </main>
    </>
  );
};

export default Home;