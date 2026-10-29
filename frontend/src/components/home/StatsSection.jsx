import React, { useState, useEffect, useRef } from 'react';
import styles from '../../styles/StatsSection.module.css';

const statsData = [
  { id: 1, endValue: 150, suffix: '+', label: 'Projects Completed' },
  { id: 2, endValue: 98, suffix: '%', label: 'Client Satisfaction' },
  { id: 3, endValue: 50, suffix: '+', label: 'Expert Engineers' },
  { id: 4, endValue: 10, suffix: '+', label: 'Global Awards' },
];

const Counter = ({ end, suffix }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const duration = 2000;
          const incrementTime = Math.abs(Math.floor(duration / end));

          const timer = setInterval(() => {
            start += 1;
            setCount(start);
            if (start >= end) {
              clearInterval(timer);
            }
          }, incrementTime);
        }
      },
      { threshold: 0.5 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => {
      if (countRef.current) observer.unobserve(countRef.current);
    };
  }, [end, hasAnimated]);

  return (
    <span ref={countRef}>
      {count}{suffix}
    </span>
  );
};

const StatsSection = () => {
  return (
    <div className={styles.nextSectionWrapper}>
      <section className={styles.statsSection}>
        <div className={`container ${styles.statsGrid}`}>
          {statsData.map((stat) => (
            <div key={stat.id} className={styles.statItem}>
              <div className={styles.statNumber}>
                <Counter end={stat.endValue} suffix={stat.suffix} />
              </div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default StatsSection;