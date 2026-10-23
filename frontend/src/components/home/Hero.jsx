// src/components/home/Hero.jsx
import React, { useEffect, useRef } from 'react';
import { Rocket, ArrowRight, Layers } from 'lucide-react';
import styles from '../../styles/Hero.module.css';

const Hero = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleScroll = () => {
      // When the user scrolls back to the top of the page
      if (window.scrollY <= 10) {
        // If the video has finished playing or is paused, restart it once
        if (video.paused) {
          video.currentTime = 0;
          video.play().catch(() => {}); // Catch prevents autoplay restriction errors
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className={styles.heroSection}>
      {/* Background Video */}
      <div className={styles.videoContainer}>
        <video 
          ref={videoRef}
          autoPlay 
          muted 
          playsInline 
          className={styles.bgVideo}
        >
          <source src="/Tech-video3.mp4" type="video/mp4" />
        </video>
        <div className={styles.videoOverlay}></div>
      </div>

      {/* Hero Content */}
      <div className={styles.heroContent}>
        <span className={styles.badge}>
          <Rocket size={16} className={styles.badgeIcon} />
          NEXT-GEN IT SOLUTIONS
        </span>
        
        <h1 className={styles.title}>
          We Build Scalable Software <br />
          <span>for the Future</span>
        </h1>
        
        <p className={styles.subtitle}>
          We engineer robust cloud architectures, AI-driven analytics platforms, and 
          mission-critical software solutions that accelerate business growth.
        </p>
        
        <div className={styles.ctaButtons}>
          <a href="/careers" className={styles.primaryBtn}>
            <span>Start Your Project</span>
            <ArrowRight size={18} />
          </a>
          <a href="/services" className={styles.secondaryBtn}>
            <Layers size={18} />
            <span>Explore Services</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;