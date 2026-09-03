import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setError('Authentication is not configured. Please connect Supabase first.');
      return;
    }

    const handleCallback = async () => {
      const { data, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !data.session) {
        setError('Could not complete authentication. Please try signing in again.');
        return;
      }

      const intendedPath = sessionStorage.getItem('auth_intended_path');
      sessionStorage.removeItem('auth_intended_path');

      const safePath =
        intendedPath && !intendedPath.startsWith('http') && !intendedPath.includes('//')
          ? intendedPath
          : '/dashboard';

      navigate(safePath, { replace: true });
    };

    handleCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-primary-950 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-5 flex items-center justify-center rounded-2xl bg-red-500/15">
            <i className="ri-error-warning-line text-3xl text-red-400"></i>
          </div>
          <h1 className="font-heading text-2xl font-bold text-white mb-2">Authentication Failed</h1>
          <p className="text-white/50 text-sm mb-6">{error}</p>
          <a
            href="/login"
            className="inline-block w-full py-3 rounded-lg bg-accent-500 text-white text-sm font-semibold hover:bg-accent-600 transition-colors"
          >
            Go to Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white/50 text-sm">Completing authentication...</p>
      </div>
    </div>
  );
}