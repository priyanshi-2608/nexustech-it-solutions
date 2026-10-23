// src/components/home/TechStack.jsx
import React, { useState, useEffect } from 'react';
import styles from '../../styles/TechStack.module.css';
import { getTechIcon } from '../../utils/iconMap';

const categories = [
  { id: 'all', label: 'All Technologies' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'backend', label: 'Backend' },
  { id: 'cloud', label: 'Cloud & DevOps' },
  { id: 'ai', label: 'AI & Data' },
];

const TechStack = () => {
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    fetch('http://localhost:5000/api/technologies')
      .then(res => res.json())
      .then(data => {
        setTechnologies(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching technologies:', err);
        setLoading(false);
      });
  }, []);

  const filteredTech = activeCategory === 'all' 
    ? technologies 
    : technologies.filter(tech => tech.category === activeCategory);

  // Split filtered tech into two rows for the dual-ticker effect (or duplicate if short)
  const midpoint = Math.ceil(filteredTech.length / 2);
  const row1Items = filteredTech.slice(0, midpoint);
  const row2Items = filteredTech.slice(midpoint);

  // Fallback if few items exist
  const firstRow = row1Items.length > 0 ? row1Items : filteredTech;
  const secondRow = row2Items.length > 0 ? row2Items : filteredTech;

  return (
    <section className={styles.techSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <span className={styles.badge}>Our Tech Stack</span>
          <h2>Powered by Modern Technologies</h2>
          <p>We leverage industry-leading tools and frameworks to build scalable, high-performing applications.</p>
        </div>

        <div className={styles.filterTabs}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`${styles.tabBtn} ${activeCategory === cat.id ? styles.activeTab : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className={styles.loadingText}>Loading technologies...</div>
      ) : filteredTech.length === 0 ? (
        <div className={styles.noDataText}>No technologies found in this category.</div>
      ) : (
        <div className={styles.marqueeContainer}>
          {/* Row 1: Scrolls Left */}
          <div className={styles.marqueeRow}>
            <div className={styles.marqueeTrack}>
              {/* Render items twice to create a seamless infinite loop loop */}
              {[...firstRow, ...firstRow, ...firstRow].map((tech, idx) => (
                <div key={`r1-${tech._id}-${idx}`} className={styles.techCard}>
                  <div className={styles.techCardHeader}>
                    <div className={styles.iconWrapper}>
                      {getTechIcon(tech.icon)}
                    </div>
                    <span className={styles.techName}>{tech.name}</span>
                  </div>
                  <p className={styles.techDesc}>{tech.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: Scrolls Right */}
          {filteredTech.length > 1 && (
            <div className={styles.marqueeRow}>
              <div className={`${styles.marqueeTrack} ${styles.reverseTrack}`}>
                {[...secondRow, ...secondRow, ...secondRow].map((tech, idx) => (
                  <div key={`r2-${tech._id}-${idx}`} className={styles.techCard}>
                    <div className={styles.techCardHeader}>
                      <div className={styles.iconWrapper}>
                        {getTechIcon(tech.icon)}
                      </div>
                      <span className={styles.techName}>{tech.name}</span>
                    </div>
                    <p className={styles.techDesc}>{tech.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default TechStack;