import { useEffect } from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';

import { StoreProvider, useStore } from './data/StoreContext.jsx';
import { ToastProvider } from './components/Toast.jsx';
import Loader from './components/Loader.jsx';

import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

import Home from './pages/Home.jsx';
import Workouts from './pages/Workouts.jsx';
import Trainers from './pages/Trainers.jsx';
import Membership from './pages/Membership.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';

import AdminLogin from './admin/AdminLogin.jsx';
import AdminLayout from './admin/AdminLayout.jsx';
import Dashboard from './admin/Dashboard.jsx';
import HomeSettings from './admin/HomeSettings.jsx';
import MembershipAdmin from './admin/MembershipAdmin.jsx';
import TrainersAdmin from './admin/TrainersAdmin.jsx';
import WorkoutsAdmin from './admin/WorkoutsAdmin.jsx';
import ContactSettings from './admin/ContactSettings.jsx';
import WebsiteSettings from './admin/WebsiteSettings.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function PublicLayout() {
  const { loading, error, home } = useStore();
  if (loading && !home) return <Loader label="Loading FitZone…" />;
  if (error && !home) {
    return (
      <div className="empty-state" style={{ margin: 40 }}>
        <h3>Could not reach the API</h3>
        <p>{error}</p>
        <button className="btn btn--primary" onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }
  return (
    <>
      <Navbar />
      <main className="page"><Outlet /></main>
      <Footer />
    </>
  );
}

function RequireAdmin() {
  const { auth } = useStore();
  const location = useLocation();
  if (!auth) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  return <AdminLayout />;
}

export default function App() {
  return (
    <StoreProvider>
      <ToastProvider>
        <ScrollToTop />
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/trainers" element={<Trainers />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          <Route path="/admin/login" element={<AdminLogin />} />

          <Route path="/admin" element={<RequireAdmin />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="home-settings" element={<HomeSettings />} />
            <Route path="membership" element={<MembershipAdmin />} />
            <Route path="trainers" element={<TrainersAdmin />} />
            <Route path="workouts" element={<WorkoutsAdmin />} />
            <Route path="contact-settings" element={<ContactSettings />} />
            <Route path="website-settings" element={<WebsiteSettings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </StoreProvider>
  );
}
