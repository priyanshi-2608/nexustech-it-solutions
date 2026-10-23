import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, PhoneCall } from 'lucide-react';
import ServiceIcon from '../components/ServiceIcon';
import styles from '../styles/ServiceDetail.module.css';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    fetch(`/api/services/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Service not found or server error');
        }
        return res.json();
      })
      .then((data) => {
        setService(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching service details:', err);
        setError('Unable to load service details.');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.statusMessage}>Loading service details...</div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className={styles.errorContainer}>
        <h2>Service Not Found</h2>
        <p>{error || 'The service you are looking for does not exist.'}</p>
        <Link to="/services" className={styles.backBtn}>
          <ArrowLeft size={18} /> Back to Services
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.detailPage}>
      {/* Top Banner */}
      <section className={styles.detailHero}>
        <div className="container">
          <button onClick={() => navigate('/services')} className={styles.backLink}>
            <ArrowLeft size={18} /> Back to All Services
          </button>
          
          <div className={styles.heroHeader}>
            <div className={styles.iconWrapper}>
              <ServiceIcon iconName={service.icon || 'Code'} size={36} />
            </div>
            <h1>{service.title}</h1>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className={styles.contentSection}>
        <div className={`container ${styles.contentContainer}`}>
          <div className={styles.mainContent}>
            <h2>Overview</h2>
            <p className={styles.fullDesc}>{service.description}</p>

            {service.features && service.features.length > 0 && (
              <div className={styles.featuresSection}>
                <h3>Core Capabilities & Tech Stack</h3>
                <ul className={styles.featureGrid}>
                  {service.features.map((feature, idx) => (
                    <li key={idx} className={styles.featureItem}>
                      <CheckCircle2 size={20} className={styles.checkIcon} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar CTA */}
          <aside className={styles.sidebar}>
            <div className={styles.ctaCard}>
              <h3>Need Help with {service.title}?</h3>
              <p>Get in touch with our expert team to discuss your custom project requirements.</p>
              <Link to="/contact" className={styles.contactBtn}>
                <PhoneCall size={18} /> Contact Us Today
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetail;