import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import styles from '../styles/BlogDetail.module.css';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    fetch(`/api/blogs/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Blog post not found');
        return res.json();
      })
      .then((data) => {
        setBlog(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching blog details:', err);
        setError('Unable to load blog post.');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className={styles.loadingContainer}>Loading blog post...</div>;
  }

  if (error || !blog) {
    return (
      <div className={styles.errorContainer}>
        <h2>Blog Post Not Found</h2>
        <p>{error || 'The article you are looking for does not exist.'}</p>
        <Link to="/blog" className={styles.backBtn}>
          <ArrowLeft size={18} /> Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.detailPage}>
      <section className={styles.detailHero}>
        <div className="container">
          <button onClick={() => navigate('/blog')} className={styles.backLink}>
            <ArrowLeft size={18} /> Back to All Articles
          </button>
          
          <div className={styles.heroHeader}>
            {blog.category && <span className={styles.badge}>{blog.category}</span>}
            <h1>{blog.title}</h1>
            <div className={styles.blogMeta}>
              {blog.author && <span><User size={16} /> {blog.author}</span>}
              {blog.createdAt && (
                <span><Calendar size={16} /> {new Date(blog.createdAt).toLocaleDateString()}</span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.contentSection}>
        <div className={`container ${styles.contentContainer}`}>
          <div className={styles.mainContent}>
            {blog.imageUrl && (
              <div className={styles.imageContainer}>
                <img src={blog.imageUrl} alt={blog.title} />
              </div>
            )}
            <div className={styles.blogBody}>
              <p className={styles.fullDesc}>{blog.content || blog.description}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogDetail;