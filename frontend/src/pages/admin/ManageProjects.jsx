import React, { useState, useEffect } from 'react';
import styles from '../../styles/admin/ManageProjects.module.css';

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    category: 'Full Stack',
    description: '',
    technologies: '',
    imageUrl: '',
    liveUrl: '',
    githubUrl: '',
    featured: false
  });
  const [message, setMessage] = useState('');

  const fetchProjects = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/projects');
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error('Error fetching admin projects:', err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      const techArray = formData.technologies
        ? formData.technologies.split(',').map(t => t.trim()).filter(Boolean)
        : [];

      const payload = {
        ...formData,
        technologies: techArray
      };

      const res = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setMessage('Project added successfully!');
        setFormData({
          title: '',
          tagline: '',
          category: 'Full Stack',
          description: '',
          technologies: '',
          imageUrl: '',
          liveUrl: '',
          githubUrl: '',
          featured: false
        });
        fetchProjects();
      } else {
        const errorData = await res.json().catch(() => ({}));
        setMessage(errorData.message || 'Failed to add project. Unauthorized.');
      }
    } catch (err) {
      console.error('Error saving project:', err);
      setMessage('Error saving project.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        fetchProjects();
      } else {
        alert('Failed to delete project. Unauthorized.');
      }
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  return (
    <div className={styles.adminPage}>
      <div className={styles.headerSection}>
        <h2>Manage Projects</h2>
        <p>Add or remove portfolio projects displayed on the public website.</p>
      </div>

      {message && <div className={styles.alert}>{message}</div>}

      <div className={styles.adminGrid}>
        {/* Add Project Form */}
        <div className={styles.formCard}>
          <h3>Post New Project</h3>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label>Project Title</label>
              <input
                type="text"
                name="title"
                placeholder="e.g. TaskFlow"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Short Tagline</label>
              <input
                type="text"
                name="tagline"
                placeholder="e.g. Project management app"
                value={formData.tagline}
                onChange={handleChange}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                <option value="Full Stack">Full Stack</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="AI / ML">AI / ML</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label>Technologies (Comma-separated)</label>
              <input
                type="text"
                name="technologies"
                placeholder="React, Node.js, MongoDB"
                value={formData.technologies}
                onChange={handleChange}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Image URL / Path</label>
              <input
                type="text"
                name="imageUrl"
                placeholder="https://... or /images/project.png"
                value={formData.imageUrl}
                onChange={handleChange}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Live Demo URL</label>
              <input
                type="url"
                name="liveUrl"
                placeholder="https://myproject.com"
                value={formData.liveUrl}
                onChange={handleChange}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>GitHub Repository URL</label>
              <input
                type="url"
                name="githubUrl"
                placeholder="https://github.com/username/repo"
                value={formData.githubUrl}
                onChange={handleChange}
              />
            </div>

            <div className={styles.inputGroupFull}>
              <label>Full Description</label>
              <textarea
                name="description"
                placeholder="Detailed project summary..."
                rows="4"
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div className={styles.checkboxGroup}>
              <input
                type="checkbox"
                name="featured"
                id="featuredCheck"
                checked={formData.featured}
                onChange={handleChange}
              />
              <label htmlFor="featuredCheck">Featured Project (Show at top)</label>
            </div>

            <button type="submit" className={styles.submitBtn}>Add Project</button>
          </form>
        </div>

        {/* Existing Projects List */}
        <div className={styles.listCard}>
          <h3>Existing Projects ({projects.length})</h3>
          <div className={styles.projectsList}>
            {projects.length === 0 ? (
              <p className={styles.noData}>No projects posted yet.</p>
            ) : (
              projects.map((proj) => (
                <div key={proj._id} className={styles.projectItem}>
                  <div className={styles.projInfo}>
                    <span className={styles.catTag}>{proj.category}</span>
                    <h4>{proj.title}</h4>
                    <p>{proj.tagline || proj.description.substring(0, 80) + '...'}</p>
                  </div>
                  <button 
                    onClick={() => handleDelete(proj._id)} 
                    className={styles.deleteBtn}
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageProjects;