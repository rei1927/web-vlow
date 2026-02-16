import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Efficiency from './components/Efficiency';
import Pricing from './components/Pricing';
import Footer from './components/Footer';
import Login from './pages/Login';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/admin/Dashboard';
import AdminPricing from './pages/admin/Pricing';
import AdminFeatures from './pages/admin/Features';
import AdminSettings from './pages/admin/Settings';

function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-dark-950 selection:bg-primary-100 selection:text-primary-900">
      <Navbar />
      <Hero />
      <Features />
      <Efficiency />
      <Pricing />
      <Footer />
    </div>
  );
}

import SEOHead from './components/SEOHead';
import AdminSEO from './pages/admin/SEO';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SEOHead />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/cmsadmin" element={<Login />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="pricing" element={<AdminPricing />} />
              <Route path="features" element={<AdminFeatures />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="seo" element={<AdminSEO />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
