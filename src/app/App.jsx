import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LangProvider } from '../shared/i18n';
import { AdminAuthProvider } from '../shared/admin/adminAuth';
import { selectIsAuth } from '../features/auth';
import Navbar from '../widgets/navbar/Navbar';
import Footer from '../widgets/footer/Footer';
import StickyCTA from '../widgets/sticky-cta/StickyCTA';
import Home from '../pages/home/Home';
import AboutCampus from '../pages/about-campus/AboutCampus';
import AboutVision from '../pages/about-vision/AboutVision';
import AboutLeadership from '../pages/about-leadership/AboutLeadership';
import AboutWhyTis from '../pages/about-why-tis/AboutWhyTis';
import Education from '../pages/education/Education';
import Partnerships from '../pages/partnerships/Partnerships';
import Careers from '../pages/careers/Careers';
import News from '../pages/news/News';
import Admissions from '../pages/admissions/Admissions';
import Contact from '../pages/contact/Contact';
import Policies from '../pages/policies/Policies';
import AdminLogin from '../pages/admin/AdminLogin';
import AdminDashboard from '../pages/admin/AdminDashboard';
import '../app/globals.css';
import '../pages/admin/AdminDashboard.css';

// Protected route wrapper
function ProtectedAdminRoute({ children }) {
  const isAuth = useSelector(selectIsAuth);
  return isAuth ? children : <Navigate to="/admin" replace />;
}

// Public site layout
function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <StickyCTA />
    </>
  );
}

export default function App() {
  return (
    <LangProvider>
      <AdminAuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Admin routes (no public navbar/footer) */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              }
            />

            {/* Public routes */}
            <Route path="/*" element={
              <PublicLayout>
                <Routes>

                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<Navigate to="/about/vision" replace />} />
                  <Route path="/about/campus" element={<AboutCampus />} />
                  <Route path="/about/vision" element={<AboutVision />} />
                  <Route path="/about/leadership" element={<AboutLeadership />} />
                  <Route path="/about/why-tis" element={<AboutWhyTis />} />
                  <Route path="/education" element={<Education />} />
                  <Route path="/partnerships" element={<Partnerships />} />
                  <Route path="/careers" element={<Careers />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/admissions" element={<Admissions />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/policies" element={<Policies />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </PublicLayout>
            } />
          </Routes>
        </BrowserRouter>
      </AdminAuthProvider>
    </LangProvider>
  );
}
