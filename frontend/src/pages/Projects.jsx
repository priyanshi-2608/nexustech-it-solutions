import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FolderGit2 } from 'lucide-react';
import styles from '../styles/Projects.module.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        setProjects(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching public projects:', err);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const categories = ['All', 'Full Stack', 'Frontend', 'Backend', 'AI / ML'];

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.category?.toLowerCase() === filter.toLowerCase());

  return (
    <section id="projects" className={styles.projectsSection}>
      {/* Hero Banner */}
      <div className={styles.heroBanner}>
        <img 
          src="/blog2.jpg" 
          alt="Projects Hero Background" 
          className={styles.heroBackgroundImage} 
        />
        <div className={styles.heroOverlay}></div>
        
        <div className={styles.heroContainer}>
          <div className={styles.badgeWrapper}>
            <span className={styles.badge}>Our Portfolio</span>
          </div>
          <h1 className={styles.heroTitle}>Enterprise Solutions & Client Projects</h1>
          <p className={styles.heroSubtitle}>
            Explore our dynamic portfolio of enterprise applications, client solutions, and advanced technical implementations built for scale.
          </p>
        </div>
      </div>

      <div className={styles.filterTabs}>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`${styles.tabBtn} ${filter === cat ? styles.activeTab : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className={styles.loadingText}>Loading projects...</div>
      ) : filteredProjects.length === 0 ? (
        <div className={styles.noDataText}>No projects found in this category yet.</div>
      ) : (
        <div className={styles.projectsGrid}>
          {filteredProjects.map((project) => (
            <Link 
              key={project._id} 
              to={`/projects/${project._id}`}
              className={styles.projectCardLink}
            >
              <div className={styles.projectCard}>
                {project.imageUrl ? (
                  <div className={styles.imageContainer}>
                    <img src={project.imageUrl} alt={project.title} className={styles.projectImage} />
                    <span className={styles.categoryBadgeOverlay}>{project.category}</span>
                  </div>
                ) : (
                  <div className={styles.cardHeaderTop}>
                    <div className={styles.iconWrapper}>
                      <FolderGit2 size={22} />
                    </div>
                    <span className={styles.categoryBadge}>{project.category}</span>
                  </div>
                )}

                <div className={styles.cardContent}>
                  <h3 className={styles.projectTitle}>{project.title}</h3>
                  <p className={styles.projectTagline}>{project.tagline}</p>
                  <span className={styles.viewDetailsPrompt}>Click to view details &rarr;</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default Projects;