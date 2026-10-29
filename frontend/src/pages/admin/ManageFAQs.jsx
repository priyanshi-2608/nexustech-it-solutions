import React, { useState, useEffect } from 'react';
import styles from '../../styles/admin/ManageFAQs.module.css';

const ManageFAQs = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'General',
    order: 0
  });

  const getToken = () => localStorage.getItem('token') || localStorage.getItem('adminToken');

  // Fetch FAQs on load
  const fetchFAQs = async () => {
    try {
      const token = getToken();
      const res = await fetch('http://localhost:5000/api/faqs', {
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      const data = await res.json();
      setFaqs(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching FAQs:', err);
      setError('Failed to load FAQs');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    try {
      const token = getToken();
      const res = await fetch('http://localhost:5000/api/faqs', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to create FAQ');

      setMessage({ text: 'FAQ published successfully!', type: 'success' });
      setFormData({ question: '', answer: '', category: 'General', order: 0 });
      fetchFAQs();
    } catch (err) {
      console.error(err);
      setMessage({ text: err.message || 'Error creating FAQ', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;

    try {
      const token = getToken();
      const res = await fetch(`http://localhost:5000/api/faqs/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });

      if (!res.ok) throw new Error('Failed to delete FAQ');

      setMessage({ text: 'FAQ deleted successfully.', type: 'success' });
      fetchFAQs();
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Error deleting FAQ', type: 'error' });
    }
  };

  return (
    <div className={styles.adminContainer}>
      <div className="container">
        <h1>Manage FAQs</h1>
        <p className={styles.subtitle}>Add, review, or remove support questions from your platform.</p>

        {message.text && (
          <div className={`${styles.alert} ${message.type === 'error' ? styles.alertError : styles.alertSuccess}`}>
            {message.text}
          </div>
        )}

        {/* Add FAQ Form */}
        <div className={styles.formCard}>
          <h3>Add New FAQ</h3>
          <form onSubmit={handleSubmit} className={styles.faqForm}>
            <div className={styles.inputGroup}>
              <label>Question</label>
              <input 
                type="text" 
                name="question" 
                value={formData.question} 
                onChange={handleChange} 
                required 
                placeholder="e.g., How do I reset my password?"
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Answer</label>
              <textarea 
                name="answer" 
                value={formData.answer} 
                onChange={handleChange} 
                required 
                rows="4"
                placeholder="Provide a detailed answer..."
              />
            </div>

            <div className={styles.rowGroup}>
              <div className={styles.inputGroup}>
                <label>Category</label>
                <input 
                  type="text" 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange} 
                  placeholder="e.g., General, Billing, Architecture"
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Display Order</label>
                <input 
                  type="number" 
                  name="order" 
                  value={formData.order} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            <button type="submit" className={styles.submitBtn}>Publish FAQ</button>
          </form>
        </div>

        {/* FAQ Management List */}
        <div className={styles.listSection}>
          <h3>Existing FAQs ({faqs.length})</h3>
          {loading && <p>Loading questions...</p>}
          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.faqTableContainer}>
            {faqs.length === 0 && !loading ? (
              <p className={styles.noData}>No FAQs available. Add one above!</p>
            ) : (
              <div className={styles.faqList}>
                {faqs.map(faq => (
                  <div key={faq._id} className={styles.faqItemCard}>
                    <div className={styles.faqInfo}>
                      <span className={styles.badge}>{faq.category} (Order: {faq.order})</span>
                      <h4>{faq.question}</h4>
                      <p>{faq.answer}</p>
                    </div>
                    <button 
                      onClick={() => handleDelete(faq._id)} 
                      className={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageFAQs;