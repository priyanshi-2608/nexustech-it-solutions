import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, CheckCircle2, Send } from 'lucide-react';
import styles from '../styles/CareersDetail.module.css';

const CareersDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [applicantForm, setApplicantForm] = useState({
    name: '',
    email: '',
    phone: '',
    resumeFile: null,
    coverLetter: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [generalMessage, setGeneralMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    fetch(`/api/jobs/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Job opening not found');
        return res.json();
      })
      .then((data) => {
        setJob(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching job details:', err);
        setError('Unable to load job details.');
        setLoading(false);
      });
  }, [id]);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
  const validatePhone = (phone) => /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(phone.trim());

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = [
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      if (!allowedTypes.includes(file.type)) {
        setFormErrors(prev => ({ ...prev, resumeFile: 'Please upload a valid PDF or Word document.' }));
        setApplicantForm(prev => ({ ...prev, resumeFile: null }));
      } else {
        setFormErrors(prev => ({ ...prev, resumeFile: '' }));
        setApplicantForm(prev => ({ ...prev, resumeFile: file }));
      }
    }
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setGeneralMessage('');
    setIsSuccess(false);

    let errors = {};
    if (!applicantForm.name.trim() || applicantForm.name.trim().length < 2) {
      errors.name = 'Please enter a valid full name.';
    }
    if (!applicantForm.email.trim() || !validateEmail(applicantForm.email)) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!applicantForm.phone.trim() || !validatePhone(applicantForm.phone)) {
      errors.phone = 'Please enter a valid phone number.';
    }
    if (!applicantForm.resumeFile) {
      errors.resumeFile = 'Please upload your Resume/CV (PDF or Word).';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('jobId', job._id);
      formData.append('jobTitle', job.title);
      formData.append('name', applicantForm.name.trim());
      formData.append('email', applicantForm.email.trim());
      formData.append('phone', applicantForm.phone.trim());
      formData.append('resume', applicantForm.resumeFile);
      formData.append('coverLetter', applicantForm.coverLetter.trim());

      const response = await fetch('/api/applications', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setGeneralMessage('Application submitted successfully! Check your email for confirmation.');
        setApplicantForm({ name: '', email: '', phone: '', resumeFile: null, coverLetter: '' });
      } else {
        setGeneralMessage(data.message || 'Failed to submit application. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting application:', err);
      setGeneralMessage('Server error. Please ensure the backend server is running.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className={styles.loadingContainer}>Loading job details...</div>;
  }

  if (error || !job) {
    return (
      <div className={styles.errorContainer}>
        <h2>Job Not Found</h2>
        <p>{error || 'This position is no longer available.'}</p>
        <Link to="/careers" className={styles.backBtn}>
          <ArrowLeft size={18} /> Back to Careers
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.detailPage}>
      {/* Top Banner */}
      <section className={styles.detailHero}>
        <div className="container">
          <button onClick={() => navigate('/careers')} className={styles.backLink}>
            <ArrowLeft size={18} /> Back to Open Positions
          </button>
          
          <div className={styles.heroHeader}>
            <span className={styles.badge}>{job.department}</span>
            <h1>{job.title}</h1>
            <div className={styles.jobMeta}>
              <span><MapPin size={16} /> {job.location}</span>
              <span><Clock size={16} /> {job.type}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className={styles.contentSection}>
        <div className={`container ${styles.contentContainer}`}>
          {/* Left Column: Job Description & Requirements */}
          <div className={styles.mainContent}>
            <h2>About the Role</h2>
            <p className={styles.fullDesc}>{job.description}</p>

            {job.responsibilities && job.responsibilities.length > 0 && (
              <div className={styles.sectionBlock}>
                <h3>Key Responsibilities</h3>
                <ul className={styles.list}>
                  {job.responsibilities.map((item, idx) => (
                    <li key={idx}><CheckCircle2 size={16} className={styles.checkIcon} /> <span>{item}</span></li>
                  ))}
                </ul>
              </div>
            )}

            {job.requirements && job.requirements.length > 0 && (
              <div className={styles.sectionBlock}>
                <h3>Requirements & Qualifications</h3>
                <ul className={styles.list}>
                  {job.requirements.map((item, idx) => (
                    <li key={idx}><CheckCircle2 size={16} className={styles.checkIcon} /> <span>{item}</span></li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column: Application Form */}
          <aside className={styles.sidebar}>
            <div className={styles.ctaCard}>
              <h3>Apply for this Position</h3>
              
              {generalMessage && (
                <div className={`${styles.submitMessageAlert} ${isSuccess ? styles.success : styles.error}`}>
                  {generalMessage}
                </div>
              )}
              
              <form onSubmit={handleApplicationSubmit} className={styles.applyForm} noValidate>
                <div className={styles.inputGroup}>
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    className={formErrors.name ? styles.inputError : ''}
                    value={applicantForm.name} 
                    onChange={(e) => setApplicantForm({...applicantForm, name: e.target.value})}
                    placeholder="Priyanshi Patel" 
                  />
                  {formErrors.name && <span className={styles.fieldErrorText}>{formErrors.name}</span>}
                </div>

                <div className={styles.inputGroup}>
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    className={formErrors.email ? styles.inputError : ''}
                    value={applicantForm.email} 
                    onChange={(e) => setApplicantForm({...applicantForm, email: e.target.value})}
                    placeholder="you@example.com" 
                  />
                  {formErrors.email && <span className={styles.fieldErrorText}>{formErrors.email}</span>}
                </div>

                <div className={styles.inputGroup}>
                  <label>Phone Number</label>
                  <input 
                    type="tel" 
                    className={formErrors.phone ? styles.inputError : ''}
                    value={applicantForm.phone} 
                    onChange={(e) => setApplicantForm({...applicantForm, phone: e.target.value})}
                    placeholder="+91 XXXXX XXXXX" 
                  />
                  {formErrors.phone && <span className={styles.fieldErrorText}>{formErrors.phone}</span>}
                </div>

                <div className={styles.inputGroup}>
                  <label>Upload Resume / CV (PDF, DOC)</label>
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx"
                    className={`${styles.fileInput} ${formErrors.resumeFile ? styles.inputError : ''}`}
                    onChange={handleFileChange}
                  />
                  {applicantForm.resumeFile && (
                    <small className={styles.fileNameIndicator}>Selected: {applicantForm.resumeFile.name}</small>
                  )}
                  {formErrors.resumeFile && <span className={styles.fieldErrorText}>{formErrors.resumeFile}</span>}
                </div>

                <div className={styles.inputGroup}>
                  <label>Cover Letter (Optional)</label>
                  <textarea 
                    rows="3"
                    value={applicantForm.coverLetter} 
                    onChange={(e) => setApplicantForm({...applicantForm, coverLetter: e.target.value})}
                    placeholder="Briefly describe why you're a great fit..." 
                  />
                </div>

                <button type="submit" className={styles.applyBtn} disabled={submitting}>
                  <Send size={16} /> {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </form>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default CareersDetail;