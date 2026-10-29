import React, { useState, useEffect } from 'react';
import styles from '../../styles/admin/ManageTechnologies.module.css';
import { availableIcons, getTechIcon } from '../../utils/iconMap';

const ManageTechnologies = () => {
  const [technologies, setTechnologies] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    category: 'frontend',
    icon: 'react', 
    description: ''
  });
  const [loading, setLoading] = useState(true);

  const fetchTechnologies = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/technologies');
      const data = await res.json();
      setTechnologies(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching technologies:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnologies();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken');

    if (!token) {
      alert('You are not logged in as an admin. Please log in again.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/technologies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setFormData({ name: '', category: 'frontend', icon: 'react', description: '' });
        fetchTechnologies();
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Failed to add technology');
      }
    } catch (err) {
      console.error('Error adding technology:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this technology?')) return;
    
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken');

    if (!token) {
      alert('You are not logged in as an admin. Please log in again.');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/technologies/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}` 
        }
      });

      if (res.ok) {
        fetchTechnologies();
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Failed to delete technology');
      }
    } catch (err) {
      console.error('Error deleting technology:', err);
    }
  };

  return (
    <div className={styles.manageContainer}>
      <div className={styles.header}>
        <h2>Manage Technologies</h2>
        <p>Add or remove technologies displayed on the homepage tech stack section.</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.techForm}>
        <h3>Add New Technology</h3>
        <div className={styles.formGrid}>
          <input 
            type="text" 
            name="name" 
            placeholder="Technology Name (e.g. React.js)" 
            value={formData.name} 
            onChange={handleChange} 
            required 
          />
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="cloud">Cloud & DevOps</option>
            <option value="ai">AI & Data</option>
          </select>
          
          {/* Dropdown for clean icon selection */}
          <select name="icon" value={formData.icon} onChange={handleChange}>
            {availableIcons.map((item) => (
              <option key={item.key} value={item.key}>{item.label}</option>
            ))}
          </select>
        </div>
        <textarea 
          name="description" 
          placeholder="Short description of the technology..." 
          value={formData.description} 
          onChange={handleChange} 
          rows="3"
          required 
        />
        <button type="submit" className={styles.submitBtn}>Add Technology</button>
      </form>

      <div className={styles.listSection}>
        <h3>Existing Technologies ({technologies.length})</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className={styles.techListGrid}>
            {technologies.map((tech) => (
              <div key={tech._id} className={styles.adminCard}>
                <div className={styles.cardInfo}>
                  <span className={styles.cardIcon}>
                    {getTechIcon(tech.icon)}
                  </span>
                  <div>
                    <h4>{tech.name} <span className={styles.categoryBadge}>{tech.category}</span></h4>
                    <p>{tech.description}</p>
                  </div>
                </div>
                <button onClick={() => handleDelete(tech._id)} className={styles.deleteBtn}>Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageTechnologies;