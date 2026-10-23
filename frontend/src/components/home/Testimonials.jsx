// src/components/home/Testimonials.jsx
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from '../../styles/Testimonials.module.css';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // How many testimonials to display per slide view
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch('/api/testimonials');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch testimonials');
        }

        setTestimonials(data);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Calculate total pages/dots needed
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);

  // Automatic slide cycle every 5 seconds (pauses when user hovers)
  useEffect(() => {
    if (totalPages <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalPages);
    }, 5000);

    return () => clearInterval(timer);
  }, [totalPages, isPaused]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalPages);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalPages) % totalPages);
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <section className={styles.testimonialsSection}>
        <div className={styles.loadingText}>Loading testimonials...</div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  // Get current slice of testimonials for the active page
  const visibleTestimonials = testimonials.slice(
    currentIndex * itemsPerPage,
    currentIndex * itemsPerPage + itemsPerPage
  );

  return (
    <section 
      className={styles.testimonialsSection}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className={styles.sectionHeader}>
        <span>Client Testimonials</span>
        <h2>Trusted by Industry Leaders</h2>
      </div>

      <div className={styles.carouselWrapper}>
        {/* Previous Button */}
        {totalPages > 1 && (
          <button 
            onClick={handlePrev} 
            className={`${styles.navBtn} ${styles.prevBtn}`}
            aria-label="Previous Testimonials"
          >
            <ChevronLeft size={22} />
          </button>
        )}

        {/* Testimonials Grid */}
        <div className={styles.grid}>
          {visibleTestimonials.map((item) => (
            <div key={item._id} className={styles.card}>
              <div className={styles.stars}>
                {'★'.repeat(item.rating || 5)}
              </div>
              <p className={styles.quote}>"{item.quote.replace(/^"|"$/g, '')}"</p>
              <div className={styles.clientInfo}>
                <div className={styles.avatar}>
                  {item.initials || item.clientName.split(' ').map((n) => n[0]).join('')}
                </div>
                <div className={styles.details}>
                  <h4>{item.clientName}</h4>
                  <p>{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Next Button */}
        {totalPages > 1 && (
          <button 
            onClick={handleNext} 
            className={`${styles.navBtn} ${styles.nextBtn}`}
            aria-label="Next Testimonials"
          >
            <ChevronRight size={22} />
          </button>
        )}
      </div>

      {/* Pagination Dots */}
      {totalPages > 1 && (
        <div className={styles.paginationDots}>
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleDotClick(idx)}
              className={`${styles.dot} ${currentIndex === idx ? styles.activeDot : ''}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Testimonials;