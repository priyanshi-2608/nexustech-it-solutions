import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerContainer}>
          {/* Column 1: About Company */}
          <div className={styles.col}>
            <Link to="/" className={styles.logo}>
              Nexus<span>Tech</span>
            </Link>
            <p>
              Empowering global enterprises with next-generation web apps, mobile solutions, and intelligent AI integrations.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className={styles.col}>
            <h3>Quick Links</h3>
            <ul className={styles.linksList}>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/projects">Projects</Link></li>
              <li><Link to="/team">Our Team</Link></li>
            </ul>
          </div>

          {/* Column 3: Resources & Support */}
          <div className={styles.col}>
            <h3>Resources</h3>
            <ul className={styles.linksList}>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/faqs">FAQ</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className={styles.col}>
            <h3>Get in Touch</h3>
            <p>Email: contact@nexustech.com</p>
            <p>Phone: +1 (555) 234-5678</p>
            <p>Location: Tech Hub, Suite 400</p>
          </div>
        </div>

        {/* Bottom Copyright & Socials */}
        <div className={styles.bottomBar}>
          <p>&copy; {new Date().getFullYear()} NexusTech IT Solutions. All rights reserved.</p>
          <div className={styles.socialLinks}>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">LinkedIn</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">Twitter</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;