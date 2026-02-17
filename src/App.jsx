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

// Lazy load admin pages
const AdminDashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const AdminPricing = React.lazy(() => import('./pages/admin/Pricing'));
const AdminFeatures = React.lazy(() => import('./pages/admin/Features'));
const AdminSettings = React.lazy(() => import('./pages/admin/Settings'));
const AdminSEO = React.lazy(() => import('./pages/admin/SEO'));

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
              <Route index element={
                <React.Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
                  <AdminDashboard />
                </React.Suspense>
              } />
              <Route path="pricing" element={
                <React.Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
                  <AdminPricing />
                </React.Suspense>
              } />
              <Route path="features" element={
                <React.Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
                  <AdminFeatures />
                </React.Suspense>
              } />
              <Route path="settings" element={
                <React.Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
                  <AdminSettings />
                </React.Suspense>
              } />
              <Route path="seo" element={
                <React.Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
                  <AdminSEO />
                </React.Suspense>
              } />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
