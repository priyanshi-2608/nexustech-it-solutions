// src/components/home/ClientsTicker.jsx
import React from 'react';
import { Building2, Globe, Zap, Shield, Cloud } from 'lucide-react';
import styles from '../../styles/ClientsTicker.module.css';

const clients = [
  { name: 'ACME Corp', icon: <Building2 size={22} /> },
  { name: 'GlobalTech', icon: <Globe size={22} /> },
  { name: 'Apex Systems', icon: <Zap size={22} /> },
  { name: 'Vanguard Sec', icon: <Shield size={22} /> },
  { name: 'CloudScale', icon: <Cloud size={22} /> },
];

const ClientsTicker = () => {
  return (
    <section className={styles.clientsSection}>
      <div className={styles.clientsContainer}>
        <p className={styles.clientsTitle}>TRUSTED BY INDUSTRY LEADERS AND FAST-GROWING ENTERPRISES WORLDWIDE</p>
        <div className={styles.clientsGrid}>
          {clients.map((client, index) => (
            <div key={index} className={styles.clientItem}>
              <span className={styles.clientIcon}>{client.icon}</span>
              <span className={styles.clientName}>{client.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientsTicker;