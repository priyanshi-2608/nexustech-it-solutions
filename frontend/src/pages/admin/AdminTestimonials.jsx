import React, { useState, useEffect } from 'react';
import styles from '../../styles/admin/AdminTestimonials.module.css';

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  };

  const fetchAllTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials/admin/all', {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch testimonials');
      }

      setTestimonials(data);
    } catch (error) {
      console.error('Error fetching admin testimonials', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTestimonials();
  }, []);

  const handleToggleFeature = async (id) => {
    try {
      const response = await fetch(`/api/testimonials/admin/${id}/toggle`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update status');
      }

      fetchAllTestimonials(); // Refresh list
    } catch (error) {
      console.error('Error updating status', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this submission?')) return;
    try {
      const response = await fetch(`/api/testimonials/admin/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete testimonial');
      }

      fetchAllTestimonials(); 
    } catch (error) {
      console.error('Error deleting review', error);
    }
  };

  if (loading) return <div className={styles.loading}>Loading submissions...</div>;

  return (
    <div className={styles.adminContainer}>
      <h2>Client Testimonials Moderation</h2>
      <p className={styles.subtitle}>Review incoming feedback and toggle visibility for the homepage.</p>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Client</th>
              <th>Role</th>
              <th>Rating</th>
              <th>Quote</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.map((item) => (
              <tr key={item._id}>
                <td className={styles.clientName}>{item.clientName}</td>
                <td>{item.role}</td>
                <td>{'★'.repeat(item.rating)}</td>
                <td className={styles.quoteCell}>"{item.quote}"</td>
                <td>
                  <span className={item.isFeatured ? styles.badgeFeatured : styles.badgePending}>
                    {item.isFeatured ? 'Live (Featured)' : 'Pending Review'}
                  </span>
                </td>
                <td className={styles.actionsCell}>
                  <button 
                    onClick={() => handleToggleFeature(item._id)}
                    className={item.isFeatured ? styles.unpublishBtn : styles.publishBtn}
                  >
                    {item.isFeatured ? 'Unpublish' : 'Approve'}
                  </button>
                  <button onClick={() => handleDelete(item._id)} className={styles.deleteBtn}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTestimonials;