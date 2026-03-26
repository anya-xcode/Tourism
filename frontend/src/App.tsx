import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PlaceDetails from './pages/PlaceDetails';
import ReelsFeed from './pages/ReelsFeed';
import ExploreMap from './pages/ExploreMap';
import AddPlace from './pages/AddPlace';

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
    <div className="app-container min-h-screen bg-[var(--background)] text-[var(--text)]">
      {!authFullBleed && <Navbar />}
      <main style={{ paddingTop: authFullBleed ? 0 : 'calc(var(--header-height) + 12px)' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/place/:id" element={<PlaceDetails />} />
          <Route path="/reels" element={<ReelsFeed />} />
          <Route path="/map" element={<ExploreMap />} />
          <Route path="/add-place" element={<PrivateRoute><AddPlace /></PrivateRoute>} />
          <Route path="/profile" element={
            <PrivateRoute>
              <div className="container py-16 px-6">
                <h1 className="text-4xl font-jakarta font-bold mb-6">My Profile</h1>
                <div className="glass-card p-8">
                  <p className="text-[var(--text-muted)]">Profile page coming soon...</p>
                </div>
              </div>
            </PrivateRoute>
          } />
        </Routes>
      </main>
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
