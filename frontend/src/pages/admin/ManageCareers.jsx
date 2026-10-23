import React, { useState, useEffect } from 'react';
import styles from '../../styles/admin/ManageCareers.module.css';

const ManageCareers = () => {
  const [jobs, setJobs] = useState([]);
  const [jobForm, setJobForm] = useState({
    title: '',
    department: '',
    location: '',
    type: '',
    description: '',
    responsibilities: '',
    requirements: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const fetchJobs = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/jobs');
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error('Error fetching job listings:', err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      const formattedData = {
        ...jobForm,
        responsibilities: jobForm.responsibilities
          ? jobForm.responsibilities.split(',').map((resp) => resp.trim()).filter(Boolean)
          : [],
        requirements: jobForm.requirements
          ? jobForm.requirements.split(',').map((req) => req.trim()).filter(Boolean)
          : []
      };

      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');

      const res = await fetch('http://localhost:5000/api/jobs', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formattedData)
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ text: 'Job position posted successfully!', type: 'success' });
        setJobForm({
          title: '',
          department: '',
          location: '',
          type: '',
          description: '',
          responsibilities: '',
          requirements: ''
        });
        fetchJobs();
      } else {
        setMessage({ text: data.error || 'Failed to publish job opening.', type: 'error' });
      }
    } catch (err) {
      console.error('Error submitting job:', err);
      setMessage({ text: 'Server error.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Delete this job opening?')) return;
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
      const res = await fetch(`http://localhost:5000/api/jobs/${id}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setJobs(jobs.filter(job => job._id !== id));
      }
    } catch (err) {
      console.error('Error deleting job:', err);
    }
  };

  return (
    <div className={styles.managePage}>
      <div className={styles.header}>
        <h1>Manage Careers</h1>
        <p>Post open positions, departments, responsibilities, and candidate requirements for your public Careers page.</p>
      </div>

      {message.text && (
        <div className={`${styles.alert} ${message.type === 'error' ? styles.alertError : styles.alertSuccess}`}>
          {message.text}
        </div>
      )}

      <div className={styles.contentGrid}>
        {/* Post Job Form Card */}
        <div className={styles.formCard}>
          <h2>Post New Position</h2>
          <form onSubmit={handleJobSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label>Job Title</label>
              <input 
                type="text" 
                value={jobForm.title} 
                onChange={(e) => setJobForm({...jobForm, title: e.target.value})} 
                required 
                placeholder="e.g. Senior MERN Stack Developer" 
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Department</label>
              <input 
                type="text" 
                value={jobForm.department} 
                onChange={(e) => setJobForm({...jobForm, department: e.target.value})} 
                required 
                placeholder="e.g. Engineering, AI, Cloud" 
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Location</label>
              <input 
                type="text" 
                value={jobForm.location} 
                onChange={(e) => setJobForm({...jobForm, location: e.target.value})} 
                required 
                placeholder="e.g. Remote, Ahmedabad, Hybrid" 
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Job Type</label>
              <input 
                type="text" 
                value={jobForm.type} 
                onChange={(e) => setJobForm({...jobForm, type: e.target.value})} 
                required 
                placeholder="e.g. Full-Time, Internship" 
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Job Description</label>
              <textarea 
                value={jobForm.description} 
                onChange={(e) => setJobForm({...jobForm, description: e.target.value})} 
                required 
                placeholder="Overview of responsibilities and role summary..." 
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Key Responsibilities (Comma-separated)</label>
              <textarea 
                value={jobForm.responsibilities} 
                onChange={(e) => setJobForm({...jobForm, responsibilities: e.target.value})} 
                placeholder="Develop RESTful APIs, Collaborate with UI/UX designers, Optimize database queries..." 
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Requirements (Comma-separated)</label>
              <input 
                type="text" 
                value={jobForm.requirements} 
                onChange={(e) => setJobForm({...jobForm, requirements: e.target.value})} 
                placeholder="React.js, Node.js, 3+ years experience" 
              />
            </div>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Posting...' : 'Publish Position'}
            </button>
          </form>
        </div>

        {/* Existing Openings List Card */}
        <div className={styles.listCard}>
          <h2>Active Job Openings ({jobs.length})</h2>
          <div className={styles.tableList}>
            {jobs.length === 0 ? (
              <p className={styles.emptyText}>No open positions found in database.</p>
            ) : (
              jobs.map(job => (
                <div key={job._id} className={styles.rowItem}>
                  <div className={styles.itemInfo}>
                    <div>
                      <span className={styles.deptTag}>{job.department}</span>
                      <strong>{job.title}</strong>
                      <p>{job.location} &bull; {job.type}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteJob(job._id)} className={styles.deleteBtn}>
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

export default ManageCareers;