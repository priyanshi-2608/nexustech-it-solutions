import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import useScrollAnimation from '../hooks/useScrollAnimation';
import styles from '../styles/Team.module.css';

const Team = () => {
  useScrollAnimation();
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetch('/api/team')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch team data.');
        return res.json();
      })
      .then((data) => {
        setTeam(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error:', err);
        setError('Could not load team members. Ensure server is running.');
        setLoading(false);
      });
  }, []);

  const totalPages = Math.ceil(team.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTeam = team.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <div className={styles.teamPage}>
      {/* Hero Section */}
      <section className={styles.teamHero}>
        <img 
          src="/Tech-image3.jpg" 
          alt="NexusTech Team Hero" 
          className={styles.heroBackgroundImage} 
        />
        <div className={styles.heroOverlay}></div>
        <div className={`container ${styles.heroContainer}`}>
          <span className={styles.badge}>Leadership & Experts</span>
          <h1>Meet the Minds Behind NexusTech</h1>
          <p>
            Our world-class team of engineers, architects, and visionaries are dedicated 
            to pushing the boundaries of what is possible in enterprise technology.
          </p>
        </div>
      </section>

      {/* Team Grid Section */}
      <section className={`animate-on-scroll ${styles.gridSection}`}>
        <div className="container">
          {loading && <div className={styles.statusMessage}>Loading dynamic team members...</div>}
          {error && <div className={styles.errorMessage}>{error}</div>}

          {!loading && !error && team.length === 0 && (
            <div className={styles.statusMessage}>
              No team members found. Go to the <Link to="/admin" className={styles.adminLink}>Admin Panel</Link> to add your first member!
            </div>
          )}

          <div className={styles.teamGrid}>
            {currentTeam.map((member) => (
              <div key={member._id} className={styles.memberCard}>
                {/* Rounded Image Container */}
                <div className={styles.imageContainer}>
                  <img src={member.image} alt={member.name} className={styles.memberImage} />
                </div>
                
                <div className={styles.memberInfo}>
                  <div className={styles.nameRoleGroup}>
                    <h3>{member.name}</h3>
                    <span className={styles.memberRole}>{member.role}</span>
                  </div>
                  
                  {/* Card Actions (Read More + Connect) */}
                  <div className={styles.cardActions}>
                    <Link 
                      to={`/team/${member._id}`} 
                      className={styles.readMoreBtn}
                    >
                      Read More <ArrowRight size={16} />
                    </Link>

                    {member.linkedin && (
                      <a 
                        href={member.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={styles.linkedinButton}
                      >
                        <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                          <rect x="2" y="9" width="4" height="12"></rect>
                          <circle cx="4" cy="4" r="2"></circle>
                        </svg>
                        <span>Connect</span>
                      </a>
                    )}
                  </div>
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

export default Team;