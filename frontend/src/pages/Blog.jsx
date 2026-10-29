import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useScrollAnimation from '../hooks/useScrollAnimation';
import styles from '../styles/Blog.module.css';

const Blog = () => {
  useScrollAnimation();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetch('/api/blogs')
      .then(res => res.json())
      .then(data => {
        setBlogs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching blogs:', err);
        setLoading(false);
      });
  }, []);

  const categories = ['All', ...new Set(blogs.map(b => b.category).filter(Boolean))];
  const filteredBlogs = selectedCategory === 'All' 
    ? blogs 
    : blogs.filter(b => b.category === selectedCategory);

  const heroImage = '/blog1.jpg';

  return (
    <div className={styles.blogPage}>
      <div 
        className={styles.editorialHeader} 
        style={{ backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.92) 0%, rgba(30, 41, 59, 0.88) 100%), url(${heroImage})` }}
      >
        <div className="container">
          <div className={styles.headerTop}>
            <span className={styles.publicationTag}>NexusTech Journal</span>
            <span className={styles.issueNumber}>ISSUE #04</span>
          </div>
          <h1 className={styles.editorialTitle}>Engineering, Code & Architecture.</h1>
          <p className={styles.editorialSub}>
            Deep dives into scalable systems, frontend patterns, and the future of AI development from our team.
          </p>

          {/* Category Filter Pills */}
          {!loading && categories.length > 1 && (
            <div className={styles.filterBar}>
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  className={`${styles.filterBtn} ${selectedCategory === cat ? styles.activeFilter : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Feed */}
      <section className={styles.feedSection}>
        <div className="container">
          {loading && <div className={styles.statusBox}>Curating articles...</div>}
          
          {!loading && blogs.length === 0 && (
            <div className={styles.statusBox}>
              <h3>No articles published yet</h3>
              <p>Check back soon or publish your first article from the admin panel.</p>
            </div>
          )}

          {/* Uniform Articles Grid */}
          <div className={styles.magazineGrid}>
            {filteredBlogs.map(blog => {
              const imgSrc = blog.imageUrl || blog.image;
              return (
                <Link key={blog._id} to={`/blog/${blog._id}`} className={styles.cardLink}>
                  <div className={styles.magazineCard}>
                    {imgSrc && (
                      <div className={styles.cardImgWrapper}>
                        <img src={imgSrc} alt={blog.title} className={styles.cardImg} />
                      </div>
                    )}
                    <div className={styles.cardBody}>
                      <div className={styles.metaRow}>
                        {blog.category && <span className={styles.catBadge}>{blog.category}</span>}
                        {blog.readTime && <span className={styles.readTimeBadge}>{blog.readTime}</span>}
                      </div>
                      <h3>{blog.title}</h3>
                      <div className={styles.cardFooter}>
                        {blog.author && <span>{blog.author}</span>}
                        {blog.date && <span className={styles.dateText}>{blog.date}</span>}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;