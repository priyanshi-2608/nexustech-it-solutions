import React, { useEffect, useState } from 'react';
import styles from '../../styles/admin/ManageContacts.module.css';

const ManageContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getToken = () => localStorage.getItem('token') || localStorage.getItem('adminToken');

  const fetchContacts = async () => {
    try {
      const token = getToken();
      const response = await fetch('http://localhost:5000/api/contact', {
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      const data = await response.json();
      if (data.success) {
        setContacts(data.contacts);
      } else {
        setError('Failed to load messages.');
      }
    } catch (err) {
      setError('Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      const token = getToken();
      const response = await fetch(`http://localhost:5000/api/contact/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      const data = await response.json();
      if (data.success) {
        setContacts(contacts.filter((c) => c._id !== id));
      } else {
        alert('Failed to delete message.');
      }
    } catch (err) {
      alert('Error connecting to server.');
    }
  };

  return (
    <div className={styles.adminContainer}>
      <div className={styles.headerBox}>
        <h2>Admin Dashboard - Manage Contacts</h2>
        <p>Review inquiries submitted by visitors through the NexusTech website.</p>
      </div>

      {loading && <p className={styles.statusText}>Loading messages...</p>}
      {error && <p className={styles.errorText}>{error}</p>}

      {!loading && !error && contacts.length === 0 && (
        <p className={styles.statusText}>No messages found.</p>
      )}

      {contacts.length > 0 && (
        <div className={styles.tableWrapper}>
          <table className={styles.contactTable}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((item) => (
                <tr key={item._id}>
                  <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td><strong>{item.name}</strong></td>
                  <td><a href={`mailto:${item.email}`}>{item.email}</a></td>
                  <td>{item.subject}</td>
                  <td className={styles.messageCell}>{item.message}</td>
                  <td>
                    <button 
                      onClick={() => handleDelete(item._id)} 
                      className={styles.deleteBtn}
                    >
                      Delete
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

export default ManageContacts;