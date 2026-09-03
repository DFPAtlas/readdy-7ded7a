import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/auth/useAuth';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await resetPassword(email);
    setLoading(false);

    setSent(true);

    if (result.error) {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-primary-950 flex flex-col items-center justify-center px-6">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-900/40 blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent-900/20 blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
        <div className="w-16 h-16 mx-auto mb-5 flex items-center justify-center rounded-2xl bg-accent-500/15">
          <i className="ri-key-2-line text-3xl text-accent-400"></i>
        </div>

        <h1 className="font-heading text-2xl font-bold text-white text-center mb-2">Reset Password</h1>
        <p className="text-white/50 text-sm text-center mb-6">
          {sent
            ? 'If an account with that email exists, we&apos;ve sent a password reset link.'
            : 'Enter your email and we&apos;ll send you a reset link.'}
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/20" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white/70 text-sm font-medium mb-1.5">Email</label>
            <div className="relative">
              <i className="ri-mail-line absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-lg"></i>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full pl-11 pr-4 py-3 rounded-lg bg-primary-900/50 border border-primary-800 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-accent-500/50 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-accent-500 text-white text-sm font-semibold hover:bg-accent-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="text-white/40 text-xs text-center mt-6">
          <Link to="/login" className="text-accent-400 hover:text-accent-300 transition-colors">
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}