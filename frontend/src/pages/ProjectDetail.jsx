import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, GitBranch, FolderGit2 } from 'lucide-react';
import styles from '../styles/ProjectDetail.module.css';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    fetch(`/api/projects/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Project not found or server error');
        }
        return res.json();
      })
      .then((data) => {
        setProject(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching project details:', err);
        setError('Unable to load project details.');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.statusMessage}>Loading project details...</div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className={styles.errorContainer}>
        <h2>Project Not Found</h2>
        <p>{error || 'The project you are looking for does not exist.'}</p>
        <Link to="/projects" className={styles.backBtn}>
          <ArrowLeft size={18} /> Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.detailPage}>
      {/* Top Banner */}
      <section className={styles.detailHero}>
        <div className="container">
          <button onClick={() => navigate('/projects')} className={styles.backLink}>
            <ArrowLeft size={18} /> Back to All Projects
          </button>
          
          <div className={styles.heroHeader}>
            <div className={styles.iconWrapper}>
              <FolderGit2 size={36} />
            </div>
            <div>
              <span className={styles.heroCategory}>{project.category}</span>
              <h1>{project.title}</h1>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className={styles.contentSection}>
        <div className={`container ${styles.contentContainer}`}>
          <div className={styles.mainContent}>
            {project.imageUrl && (
              <div className={styles.imageContainer}>
                <img src={project.imageUrl} alt={project.title} />
              </div>
            )}

            {project.tagline && <p className={styles.tagline}>{project.tagline}</p>}

            <h2>Overview</h2>
            <p className={styles.fullDesc}>{project.description}</p>

            {project.technologies && project.technologies.length > 0 && (
              <div className={styles.techSection}>
                <h3>Tech Stack & Technologies</h3>
                <div className={styles.techStackList}>
                  {project.technologies.map((tech, idx) => (
                    <span key={idx} className={styles.techTag}>{tech}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar CTA / Links */}
          <aside className={styles.sidebar}>
            <div className={styles.ctaCard}>
              <h3>Project Links</h3>
              <p>Explore the live application or review the source code repository.</p>
              
              <div className={styles.actionLinks}>
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={styles.demoLink}>
                    <ExternalLink size={18} /> Live Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.githubLink}>
                    <GitBranch size={18} /> Code Repository
                  </a>
                )}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetail;