import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Mail, Phone, CheckCircle2, ArrowLeft } from 'lucide-react';
import useScrollAnimation from '../hooks/useScrollAnimation';
import styles from '../styles/Contact.module.css';

const Contact = () => {
  useScrollAnimation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [status, setStatus] = useState({ loading: false, error: '' });
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: '' });
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setStatus({ loading: false, error: '' });

    let errors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = 'Please enter a valid full name.';
    }

    if (!formData.email.trim() || !validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!formData.subject.trim() || formData.subject.trim().length < 3) {
      errors.subject = 'Subject must be at least 3 characters long.';
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters long.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setStatus({ loading: true, error: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ loading: false, error: '' });
        setIsSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus({ loading: false, error: data.message || 'Something went wrong.' });
      }
    } catch (err) {
      console.error('Submission error:', err);
      setStatus({ loading: false, error: 'Failed to connect to the server. Please try again.' });
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setFormErrors({});
  };

  const bgImage = '/Tech-image5.jpg';

  return (
    <div className={styles.contactPage}>
      {/* Hero Section */}
      <section
        className={styles.contactHero}
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.93)), url(${bgImage})`
        }}
      >
        <div className="container">
          <button onClick={() => navigate(-1)} className={styles.backLink}>
            <ArrowLeft size={18} /> Back
          </button>

          <div className={styles.heroContentWrapper}>
            <span className={styles.tag}>Get in Touch</span>
            <h1>Let's Build Something Great Together</h1>
            <p>
              Have a project in mind or a question? Reach out to our team and we'll get back to you shortly.
            </p>
          </div>
        </div>
      </section>


      {/* Main Content Section */}
      <section className={styles.contentSection}>
        <div className={`container ${styles.contentContainer}`}>
          {!isSuccess ? (
            <div className={styles.contactGrid}>

              {/* Left Column: Company Info */}
              <div className={styles.infoSection}>
                <h3>Contact Information</h3>
                <p className={styles.infoSubtitle}>
                  Fill out the form or reach out directly through our channels below.
                </p>

                <div className={styles.infoDetails}>
                  <div className={styles.infoItem}>
                    <div className={styles.infoIcon}>
                      <MapPin size={18} />
                    </div>
                    <div>
                      <h4>Our Location</h4>
                      <p>Ahmedabad, Gujarat, India</p>
                    </div>
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoIcon}>
                      <Mail size={18} />
                    </div>
                    <div>
                      <h4>Email Us</h4>
                      <p>support@nexustech.com</p>
                    </div>
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoIcon}>
                      <Phone size={18} />
                    </div>
                    <div>
                      <h4>Call Us</h4>
                      <p>+91 (987) 654-3210</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Contact Form */}
              <div className={styles.formSection}>
                <h3 className={styles.formTitle}>Send Us a Message</h3>

                {status.error && <div className={styles.errorAlert}>{status.error}</div>}

                <form onSubmit={handleSubmit} className={styles.contactForm} noValidate>

                  {/* Name Field */}
                  <div className={styles.inputGroup}>
                    <label>Your Name</label>
                    <input
                      type="text"
                      name="name"
                      className={formErrors.name ? styles.inputError : ''}
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                    />
                    {formErrors.name && <span className={styles.fieldErrorText}>{formErrors.name}</span>}
                  </div>

                  {/* Email Field */}
                  <div className={styles.inputGroup}>
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      className={formErrors.email ? styles.inputError : ''}
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {formErrors.email && <span className={styles.fieldErrorText}>{formErrors.email}</span>}
                  </div>

                  {/* Subject Field */}
                  <div className={styles.inputGroup}>
                    <label>Subject</label>
                    <input
                      type="text"
                      name="subject"
                      className={formErrors.subject ? styles.inputError : ''}
                      placeholder="Project Inquiry / Support"
                      value={formData.subject}
                      onChange={handleChange}
                    />
                    {formErrors.subject && <span className={styles.fieldErrorText}>{formErrors.subject}</span>}
                  </div>

                  {/* Message Field */}
                  <div className={styles.inputGroup}>
                    <label>Message</label>
                    <textarea
                      name="message"
                      rows="4"
                      className={formErrors.message ? styles.inputError : ''}
                      placeholder="Write your message here (min 10 characters)..."
                      value={formData.message}
                      onChange={handleChange}
                    />
                    {formErrors.message && <span className={styles.fieldErrorText}>{formErrors.message}</span>}
                  </div>

                  <button type="submit" className={styles.submitBtn} disabled={status.loading}>
                    {status.loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>

            </div>
          ) : (
            <div className={styles.successContent}>
              <div className={styles.successIconCircle}>
                <CheckCircle2 size={48} color="var(--primary-color)" />
              </div>
              <h3>Message Sent Successfully!</h3>
              <p>Thank you for reaching out. We have received your query and will contact you soon.</p>
              <button type="button" onClick={handleReset} className={styles.submitBtn}>
                Send Another Message
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Contact;