import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import type { CredentialResponse } from '@react-oauth/google';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AuthTravelShell } from '../components/auth/AuthTravelShell';
import { GoogleButton } from '../components/auth/GoogleButton';
import { errorMessage } from '../lib/format';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', city: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from || '/';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) {
      setError('Choose a password of at least 6 characters.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/register', form);
      login(res.data.token, res.data.user);
      navigate(from, { replace: true });
    } catch (err) {
      setError(errorMessage(err, 'Your account could not be created. Try again.'));
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
      setError(errorMessage(err, 'Google sign-up failed. Try again, or use the form.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthTravelShell>
      <h1 className="font-display text-[2.6rem] leading-none text-iron">Join</h1>
      <p className="mt-3 text-[1.08rem] text-iron-2">Save places, write reviews, and plan visits with other travelers.</p>

      {error && (
        <p role="alert" className="mt-6 rounded-[3px] border-[1.5px] border-madder bg-madder-wash p-3.5 font-semibold text-madder-deep">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="reg-name" className="field-label">
              Name
            </label>
            <input id="reg-name" autoComplete="name" required className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label htmlFor="reg-city" className="field-label">
              Home city <span className="font-normal text-iron-3">(optional)</span>
            </label>
            <input id="reg-city" autoComplete="address-level2" className="field" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          </div>
        </div>
        <div>
          <label htmlFor="reg-email" className="field-label">
            Email
          </label>
          <input id="reg-email" type="email" autoComplete="email" required className="field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label htmlFor="reg-password" className="field-label">
            Password
          </label>
          <div className="relative">
            <input
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              minLength={6}
              className="field pr-12"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              aria-describedby="reg-password-hint"
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
          <p id="reg-password-hint" className="mt-1.5 text-[0.95rem] text-iron-3">
            At least 6 characters.
          </p>
        </div>
        <button type="submit" disabled={loading} className="btn-ink mt-1 h-12 w-full text-base">
          {loading ? 'Creating your account…' : 'Create account'}
        </button>
      </form>

      <GoogleButton
        text="signup_with"
        onCredential={handleGoogle}
        onError={() => setError('Google sign-up could not start. Use the form instead.')}
      />

      <p className="mt-8 border-t border-rule pt-6 text-[1.02rem] text-iron-2">
        Already have an account?{' '}
        <Link to="/login" state={location.state} className="ink-link">
          Sign in
        </Link>
      </p>
    </AuthTravelShell>
  );
};

export default RegisterPage;
