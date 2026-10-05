import { Routes, Route, Navigate, Outlet, Link } from 'react-router-dom';
import { useAuth } from './hooks/useAuth.jsx';
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
import AdminDashboard from './admin/AdminDashboard.jsx';
import HomeManagement from './admin/HomeManagement.jsx';
import MembershipManagement from './admin/MembershipManagement.jsx';
import TrainerManagement from './admin/TrainerManagement.jsx';
import WorkoutManagement from './admin/WorkoutManagement.jsx';
import AboutManagement from './admin/AboutManagement.jsx';
import ContactManagement from './admin/ContactManagement.jsx';
import SEOManagement from './admin/SEOManagement.jsx';
import WebsiteSettings from './admin/WebsiteSettings.jsx';
import Loading from './components/Loading.jsx';

function PublicLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

function RequireAuth({ children }) {
  const { admin, loading } = useAuth();
  if (loading) return <Loading />;
  if (!admin) return <Navigate to="/admin/login" replace />;
  return children;
}

export default function App() {
  return (
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
      <Route path="/admin" element={<RequireAuth><AdminLayout /></RequireAuth>}>
        <Route index element={<AdminDashboard />} />
        <Route path="home" element={<HomeManagement />} />
        <Route path="memberships" element={<MembershipManagement />} />
        <Route path="trainers" element={<TrainerManagement />} />
        <Route path="workouts" element={<WorkoutManagement />} />
        <Route path="about" element={<AboutManagement />} />
        <Route path="messages" element={<ContactManagement />} />
        <Route path="seo" element={<SEOManagement />} />
        <Route path="settings" element={<WebsiteSettings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
