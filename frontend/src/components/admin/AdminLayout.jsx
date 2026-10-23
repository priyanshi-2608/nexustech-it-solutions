import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
    Settings, 
    Users, 
    Briefcase, 
    FileText, 
    HelpCircle, 
    Mail, 
    ClipboardList, 
    ArrowLeft,
    LogOut,
    Cpu, // Icon for technologies
    FolderGit2, // Icon for projects
    MessageSquareQuote // Icon for testimonials
} from 'lucide-react';
import styles from '../../styles/admin/AdminLayout.module.css';

const AdminLayout = () => {
  const navigate = useNavigate();

  // Explicitly clear tokens when leaving the admin dashboard via "Back to Website"
  const handleBackToWebsite = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    navigate('/', { replace: true });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className={styles.adminContainer}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>Admin Portal</h2>
          <p>NexusTech Management</p>
        </div>

        <nav className={styles.navLinks}>
          <NavLink
            to="services"
            className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
          >
            <Settings size={18} /> <span className={styles.navText}>Manage Services</span>
          </NavLink>

          <NavLink
            to="team"
            className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
          >
            <Users size={18} /> <span className={styles.navText}>Manage Team</span>
          </NavLink>

          <NavLink
            to="careers"
            className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
          >
            <Briefcase size={18} /> <span className={styles.navText}>Manage Careers</span>
          </NavLink>

          <NavLink
            to="technologies"
            className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
          >
            <Cpu size={18} /> <span className={styles.navText}>Manage Technologies</span>
          </NavLink>

          <NavLink
            to="projects"
            className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
          >
            <FolderGit2 size={18} /> <span className={styles.navText}>Manage Projects</span>
          </NavLink>

          <NavLink
            to="testimonials"
            className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
          >
            <MessageSquareQuote size={18} /> <span className={styles.navText}>Manage Testimonials</span>
          </NavLink>

          <NavLink
            to="blogs"
            className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
          >
            <FileText size={18} /> <span className={styles.navText}>Manage Blogs</span>
          </NavLink>

          <NavLink
            to="faqs"
            className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
          >
            <HelpCircle size={18} /> <span className={styles.navText}>Manage FAQs</span>
          </NavLink>

          <NavLink
            to="contacts"
            className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
          >
            <Mail size={18} /> <span className={styles.navText}>Manage Contacts</span>
          </NavLink>

          <NavLink
            to="applications"
            className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
          >
            <ClipboardList size={18} /> <span className={styles.navText}>Manage Applications</span>
          </NavLink>
        </nav>

        <div className={styles.sidebarFooter}>
          <button onClick={handleBackToWebsite} className={styles.backBtn}>
            <ArrowLeft size={16} /> <span className={styles.navText}>Back to Website</span>
          </button>
          
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <LogOut size={16} /> <span className={styles.navText}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;