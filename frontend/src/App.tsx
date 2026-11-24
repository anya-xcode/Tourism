import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Suspense, lazy, useEffect, type ReactNode } from 'react';
import { MotionConfig } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SavedPlacesProvider } from './context/SavedPlacesContext';
import { BlockMark } from './components/print/Print';

// Route-level code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const PlaceDetails = lazy(() => import('./pages/PlaceDetails'));
const ReelsFeed = lazy(() => import('./pages/ReelsFeed'));
const ExploreMap = lazy(() => import('./pages/ExploreMap'));
const AddPlace = lazy(() => import('./pages/AddPlace'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const NotFound = lazy(() => import('./pages/NotFound'));

const PageLoader = () => (
  <div className="flex min-h-[60vh] items-center justify-center" role="status">
    <BlockMark size={40} className="animate-pulse" />
    <span className="sr-only">Loading</span>
  </div>
);

const AUTH_FULLBLEED = ['/login', '/register'];
const NO_FOOTER = ['/map'];

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <PageLoader />;
  return user ? <>{children}</> : <Navigate to="/login" state={{ from: location.pathname }} replace />;
};

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppRoutes() {
  const { pathname } = useLocation();
  const fullBleed = AUTH_FULLBLEED.includes(pathname);

  return (
    <div className="flex min-h-screen flex-col bg-cotton text-iron">
      <a
        href="#main"
        className="sr-only z-50 rounded-[3px] bg-madder px-4 py-2 font-bold text-resist focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <ScrollToTop />
      {!fullBleed && <Navbar />}
      <main id="main" className="flex flex-1 flex-col">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/place/:id" element={<PlaceDetails />} />
            <Route path="/uploads" element={<ReelsFeed />} />
            <Route path="/map" element={<ExploreMap />} />
            <Route path="/add-place" element={<PrivateRoute><AddPlace /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      {!fullBleed && !NO_FOOTER.includes(pathname) && <Footer />}
    </div>
  );
}

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Router>
        <AuthProvider>
          <SavedPlacesProvider>
            <AppRoutes />
          </SavedPlacesProvider>
        </AuthProvider>
      </Router>
    </MotionConfig>
  );
}

export default App;
