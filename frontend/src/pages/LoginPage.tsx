import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import type { CredentialResponse } from '@react-oauth/google';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AuthTravelShell } from '../components/auth/AuthTravelShell';
import { GoogleButton } from '../components/auth/GoogleButton';
import { errorMessage } from '../lib/format';

const DEMO = { email: 'demo@travelexplorer.dev', password: 'explore123' };

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from || '/';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token, res.data.user);
      navigate(from, { replace: true });
    } catch (err) {
      setError(errorMessage(err, 'Sign-in failed. Check your email and password and try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async (response: CredentialResponse) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/google', { token: response.credential });
      login(res.data.token, res.data.user);
      navigate(from, { replace: true });
    } catch (err) {
      setError(errorMessage(err, 'Google sign-in failed. Try again, or use your email and password.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthTravelShell>
      <h1 className="font-display text-[2.6rem] leading-none text-iron">Sign in</h1>
      <p className="mt-3 text-[1.08rem] text-iron-2">Your saved places are where you left them.</p>

      {error && (
        <p role="alert" className="mt-6 rounded-[3px] border-[1.5px] border-madder bg-madder-wash p-3.5 font-semibold text-madder-deep">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
        <div>
          <label htmlFor="login-email" className="field-label">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            required
            className="field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="login-password" className="field-label">
            Password
          </label>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              className="field pr-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-1 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-[3px] text-iron-2 hover:text-iron"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
            >
              {showPassword ? <EyeOff size={19} aria-hidden="true" /> : <Eye size={19} aria-hidden="true" />}
            </button>
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-ink mt-1 h-12 w-full text-base">
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <GoogleButton
        text="continue_with"
        onCredential={handleGoogle}
        onError={() => setError('Google sign-in could not start. Use your email and password instead.')}
      />

      {import.meta.env.DEV && (
        <div className="mt-6 rounded-[3px] border-[1.5px] border-dashed border-rule-strong p-3.5 text-[0.95rem] text-iron-2">
          <p>
            Local sample data includes a demo account: <span className="font-semibold text-iron">{DEMO.email}</span> /{' '}
            <span className="font-semibold text-iron">{DEMO.password}</span>
          </p>
          <button
            type="button"
            className="ink-link mt-1"
            onClick={() => {
              setEmail(DEMO.email);
              setPassword(DEMO.password);
            }}
          >
            Fill in the demo account
          </button>
        </div>
      )}

      <p className="mt-8 border-t border-rule pt-6 text-[1.02rem] text-iron-2">
        New here?{' '}
        <Link to="/register" state={location.state} className="ink-link">
          Create an account
        </Link>
      </p>
    </AuthTravelShell>
  );
};

export default LoginPage;
