import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { AuthProvider, useAuth } from './context/AuthContext';

// Dynamic imports for code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const PlaceDetails = lazy(() => import('./pages/PlaceDetails'));
const ReelsFeed = lazy(() => import('./pages/ReelsFeed'));
const ExploreMap = lazy(() => import('./pages/ExploreMap'));
const AddPlace = lazy(() => import('./pages/AddPlace'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

const PageLoader = () => (
  <div className="flex h-[70vh] items-center justify-center">
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4" />
      <p className="text-gray-400 font-medium text-sm animate-pulse tracking-wide">Loading Experience...</p>
    </div>
  </div>
);

const AUTH_FULLBLEED = ['/login', '/register'];

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[var(--background)]">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-full mb-4 shadow-lg animate-pulse">
          <span className="text-2xl">🌍</span>
        </div>
        <p className="gradient-text font-jakarta font-bold text-xl animate-pulse">Exploring Global Data...</p>
      </div>
    </div>
  );
  return user ? <>{children}</> : <Navigate to="/login" />;
};

function AppRoutes() {
  const { pathname } = useLocation();
  const authFullBleed = AUTH_FULLBLEED.includes(pathname);

  return (
    <div className="app-container min-h-screen bg-[var(--background)] text-[var(--text)] flex flex-col">
      {!authFullBleed && <Navbar />}
      <main className="flex-1" style={{ paddingTop: authFullBleed ? 0 : 'calc(var(--header-height) + 12px)' }}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/place/:id" element={<PlaceDetails />} />
            <Route path="/uploads" element={<ReelsFeed />} />
            <Route path="/map" element={<ExploreMap />} />
            <Route path="/add-place" element={<PrivateRoute><AddPlace /></PrivateRoute>} />
            <Route path="/profile" element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            } />
          </Routes>
        </Suspense>
      </main>
      {!authFullBleed && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
