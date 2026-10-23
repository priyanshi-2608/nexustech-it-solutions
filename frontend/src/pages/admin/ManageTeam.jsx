import React, { useState, useEffect } from 'react';
import styles from '../../styles/admin/ManageTeam.module.css';

const ManageTeam = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamForm, setTeamForm] = useState({ name: '', role: '', image: '', bio: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const fetchTeamMembers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/team');
      const data = await res.json();
      setTeamMembers(data);
    } catch (err) {
      console.error('Error fetching team members:', err);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleTeamSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');

      const res = await fetch('http://localhost:5000/api/team', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(teamForm)
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ text: 'Team member added successfully!', type: 'success' });
        setTeamForm({ name: '', role: '', image: '', bio: '' });
        fetchTeamMembers();
      } else {
        setMessage({ text: data.error || 'Failed to add team member.', type: 'error' });
      }
    } catch (err) {
      console.error('Error adding team member:', err);
      setMessage({ text: 'Server error.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMember = async (id) => {
    if (!window.confirm('Remove this team member?')) return;
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
      const res = await fetch(`http://localhost:5000/api/team/${id}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setTeamMembers(teamMembers.filter(m => m._id !== id));
      }
    } catch (err) {
      console.error('Error deleting team member:', err);
    }
  };

  return (
    <div className={styles.managePage}>
      <div className={styles.header}>
        <h1>Manage Team</h1>
        <p>Add leadership, engineers, and key personnel displayed on your public Team page.</p>
      </div>

      {message.text && (
        <div className={`${styles.alert} ${message.type === 'error' ? styles.alertError : styles.alertSuccess}`}>
          {message.text}
        </div>
      )}

      <div className={styles.contentGrid}>
        {/* Add Team Member Form Card */}
        <div className={styles.formCard}>
          <h2>Add Team Member</h2>
          <form onSubmit={handleTeamSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label>Full Name</label>
              <input 
                type="text" 
                value={teamForm.name} 
                onChange={(e) => setTeamForm({...teamForm, name: e.target.value})} 
                required 
                placeholder="e.g. Sarah Jenkins" 
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Role / Position</label>
              <input 
                type="text" 
                value={teamForm.role} 
                onChange={(e) => setTeamForm({...teamForm, role: e.target.value})} 
                required 
                placeholder="e.g. Chief Technology Officer" 
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Profile Image URL</label>
              <input 
                type="text" 
                value={teamForm.image} 
                onChange={(e) => setTeamForm({...teamForm, image: e.target.value})} 
                required 
                placeholder="e.g. /team-member1.jpg" 
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Short Biography</label>
              <textarea 
                value={teamForm.bio} 
                onChange={(e) => setTeamForm({...teamForm, bio: e.target.value})} 
                required 
                placeholder="Brief background or expertise summary..." 
              />
            </div>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Adding...' : 'Add Team Member'}
            </button>
          </form>
        </div>

        {/* Existing Team Members List Card */}
        <div className={styles.listCard}>
          <h2>Active Team Members ({teamMembers.length})</h2>
          <div className={styles.tableList}>
            {teamMembers.length === 0 ? (
              <p className={styles.emptyText}>No team members found in database.</p>
            ) : (
              teamMembers.map(member => (
                <div key={member._id} className={styles.rowItem}>
                  <div className={styles.itemInfo}>
                    <img 
                      src={member.image || '/placeholder-avatar.jpg'} 
                      alt={member.name} 
                      className={styles.memberAvatar} 
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/50'; }}
                    />
                    <div>
                      <strong>{member.name}</strong>
                      <span className={styles.roleTag}>{member.role}</span>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteMember(member._id)} className={styles.deleteBtn}>
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

export default ManageTeam;