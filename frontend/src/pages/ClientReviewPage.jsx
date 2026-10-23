import React, { useState } from 'react';
import styles from '../styles/ClientReviewPage.module.css';

const ClientReviewPage = () => {
  const [formData, setFormData] = useState({
    clientName: '',
    role: '',
    quote: '',
    rating: 5,
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // In ClientReviewPage.jsx
      const response = await fetch('http://localhost:5000/api/testimonials/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Check if response is not JSON (like a 404 HTML page)
      const contentType = response.headers.get('content-type');
      let data = {};
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      }

      if (!response.ok) {
        throw new Error(data.message || `Server error: ${response.status} ${response.statusText}`);
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Submission Error:', err);
      setError(err.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        {submitted ? (
          <div className={styles.successCard}>
            <div className={styles.badge}>Submission Received</div>
            <h2>Thank You for Your Feedback!</h2>
            <p>
              Your review has been successfully submitted to the NexusTech team. We appreciate your partnership and valuable feedback.
            </p>
          </div>
        ) : (
          <div className={styles.formCard}>
            <div className={styles.badge}>Client Feedback</div>
            <h2>Share Your Project Experience</h2>
            <p className={styles.subtitle}>
              Please let us know about your experience working with NexusTech.
            </p>

            {error && <div className={styles.errorMessage}>{error}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label>Your Name</label>
                <input
                  type="text"
                  name="clientName"
                  placeholder="e.g. Sarah Jenkins"
                  value={formData.clientName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Role & Company</label>
                <input
                  type="text"
                  name="role"
                  placeholder="e.g. CTO, FinTech Global"
                  value={formData.role}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Rating</label>
                <select name="rating" value={formData.rating} onChange={handleChange}>
                  <option value={5}>★★★★★ (5 Stars - Exceptional)</option>
                  <option value={4}>★★★★☆ (4 Stars - Very Good)</option>
                  <option value={3}>★★★☆☆ (3 Stars - Satisfactory)</option>
                  <option value={2}>★★☆☆☆ (2 Stars - Needs Improvement)</option>
                  <option value={1}>★☆☆☆☆ (1 Star - Poor)</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label>Testimonial / Feedback</label>
                <textarea
                  name="quote"
                  rows="5"
                  placeholder="Tell us about the project delivery, team technical expertise, and results..."
                  value={formData.quote}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientReviewPage;