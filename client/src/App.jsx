import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CareersPage from './pages/CareersPage';
import CareerDetailPage from './pages/CareerDetailPage';
import GuidancePage from './pages/GuidancePage';
import RecommendationsPage from './pages/RecommendationsPage';
import ContactPage from './pages/ContactPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import SavedCareersPage from './pages/SavedCareersPage';
import NotFoundPage from './pages/NotFoundPage';

// Layout
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && user?.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
};

const AppLayout = ({ children, noFooter = false }) => (
  <>
    <Navbar />
    <main className="min-h-screen">{children}</main>
    {!noFooter && <Footer />}
  </>
);

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout><LandingPage /></AppLayout>} />
      <Route path="/login" element={<PublicRoute><AppLayout noFooter><LoginPage /></AppLayout></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><AppLayout noFooter><RegisterPage /></AppLayout></PublicRoute>} />
      <Route path="/careers" element={<AppLayout><CareersPage /></AppLayout>} />
      <Route path="/careers/:id" element={<AppLayout><CareerDetailPage /></AppLayout>} />
      <Route path="/contact" element={<AppLayout><ContactPage /></AppLayout>} />
      <Route path="/guidance" element={<AppLayout><GuidancePage /></AppLayout>} />

      <Route path="/dashboard" element={<ProtectedRoute><AppLayout><DashboardPage /></AppLayout></ProtectedRoute>} />
      <Route path="/recommendations" element={<ProtectedRoute><AppLayout><RecommendationsPage /></AppLayout></ProtectedRoute>} />
      <Route path="/saved" element={<ProtectedRoute><AppLayout><SavedCareersPage /></AppLayout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><AppLayout><ProfilePage /></AppLayout></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute adminOnly><AppLayout noFooter><AdminPage /></AppLayout></ProtectedRoute>} />

      <Route path="*" element={<AppLayout><NotFoundPage /></AppLayout>} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: { borderRadius: '12px', fontFamily: 'Sora, sans-serif', fontSize: '14px' },
              success: { iconTheme: { primary: '#6366f1', secondary: '#fff' } }
            }}
          />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
