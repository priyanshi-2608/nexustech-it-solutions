// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import styles from '../styles/Navbar.module.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add scroll listener to transform navbar background on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.navContainer}`}>
        {/* Company Logo */}
        <Link to="/" className={styles.logo} onClick={closeMenu}>
          Nexus<span>Tech</span>
        </Link>

        {/* Mobile Menu Button */}
        <button className={styles.menuToggle} onClick={toggleMenu} aria-label="Toggle navigation">
          {isOpen ? '✕' : '☰'}
        </button>

        {/* Navigation Links */}
        <nav>
          <ul className={`${styles.navLinks} ${isOpen ? styles.open : ''}`}>
            <li>
              <NavLink to="/" end onClick={closeMenu} className={({ isActive }) => (isActive ? styles.active : '')}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" onClick={closeMenu} className={({ isActive }) => (isActive ? styles.active : '')}>
                About Us
              </NavLink>
            </li>
            <li>
              <NavLink to="/services" onClick={closeMenu} className={({ isActive }) => (isActive ? styles.active : '')}>
                Services
              </NavLink>
            </li>
            <li>
              <NavLink to="/projects" onClick={closeMenu} className={({ isActive }) => (isActive ? styles.active : '')}>
                Projects
              </NavLink>
            </li>
            <li>
              <NavLink to="/team" onClick={closeMenu} className={({ isActive }) => (isActive ? styles.active : '')}>
                Our Team
              </NavLink>
            </li>
            <li>
              <NavLink to="/careers" onClick={closeMenu} className={({ isActive }) => (isActive ? styles.active : '')}>
                Careers
              </NavLink>
            </li>
            <li>
              <NavLink to="/blog" onClick={closeMenu} className={({ isActive }) => (isActive ? styles.active : '')}>
                Blog
              </NavLink>
            </li>
            <li>
              <NavLink to="/faqs" onClick={closeMenu} className={({ isActive }) => (isActive ? styles.active : '')}>
                FAQ
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Action Button (Now links directly to the full-page route) */}
        <div className={styles.actions}>
          <Link to="/contact" onClick={closeMenu} className={styles.contactBtn}>
            Contact Us
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;