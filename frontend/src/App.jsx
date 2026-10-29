// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './styles/animations.css';

import PublicLayout from './components/PublicLayout';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Team from './pages/Team';
import TeamDetail from './pages/TeamDetail';
import Careers from './pages/Careers';
import CareersDetail from './pages/CareersDetail';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import FAQ from './pages/FAQ';
import ClientReviewPage from './pages/ClientReviewPage';

import AdminLogin from './pages/admin/AdminLogin';
import ManageServices from './pages/admin/ManageServices';
import ManageTeam from './pages/admin/ManageTeam';
import ManageCareers from './pages/admin/ManageCareers';
import ManageBlogs from './pages/admin/ManageBlogs';
import ManageFAQs from './pages/admin/ManageFAQs';
import ManageContacts from './pages/admin/ManageContacts';
import ManageApplications from './pages/admin/ManageApplications';
import ManageTechnologies from './pages/admin/ManageTechnologies';
import ManageProjects from './pages/admin/ManageProjects';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import './styles/global.css';

function App() {
  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex flex-col justify-between">
      <main className="flex-grow">
        <Routes>
          {/* Public Website Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:id" element={<ServiceDetail />} />
            <Route path="/team" element={<Team />} />
            <Route path="/team/:id" element={<TeamDetail />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/careers/:id" element={<CareersDetail />}/>
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/faqs" element={<FAQ />} />
            <Route path="/review" element={<ClientReviewPage />} />
          </Route>

          {/* Admin Login Route (Publicly accessible, outside the layout) */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Dashboard Layout & Nested Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            {/* Automatically redirects /admin to /admin/services */}
            <Route index element={<Navigate to="services" replace />} />
            
            {/* Removed leading slashes so they resolve properly to /admin/services, /admin/team, etc. */}
            <Route path="services" element={<ManageServices />} />
            <Route path="team" element={<ManageTeam />} />
            <Route path="careers" element={<ManageCareers />} />
            <Route path="blogs" element={<ManageBlogs />} />
            <Route path="faqs" element={<ManageFAQs />} />
            <Route path="contacts" element={<ManageContacts />} />
            <Route path="applications" element={<ManageApplications />} />
            <Route path="technologies" element={<ManageTechnologies />} />
            <Route path="projects" element={<ManageProjects />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;