import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, Eye, EyeOff, Mail } from 'lucide-react';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AuthTravelShell } from '../components/auth/AuthTravelShell';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setError(message || 'Login failed. Please try again.');
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
    } catch (err: any) {
      console.error('Google Auth Login Error:', err);
      const message = err.response?.data?.message || err.message;
      setError(message || 'Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthTravelShell>
      <div className="auth-travel-card">
        <div className="mb-10">
          <Link to="/" className="inline-block mb-8 text-[var(--primary)] font-bold tracking-tight text-xl hover:opacity-80 transition-opacity">
            Tourism
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-3">
            Sign In
          </h1>
          <p className="text-[16px] font-medium text-slate-500">
            Enter your details below to access your account.
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
          <div className="flex flex-col gap-2.5">
            <label htmlFor="login-email" className="px-1 text-[13px] font-bold text-slate-700">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="auth-travel-input-icon group-focus-within:text-blue-600 transition-colors" size={20} />
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                required
                className="auth-travel-input"
                placeholder="e.g. alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between px-1">
              <label htmlFor="login-password" className="text-[13px] font-bold text-slate-700">
                Password
              </label>
              <Link
                to="/forgot"
                className="text-[13px] font-bold text-blue-600 hover:text-blue-700 transition-colors">
                Reset?
              </Link>
            </div>
            <div className="relative group">
              <Lock className="auth-travel-input-icon group-focus-within:text-blue-600 transition-colors" size={20} />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className="auth-travel-input pr-12"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <div className="mt-2 text-center">
            <button
              type="submit"
              disabled={loading}
              className="auth-travel-btn disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Sign In</span>
                  <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                </div>
              )}
            </button>
          </div>
        </form>

        <div className="auth-divider">OR</div>

        <div className="flex justify-center w-full min-h-[50px]">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google initialization failed. This may be due to an unauthorized origin (e.g., localhost) or an invalid Client ID. Please check your Google Cloud Console settings.')}
            useOneTap
            shape="rectangular"
            theme="outline"
            size="large"
            text="continue_with"
            width="100%"
          />
        </div>

        <div className="mt-10 pt-8 text-center sm:text-left">
          <p className="text-[15px] text-slate-500 font-medium leading-relaxed">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-blue-600 font-bold hover:text-blue-700 transition-colors inline-flex items-center gap-1 group">
              Create one now
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </p>
        </div>
      </div>
    </AuthTravelShell>
  );
};

export default LoginPage;
