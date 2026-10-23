// src/components/home/ServicesOverview.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ServiceIcon from '../../components/ServiceIcon';
import styles from '../../styles/ServicesOverview.module.css';

const ServicesOverview = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/services')
      .then((res) => res.json())
      .then((data) => {
        setServices(data.slice(0, 6));
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching services overview:', err);
        setLoading(false);
      });
  }, []);

  return (
    <section className={styles.servicesSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <span>What We Offer</span>
          <h2>Transforming Ideas into Digital Realities</h2>
          <p>We deliver comprehensive IT services tailored to accelerate your business growth and competitive edge.</p>
        </div>

        {loading ? (
          <div className={styles.statusMessage}>Loading services...</div>
        ) : services.length === 0 ? (
          <div className={styles.statusMessage}>No services available at the moment.</div>
        ) : (
          <div className={styles.grid}>
            {services.map((service) => (
              <div key={service._id} className={styles.card}>
                {/* Header row with Icon and Title side-by-side like the Services page */}
                <div className={styles.cardHeader}>
                  <div className={styles.iconWrapper}>
                    <ServiceIcon iconName={service.icon} className={styles.lucideIcon} />
                  </div>
                  <h3>{service.title}</h3>
                </div>
                
                <p>{service.description}</p>
                
                <Link to="/services" className={styles.cardLink}>
                  Read More &rarr;
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesOverview;