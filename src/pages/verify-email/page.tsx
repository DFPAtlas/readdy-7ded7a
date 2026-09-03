import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';

export default function VerifyEmailPage() {
  const [email, setEmail] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user?.email) {
        setEmail(data.session.user.email);
      }
    });
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0 || !email) return;
    if (!supabase) {
      setMessage({ type: 'error', text: 'Authentication is not configured. Please connect Supabase first.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.resend({ type: 'signup', email });

    if (error) {
      setMessage({ type: 'error', text: 'Could not resend the email. Please try again.' });
    } else {
      setMessage({ type: 'success', text: 'Verification email sent! Check your inbox.' });
      setCooldown(60);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-primary-950 flex flex-col items-center justify-center px-6">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-900/40 blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent-900/20 blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-5 flex items-center justify-center rounded-2xl bg-accent-500/15">
          <i className="ri-mail-check-line text-3xl text-accent-400"></i>
        </div>

        <h1 className="font-heading text-2xl font-bold text-white mb-2">Check Your Email</h1>
        <p className="text-white/50 text-sm mb-6">
          {supabase
            ? <>We&apos;ve sent a verification link to{' '}<span className="text-white/80 font-medium">{email || 'your email'}</span>. Please click the link to verify your account.</>
            : 'Authentication is not configured yet. Please connect Supabase to enable account features.'
          }
        </p>

        {message && (
          <div
            className={`mb-6 p-3 rounded-lg text-sm font-medium ${
              message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}
            role="alert"
            aria-live="polite"
          >
            {message.text}
          </div>
        )}

        {supabase && (
          <button
            onClick={handleResend}
            disabled={loading || cooldown > 0}
            className="w-full py-3 rounded-lg bg-accent-500 text-white text-sm font-semibold hover:bg-accent-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {loading ? 'Sending...' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Verification Email'}
          </button>
        )}

        <p className="text-white/40 text-xs mt-6">
          <Link to="/login" className="text-accent-400 hover:text-accent-300 transition-colors">
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}