import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import useScrollAnimation from '../hooks/useScrollAnimation';
import ServiceIcon from '../components/ServiceIcon';
import styles from '../styles/Services.module.css';

const Services = () => {
  useScrollAnimation();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetch('/api/services')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch services from server.');
        }
        return res.json();
      })
      .then((data) => {
        setServices(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching services:', err);
        setError('Could not load services. Ensure your backend server is running.');
        setLoading(false);
      });
  }, []);

  const totalPages = Math.ceil(services.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentServices = services.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <div className={styles.servicesPage}>
      {/* Hero Section */}
      <section className={styles.servicesHero}>
        <img 
          src="/Tech-image4.jpg" 
          alt="Services Hero" 
          className={styles.heroBackgroundImage} 
        />
        <div className={styles.heroOverlay}></div>
        <div className={`container ${styles.heroContainer}`}>
          <span className={styles.badge}>Our Offerings</span>
          <h1>Enterprise Solutions Built for Scale</h1>
          <p>
            Explore our dynamic suite of technology services designed to accelerate 
            your digital transformation, optimize operations, and drive future growth.
          </p>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className={`animate-on-scroll ${styles.gridSection}`}>
        <div className="container">
          {loading && <div className={styles.statusMessage}>Loading dynamic services from database...</div>}
          {error && <div className={styles.errorMessage}>{error}</div>}

          {!loading && !error && services.length === 0 && (
            <div className={styles.statusMessage}>
              No services found. Go to the <Link to="/admin" className={styles.adminLink}>Admin Panel</Link> to add your first service!
            </div>
          )}

          <div className={styles.servicesGrid}>
            {currentServices.map((service) => {
              const shortDesc = service.description && service.description.length > 100 
                ? `${service.description.substring(0, 100)}...` 
                : service.description;

              return (
                <div key={service._id} className={styles.serviceCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.iconWrapper}>
                      <ServiceIcon iconName={service.icon || 'Code'} className={styles.lucideIcon} />
                    </div>
                    <h3>{service.title}</h3>
                  </div>

                  <p className={styles.serviceDesc}>{shortDesc}</p>

                  <Link 
                    to={`/services/${service._id}`} 
                    className={styles.readMoreBtn}
                  >
                    Read More <ArrowRight size={16} />
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {!loading && !error && totalPages > 1 && (
            <div className={styles.paginationContainer}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={styles.pageArrowBtn}
              >
                <ChevronLeft size={18} /> Prev
              </button>

              <div className={styles.pageNumbers}>
                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNum = index + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`${styles.pageNumberBtn} ${currentPage === pageNum ? styles.activePage : ''}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={styles.pageArrowBtn}
              >
                Next <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Services;