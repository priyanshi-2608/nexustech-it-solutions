import React, { useState, useEffect } from 'react';
import styles from '../../styles/admin/ManageBlogs.module.css';

const ManageBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [blogForm, setBlogForm] = useState({
    title: '',
    category: '',
    author: '',
    date: '',
    readTime: '',
    summary: '',
    content: '',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const getToken = () => localStorage.getItem('token') || localStorage.getItem('adminToken');

  const fetchBlogs = async () => {
    try {
      const token = getToken();
      const res = await fetch('http://localhost:5000/api/blogs', {
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      console.error('Error fetching blogs:', err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const token = getToken();
      const res = await fetch('http://localhost:5000/api/blogs', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(blogForm)
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ text: 'Blog post published successfully!', type: 'success' });
        setBlogForm({
          title: '', category: '', author: '', date: '', readTime: '', summary: '', content: '', imageUrl: ''
        });
        fetchBlogs();
      } else {
        setMessage({ text: data.error || 'Failed to publish blog.', type: 'error' });
      }
    } catch (err) {
      console.error('Error publishing blog:', err);
      setMessage({ text: 'Server error.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Delete this blog post?')) return;
    try {
      const token = getToken();
      const res = await fetch(`http://localhost:5000/api/blogs/${id}`, { 
        method: 'DELETE',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      if (res.ok) {
        setBlogs(blogs.filter(b => b._id !== id));
      }
    } catch (err) {
      console.error('Error deleting blog:', err);
    }
  };

  return (
    <div className={styles.managePage}>
      <div className={styles.header}>
        <h1>Manage Blogs</h1>
        <p>Publish engineering articles, updates, and company news.</p>
      </div>

      {message.text && (
        <div className={`${styles.alert} ${message.type === 'error' ? styles.alertError : styles.alertSuccess}`}>
          {message.text}
        </div>
      )}

      <div className={styles.contentGrid}>
        <div className={styles.formCard}>
          <h2>Write New Article</h2>
          <form onSubmit={handleBlogSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label>Title</label>
              <input type="text" value={blogForm.title} onChange={(e) => setBlogForm({...blogForm, title: e.target.value})} required placeholder="Post title..." />
            </div>
            <div className={styles.inputGroup}>
              <label>Category</label>
              <input type="text" value={blogForm.category} onChange={(e) => setBlogForm({...blogForm, category: e.target.value})} required placeholder="Engineering, AI, Culture" />
            </div>
            <div className={styles.inputGroup}>
              <label>Author Name</label>
              <input type="text" value={blogForm.author} onChange={(e) => setBlogForm({...blogForm, author: e.target.value})} required placeholder="Author name" />
            </div>
            <div className={styles.inputGroup}>
              <label>Date (e.g., Oct 2026)</label>
              <input type="text" value={blogForm.date} onChange={(e) => setBlogForm({...blogForm, date: e.target.value})} required placeholder="Oct 2, 2026" />
            </div>
            <div className={styles.inputGroup}>
              <label>Read Time</label>
              <input type="text" value={blogForm.readTime} onChange={(e) => setBlogForm({...blogForm, readTime: e.target.value})} required placeholder="5 min read" />
            </div>
            <div className={styles.inputGroup}>
              <label>Image URL (Optional)</label>
              <input type="text" value={blogForm.imageUrl} onChange={(e) => setBlogForm({...blogForm, imageUrl: e.target.value})} placeholder="https://..." />
            </div>
            <div className={styles.inputGroup}>
              <label>Short Summary (Card Preview)</label>
              <textarea value={blogForm.summary} onChange={(e) => setBlogForm({...blogForm, summary: e.target.value})} required placeholder="Brief excerpt..." />
            </div>
            <div className={styles.inputGroup}>
              <label>Full Content</label>
              <textarea rows="5" value={blogForm.content} onChange={(e) => setBlogForm({...blogForm, content: e.target.value})} required placeholder="Full article body..." />
            </div>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Publishing...' : 'Publish Article'}
            </button>
          </form>
        </div>

        <div className={styles.listCard}>
          <h2>Published Articles ({blogs.length})</h2>
          <div className={styles.tableList}>
            {blogs.length === 0 ? (
              <p className={styles.emptyText}>No articles found.</p>
            ) : (
              blogs.map(blog => (
                <div key={blog._id} className={styles.rowItem}>
                  <div className={styles.itemInfo}>
                    <span className={styles.deptTag}>{blog.category}</span>
                    <strong>{blog.title}</strong>
                    <p>By {blog.author} • {blog.date}</p>
                  </div>
                  <button onClick={() => handleDeleteBlog(blog._id)} className={styles.deleteBtn}>Delete</button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageBlogs;