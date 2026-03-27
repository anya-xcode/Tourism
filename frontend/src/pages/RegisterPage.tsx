import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, MapPin, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AuthTravelShell } from '../components/auth/AuthTravelShell';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    city: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      setError('Please agree to the terms and privacy policy');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/register', formData);
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setError(message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (response: CredentialResponse) => {
    try {
      setLoading(true);
      setError('');
      const res = await api.post('/auth/google', { token: response.credential });
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setError(message || 'Google sign-up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthTravelShell>
      <div className="auth-travel-card">
        <div className="mb-10">
          <Link to="/" className="inline-block mb-8 text-blue-600 font-bold tracking-tight text-xl hover:opacity-80 transition-opacity">
            TravelExplorer<span className="text-slate-400">.</span>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-3">
            Create Account
          </h1>
          <p className="text-[16px] font-medium text-slate-500">
            Join our community of world travelers.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-8 flex items-center gap-3 rounded-xl bg-orange-50 px-5 py-4 text-sm font-semibold text-orange-800 border border-orange-100"
          >
            <div className="h-2 w-2 shrink-0 rounded-full bg-orange-500" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2.5">
              <label htmlFor="reg-name" className="px-1 text-[13px] font-bold text-slate-700">
                Full Name
              </label>
              <div className="relative group">
                <User className="auth-travel-input-icon group-focus-within:text-blue-600 transition-colors" size={19} />
                <input
                  id="reg-name"
                  type="text"
                  autoComplete="name"
                  required
                  className="auth-travel-input"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <label htmlFor="reg-city" className="px-1 text-[13px] font-bold text-slate-700">
                Current City
              </label>
              <div className="relative group">
                <MapPin className="auth-travel-input-icon group-focus-within:text-blue-600 transition-colors" size={19} />
                <input
                  id="reg-city"
                  type="text"
                  autoComplete="address-level2"
                  required
                  className="auth-travel-input"
                  placeholder="Paris, France"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <label htmlFor="reg-email" className="px-1 text-[13px] font-bold text-slate-700">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="auth-travel-input-icon group-focus-within:text-blue-600 transition-colors" size={20} />
              <input
                id="reg-email"
                type="email"
                autoComplete="email"
                required
                className="auth-travel-input"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <label htmlFor="reg-password" className="px-1 text-[13px] font-bold text-slate-700">
              Password
            </label>
            <div className="relative group">
              <Lock className="auth-travel-input-icon group-focus-within:text-blue-600 transition-colors" size={20} />
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                className="auth-travel-input pr-12"
                placeholder="Choose a password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex items-start gap-3 px-1 py-1">
            <input
              id="agree"
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-all"
            />
            <label htmlFor="agree" className="cursor-pointer text-left text-[14px] font-medium leading-relaxed text-slate-500 select-none">
              I agree to the <span className="text-blue-600 font-bold hover:underline">Terms</span> and <span className="text-blue-600 font-bold hover:underline">Privacy Policy</span>.
            </label>
          </div>

          <div className="mt-2">
            <button
              type="submit"
              disabled={loading || !agreeTerms}
              className="auth-travel-btn disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Create Account</span>
                  <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                </div>
              )}
            </button>
          </div>
        </form>

        <div className="auth-divider">OR</div>

        <div className="flex justify-center w-full">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google sign-up was unsuccessful.')}
            shape="rectangular"
            theme="outline"
            size="large"
            text="signup_with"
            width="100%"
          />
        </div>

        <div className="mt-10 pt-8 text-center sm:text-left">
          <p className="text-[15px] text-slate-500 font-medium leading-relaxed">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-bold hover:text-blue-700 transition-colors inline-flex items-center gap-1 group">
              Sign in here
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </p>
        </div>
      </div>
    </AuthTravelShell>
  );
};

export default RegisterPage;
