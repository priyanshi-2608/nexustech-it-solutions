import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import useScrollAnimation from '../hooks/useScrollAnimation';
import styles from '../styles/Careers.module.css';

const Careers = () => {
  useScrollAnimation();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetch('/api/jobs')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch career listings.');
        return res.json();
      })
      .then((data) => {
        setJobs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error:', err);
        setError('Could not load openings. Ensure server is running.');
        setLoading(false);
      });
  }, []);

  const totalPages = Math.ceil(jobs.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentJobs = jobs.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <div className={styles.careersPage}>
      {/* Hero Section */}
      <section className={styles.careersHero}>
        <img src="/Tech-image5.jpg" alt="Careers Hero" className={styles.heroBackgroundImage} />
        <div className={styles.heroOverlay}></div>
        <div className={`container ${styles.heroContainer}`}>
          <span className={styles.badge}>Join Our Team</span>
          <h1>Build the Future of Enterprise Tech</h1>
          <p>
            We are always looking for passionate engineers, designers, and innovators 
            who want to solve complex challenges and shape tomorrow's digital solutions.
          </p>
        </div>
      </section>

      {/* Openings Grid Section */}
      <section className={`animate-on-scroll ${styles.gridSection}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionSubtitle}>Open Opportunities</span>
            <h2>Current Open Positions</h2>
            <p>Explore opportunities to work with our world-class engineering team.</p>
          </div>

          {loading && <div className={styles.statusMessage}>Loading open positions...</div>}
          {error && <div className={styles.errorMessage}>{error}</div>}

          {!loading && !error && jobs.length === 0 && (
            <div className={styles.statusMessage}>
              No open positions at the moment. Check back soon or add listings via your <Link to="/admin" className={styles.adminLink}>Admin Panel</Link>!
            </div>
          )}

          <div className={styles.jobsGrid}>
            {currentJobs.map((job) => (
              <div key={job._id} className={styles.jobCard}>
                <div className={styles.jobHeader}>
                  <div>
                    <span className={styles.departmentTag}>{job.department}</span>
                    <h3>{job.title}</h3>
                  </div>
                  <div className={styles.jobMetaBadge}>
                    <span>{job.location}</span>
                    <span className={styles.typeTag}>{job.type}</span>
                  </div>
                </div>

                <p className={styles.jobDesc}>{job.description}</p>

                <div className={styles.cardFooter}>
                  <Link 
                    to={`/careers/${job._id}`}
                    className={styles.applyBtn}
                  >
                    <span>View Details & Apply</span>
                    <ArrowRight size={18} className={styles.arrowIcon} />
                  </Link>
                </div>
              </div>
            ))}
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

export default Careers;