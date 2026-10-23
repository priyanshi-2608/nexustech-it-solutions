import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users } from 'lucide-react';
import styles from '../styles/TeamDetail.module.css';

const TeamDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    fetch(`/api/team/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Team member not found or server error');
        }
        return res.json();
      })
      .then((data) => {
        setMember(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching team member details:', err);
        setError('Unable to load team member details.');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.statusMessage}>Loading team member details...</div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className={styles.errorContainer}>
        <h2>Member Not Found</h2>
        <p>{error || 'The team member you are looking for does not exist.'}</p>
        <Link to="/team" className={styles.backBtn}>
          <ArrowLeft size={18} /> Back to Our Team
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.detailPage}>
      {/* Top Banner */}
      <section className={styles.detailHero}>
        <div className="container">
          <button onClick={() => navigate('/team')} className={styles.backLink}>
            <ArrowLeft size={18} /> Back to All Team Members
          </button>
          
          <div className={styles.heroHeader}>
            <div className={styles.imageContainer}>
              <img src={member.image} alt={member.name} />
            </div>
            <div>
              <span className={styles.heroRole}>{member.role}</span>
              <h1>{member.name}</h1>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className={styles.contentSection}>
        <div className={`container ${styles.contentContainer}`}>
          <div className={styles.mainContent}>
            <h2>Biography</h2>
            <p className={styles.fullDesc}>{member.bio}</p>
          </div>

          {/* Sidebar CTA */}
          <aside className={styles.sidebar}>
            <div className={styles.ctaCard}>
              <h3>Connect with {member.name}</h3>
              <p>Reach out to discuss technology stacks, project architecture, or professional collaboration.</p>
              
              {member.linkedin && (
                <a 
                  href={member.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={styles.linkedinBtn}
                >
                  <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                  Connect on LinkedIn
                </a>
              )}
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default TeamDetail;