import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [hasSession, setHasSession] = useState<boolean | null>(null);

  useEffect(() => {
    if (!supabase) {
      setHasSession(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setHasSession(!!data.session);
    });
  }, []);

  const validate = () => {
    const errors: Record<string, string> = {};
    if (password.length < 10) errors.password = 'Password must be at least 10 characters.';
    if (!/[A-Z]/.test(password)) errors.password = 'Password must contain an uppercase letter.';
    if (!/[a-z]/.test(password)) errors.password = 'Password must contain a lowercase letter.';
    if (!/[0-9]/.test(password)) errors.password = 'Password must contain a number.';
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match.';
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setMessage({ type: 'error', text: 'Authentication is not configured. Please connect Supabase first.' });
      return;
    }

    const errors = validate();
    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage({ type: 'error', text: 'Could not reset password. The link may have expired. Please request a new one.' });
    } else {
      setMessage({ type: 'success', text: 'Password reset successfully! Redirecting...' });
      setTimeout(() => navigate('/login'), 1500);
    }
    setLoading(false);
  };

  if (hasSession === null) {
    return (
      <div className="min-h-screen bg-primary-950 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!supabase || !hasSession) {
    return (
      <div className="min-h-screen bg-primary-950 flex flex-col items-center justify-center px-6">
        <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-5 flex items-center justify-center rounded-2xl bg-amber-500/15">
            <i className="ri-error-warning-line text-3xl text-amber-400"></i>
          </div>
          <h1 className="font-heading text-2xl font-bold text-white mb-2">Invalid Link</h1>
          <p className="text-white/50 text-sm mb-6">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <a href="/forgot-password" className="inline-block w-full py-3 rounded-lg bg-accent-500 text-white text-sm font-semibold hover:bg-accent-600 transition-colors">
            Request New Link
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-950 flex flex-col items-center justify-center px-6">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-900/40 blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent-900/20 blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
        <div className="w-16 h-16 mx-auto mb-5 flex items-center justify-center rounded-2xl bg-accent-500/15">
          <i className="ri-lock-password-line text-3xl text-accent-400"></i>
        </div>

        <h1 className="font-heading text-2xl font-bold text-white text-center mb-2">Set New Password</h1>
        <p className="text-white/50 text-sm text-center mb-6">Choose a strong new password for your account.</p>

        {message && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm font-medium ${
              message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}
            role="alert"
            aria-live="polite"
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white/70 text-sm font-medium mb-1.5">New Password</label>
            <div className="relative">
              <i className="ri-lock-line absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-lg"></i>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-11 py-3 rounded-lg bg-primary-900/50 border border-primary-800 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-accent-500/50 transition-colors"
                aria-label="New password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <i className={`text-lg ${showPassword ? 'ri-eye-off-line' : 'ri-eye-line'}`}></i>
              </button>
            </div>
            {validationErrors.password && <p className="text-red-400 text-xs mt-1">{validationErrors.password}</p>}
            <p className="text-white/30 text-xs mt-1">Min 10 characters with uppercase, lowercase, and numbers.</p>
          </div>

          <div>
            <label className="block text-white/70 text-sm font-medium mb-1.5">Confirm Password</label>
            <div className="relative">
              <i className="ri-lock-line absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-lg"></i>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-lg bg-primary-900/50 border border-primary-800 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-accent-500/50 transition-colors"
                aria-label="Confirm new password"
              />
            </div>
            {validationErrors.confirmPassword && <p className="text-red-400 text-xs mt-1">{validationErrors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-accent-500 text-white text-sm font-semibold hover:bg-accent-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}