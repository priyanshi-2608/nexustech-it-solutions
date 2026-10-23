import React, { useState, useEffect } from 'react';
import styles from '../../styles/admin/ManageApplication.module.css';

const ManageApplications = () => {
    const [applications, setApplications] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState('');
    const [sortByScore, setSortByScore] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deletingId, setDeletingId] = useState(null);
    const getToken = () => localStorage.getItem('token') || localStorage.getItem('adminToken');

    useEffect(() => {
        const token = getToken();
        fetch('http://localhost:5000/api/jobs', {
            headers: {
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            }
        })
            .then((res) => res.json())
            .then((data) => setJobs(data))
            .catch((err) => console.error('Error fetching jobs:', err));
    }, []);

    useEffect(() => {
        setLoading(true);
        const token = getToken();
        const url = selectedJobId
            ? `http://localhost:5000/api/applications?jobId=${selectedJobId}`
            : 'http://localhost:5000/api/applications';

        fetch(url, {
            headers: {
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            }
        })
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch applications');
                return res.json();
            })
            .then((data) => {
                setApplications(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error:', err);
                setError('Could not load applications.');
                setLoading(false);
            });
    }, [selectedJobId]);

    const handleDelete = async (id, applicantName) => {
        if (!window.confirm(`Are you sure you want to delete the application for ${applicantName}?`)) {
            return;
        }

        setDeletingId(id);

        try {
            const token = getToken();
            const response = await fetch(`http://localhost:5000/api/applications/${id}`, {
                method: 'DELETE',
                headers: {
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                }
            });

            const data = await response.json();

            if (response.ok) {
                setApplications(applications.filter((app) => app._id !== id));
            } else {
                alert(data.message || 'Failed to delete application.');
            }
        } catch (err) {
            console.error('Error deleting application:', err);
            alert('Server error while trying to delete application.');
        } finally {
            setDeletingId(null);
        }
    };

    const getResumeUrl = (resumePath) => {
        if (!resumePath) return '#';
        if (resumePath.startsWith('http://') || resumePath.startsWith('https://')) {
            return resumePath;
        }
        const normalizedPath = resumePath.replace(/\\/g, '/');
        const cleanPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
        return `http://localhost:5000${cleanPath}`;
    };

    const getAtsBadgeClass = (score) => {
        if (score >= 70) return styles.atsHigh;
        if (score >= 40) return styles.atsMedium;
        return styles.atsLow;
    };

    const displayedApplications = [...applications].sort((a, b) => {
        if (sortByScore) {
            return (b.atsScore || 0) - (a.atsScore || 0);
        }
        return new Date(b.createdAt) - new Date(new Date(a.createdAt || Date.now())); 
    });

    return (
        <div className={styles.adminContainer}>
            <div className={styles.headerSection}>
                <h2>Manage Candidate Applications</h2>

                {/* Filters and Controls */}
                <div className={styles.controlsWrapper}>
                    {/* Sort Toggle Button */}
                    <button
                        onClick={() => setSortByScore(!sortByScore)}
                        className={`${styles.sortBtn} ${sortByScore ? styles.sortBtnActive : ''}`}
                    >
                        {sortByScore ? '⚡ Sorted by Best ATS Match' : 'Sort by ATS Score 📊'}
                    </button>

                    <div className={styles.filterGroup}>
                        <label>Filter by Role:</label>
                        <select
                            className={styles.filterSelect}
                            value={selectedJobId}
                            onChange={(e) => setSelectedJobId(e.target.value)}
                        >
                            <option value="">All Roles ({applications.length})</option>
                            {jobs.map((job) => (
                                <option key={job._id} value={job._id}>
                                    {job.title} ({job.department})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {loading && <div className={styles.statusMessage}>Loading applications...</div>}
            {error && <div className={`${styles.statusMessage} ${styles.errorText}`}>{error}</div>}

            {!loading && !error && applications.length === 0 && (
                <div className={styles.statusMessage}>
                    No applications found for this role.
                </div>
            )}

            {!loading && !error && applications.length > 0 && (
                <div className={styles.tableResponsive}>
                    <table className={styles.appTable}>
                        <thead>
                            <tr>
                                <th>Applicant Name</th>
                                <th>Role Applied</th>
                                <th>ATS Match</th>
                                <th>Email Address</th>
                                <th>Phone Number</th>
                                <th>Resume / Link</th>
                                <th>Cover Letter</th>
                                <th>Date Applied</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedApplications.map((app) => (
                                <tr key={app._id}>
                                    <td className={styles.applicantName}>{app.name}</td>
                                    <td>
                                        <span className={styles.roleBadge}>{app.jobTitle || 'N/A'}</span>
                                    </td>
                                    <td>
                                        <span 
                                            className={`${styles.atsBadge} ${getAtsBadgeClass(app.atsScore)}`}
                                            title="Calculated ATS Match Score"
                                        >
                                            {app.atsScore !== undefined ? `${app.atsScore}%` : '0%'}
                                        </span>
                                    </td>
                                    <td>{app.email}</td>
                                    <td>{app.phone}</td>
                                    <td>
                                        <a
                                            href={getResumeUrl(app.resumeUrl || app.resume)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.resumeLink}
                                        >
                                            View Resume ↗
                                        </a>
                                    </td>
                                    <td>
                                        <div className={styles.coverLetterText} title={app.coverLetter}>
                                            {app.coverLetter || 'No cover letter provided'}
                                        </div>
                                    </td>
                                    <td>{new Date(app.createdAt || Date.now()).toLocaleDateString()}</td>
                                    <td>
                                        <button
                                            onClick={() => handleDelete(app._id, app.name)}
                                            disabled={deletingId === app._id}
                                            className={styles.deleteBtn}
                                        >
                                            {deletingId === app._id ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ManageApplications;