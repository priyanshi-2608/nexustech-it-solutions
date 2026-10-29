import React, { useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import styles from '../../styles/admin/ManageServices.module.css';

const DynamicIcon = ({ name, size = 20, className }) => {
  const IconComponent = LucideIcons[name] || LucideIcons.HelpCircle;
  return <IconComponent size={size} className={className} />;
};

const AVAILABLE_ICONS = [
  { name: 'Code', label: 'Development & Coding' },
  { name: 'Server', label: 'Cloud & Infrastructure' },
  { name: 'Cpu', label: 'AI & Machine Learning' },
  { name: 'Shield', label: 'Security & Safety' },
  { name: 'Layout', label: 'Design & UI/UX' },
  { name: 'Database', label: 'Data & Storage' },
  { name: 'Globe', label: 'Real-Time / Global' },
  { name: 'Smartphone', label: 'Mobile Apps' },
  { name: 'Zap', label: 'Speed & Automation' },
  { name: 'Settings', label: 'Configuration & Tools' }
];

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [serviceForm, setServiceForm] = useState({ title: '', description: '', icon: 'Code', features: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const getToken = () => localStorage.getItem('token') || localStorage.getItem('adminToken');

  const fetchServices = async () => {
    try {
      const token = getToken();
      const res = await fetch('http://localhost:5000/api/services', {
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      const data = await res.json();
      setServices(data);
    } catch (err) {
      console.error('Error fetching services:', err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const token = getToken();
      const formattedData = {
        ...serviceForm,
        features: serviceForm.features.split(',').map((f) => f.trim()).filter(Boolean)
      };

      const res = await fetch('http://localhost:5000/api/services', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(formattedData)
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ text: 'Service published successfully!', type: 'success' });
        setServiceForm({ title: '', description: '', icon: 'Code', features: '' });
        fetchServices();
      } else {
        setMessage({ text: data.error || 'Failed to add service.', type: 'error' });
      }
    } catch (err) {
      console.error('Error publishing service:', err);
      setMessage({ text: 'Server error.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      const token = getToken();
      const res = await fetch(`http://localhost:5000/api/services/${id}`, { 
        method: 'DELETE',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      if (res.ok) {
        setServices(services.filter(s => s._id !== id));
        setMessage({ text: 'Service deleted successfully.', type: 'success' });
      } else {
        setMessage({ text: 'Failed to delete service.', type: 'error' });
      }
    } catch (err) {
      console.error('Error deleting service:', err);
      setMessage({ text: 'Server error connecting to delete.', type: 'error' });
    }
  };

  return (
    <div className={styles.managePage}>
      <div className={styles.header}>
        <h1>Manage Services</h1>
        <p>Add, edit, or remove enterprise offerings displayed across your platform.</p>
      </div>

      {message.text && (
        <div className={`${styles.alert} ${message.type === 'error' ? styles.alertError : styles.alertSuccess}`}>
          {message.text}
        </div>
      )}

      <div className={styles.contentGrid}>
        {/* Add Form Card */}
        <div className={styles.formCard}>
          <h2>Add New Service</h2>
          <form onSubmit={handleServiceSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label>Service Title</label>
              <input 
                type="text" 
                value={serviceForm.title} 
                onChange={(e) => setServiceForm({...serviceForm, title: e.target.value})} 
                required 
                placeholder="e.g. Cloud Architecture" 
              />
            </div>

            {/* Visual Icon Picker Grid */}
            <div className={styles.inputGroup}>
              <label>Choose Service Symbol / Icon</label>
              <p className={styles.pickerSubtext}>
                Select the symbol that best represents this service category:
              </p>
              <div className={styles.iconGrid}>
                {AVAILABLE_ICONS.map((item) => {
                  const isSelected = serviceForm.icon === item.name;
                  return (
                    <div 
                      key={item.name}
                      onClick={() => setServiceForm({...serviceForm, icon: item.name})}
                      className={`${styles.iconOption} ${isSelected ? styles.selectedIconOption : ''}`}
                    >
                      <DynamicIcon name={item.name} size={22} className={styles.pickerIcon} />
                      <span className={styles.iconLabel}>
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Description</label>
              <textarea 
                value={serviceForm.description} 
                onChange={(e) => setServiceForm({...serviceForm, description: e.target.value})} 
                required 
                placeholder="Summary of service capabilities..." 
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Features (Comma-separated)</label>
              <input 
                type="text" 
                value={serviceForm.features} 
                onChange={(e) => setServiceForm({...serviceForm, features: e.target.value})} 
                placeholder="Feature 1, Feature 2, Feature 3" 
              />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Publishing...' : 'Publish Service'}
            </button>
          </form>
        </div>

        {/* Existing List Card */}
        <div className={styles.listCard}>
          <h2>Active Services ({services.length})</h2>
          <div className={styles.tableList}>
            {services.length === 0 ? (
              <p className={styles.emptyText}>No services found in database.</p>
            ) : (
              services.map(s => (
                <div key={s._id} className={styles.rowItem}>
                  <div className={styles.itemInfo}>
                    <div className={styles.iconWrapper}>
                      <DynamicIcon name={s.icon} size={22} />
                    </div>
                    <div>
                      <strong>{s.title}</strong>
                      <p>{s.description ? `${s.description.substring(0, 60)}...` : ''}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteService(s._id)} className={styles.deleteBtn}>
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

export default ManageServices;