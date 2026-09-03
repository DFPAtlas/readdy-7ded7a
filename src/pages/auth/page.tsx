import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/auth/useAuth';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, signInWithOAuth } = useAuth();

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Signup form
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const intendedPath = (location.state as { from?: string })?.from || '/dashboard';

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    const result = await signIn(loginEmail, loginPassword);
    setLoginLoading(false);

    if (result.error) {
      setLoginError(result.error);
      return;
    }

    navigate(intendedPath, { replace: true });
  };

  const validateSignup = (): boolean => {
    const errors: Record<string, string> = {};

    if (!signupName.trim()) errors.name = 'Full name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupEmail)) errors.email = 'Please enter a valid email.';
    if (signupPassword.length < 10) errors.password = 'Password must be at least 10 characters.';
    if (!/[A-Z]/.test(signupPassword)) errors.password = 'Password must contain an uppercase letter.';
    if (!/[a-z]/.test(signupPassword)) errors.password = 'Password must contain a lowercase letter.';
    if (!/[0-9]/.test(signupPassword)) errors.password = 'Password must contain a number.';
    if (signupPassword !== signupConfirmPassword) errors.confirmPassword = 'Passwords do not match.';
    if (!termsAccepted) errors.terms = 'You must accept the Terms of Service.';
    if (!privacyAccepted) errors.privacy = 'You must accept the Privacy Policy.';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignup()) return;

    setSignupLoading(true);
    setSignupError(null);

    const result = await signUp(signupEmail, signupPassword, signupName.trim(), marketingConsent);
    setSignupLoading(false);

    if (result.error) {
      setSignupError(result.error);
      return;
    }

    if (result.needsVerification) {
      setSignupSuccess(true);
    } else {
      navigate(intendedPath, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-primary-950 flex flex-col">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-900/40 blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent-900/20 blur-3xl"></div>
      </div>

      <header className="relative z-10 w-full px-6 md:px-10 py-5">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-primary-800">
            <i className="ri-book-open-line text-lg text-accent-400"></i>
          </div>
          <span className="text-lg font-heading font-bold text-white tracking-tight">HR Voodoo</span>
        </Link>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          {/* Signup success */}
          {signupSuccess ? (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-5 flex items-center justify-center rounded-2xl bg-accent-500/15">
                <i className="ri-mail-send-line text-3xl text-accent-400"></i>
              </div>
              <h1 className="font-heading text-2xl font-bold text-white mb-2">Verify Your Email</h1>
              <p className="text-white/50 text-sm mb-6">
                We&apos;ve sent a verification link to <span className="text-white/80 font-medium">{signupEmail}</span>.
                Please check your inbox and click the link to activate your account.
              </p>
              <Link
                to="/verify-email"
                className="inline-block w-full py-3 rounded-lg bg-accent-500 text-white text-sm font-semibold hover:bg-accent-600 transition-colors whitespace-nowrap"
              >
                Go to Verification Page
              </Link>
              <p className="text-white/40 text-xs mt-5">
                <button onClick={() => setSignupSuccess(false)} className="text-accent-400 hover:text-accent-300 transition-colors cursor-pointer">
                  Create a different account
                </button>
              </p>
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8">
              {/* Tab switcher */}
              <div className="flex items-center gap-1 bg-primary-900/50 rounded-full p-1 mb-8">
                <button
                  onClick={() => { setMode('login'); setLoginError(null); setSignupError(null); }}
                  className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                    mode === 'login' ? 'bg-accent-500 text-white' : 'text-white/60 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setMode('signup'); setLoginError(null); setSignupError(null); setValidationErrors({}); }}
                  className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                    mode === 'signup' ? 'bg-accent-500 text-white' : 'text-white/60 hover:text-white'
                  }`}
                >
                  Create Account
                </button>
              </div>

              <h1 className="font-heading text-2xl md:text-3xl font-bold text-white mb-2">
                {mode === 'login' ? 'Welcome back' : 'Join HR Voodoo'}
              </h1>
              <p className="text-white/50 text-sm mb-6">
                {mode === 'login'
                  ? 'Sign in to access your HR dashboard.'
                  : 'Start getting clear HR guidance in minutes.'}
              </p>

              {/* Login form */}
              {mode === 'login' && (
                <form onSubmit={handleSignIn} className="space-y-4">
                  {loginError && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium" role="alert" aria-live="polite">
                      {loginError}
                    </div>
                  )}

                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-1.5">Email</label>
                    <div className="relative">
                      <i className="ri-mail-line absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-lg"></i>
                      <input
                        type="email"
                        name="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="you@company.com"
                        required
                        className="w-full pl-11 pr-4 py-3 rounded-lg bg-primary-900/50 border border-primary-800 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-accent-500/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-1.5">Password</label>
                    <div className="relative">
                      <i className="ri-lock-line absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-lg"></i>
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Your password"
                        required
                        className="w-full pl-11 pr-11 py-3 rounded-lg bg-primary-900/50 border border-primary-800 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-accent-500/50 transition-colors"
                        aria-label="Password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors cursor-pointer"
                        aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                      >
                        <i className={`text-lg ${showLoginPassword ? 'ri-eye-off-line' : 'ri-eye-line'}`}></i>
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Link to="/forgot-password" className="text-xs text-accent-400 hover:text-accent-300 transition-colors">
                      Forgot password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full py-3 rounded-lg bg-accent-500 text-white text-sm font-semibold hover:bg-accent-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    {loginLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                    {loginLoading ? 'Signing in...' : 'Sign In'}
                  </button>
                </form>
              )}

              {/* Signup form */}
              {mode === 'signup' && (
                <form onSubmit={handleSignUp} className="space-y-4">
                  {signupError && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium" role="alert" aria-live="polite">
                      {signupError}
                    </div>
                  )}

                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-1.5">Full Name</label>
                    <div className="relative">
                      <i className="ri-user-line absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-lg"></i>
                      <input
                        type="text"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        placeholder="Jane Doe"
                        required
                        className="w-full pl-11 pr-4 py-3 rounded-lg bg-primary-900/50 border border-primary-800 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-accent-500/50 transition-colors"
                      />
                    </div>
                    {validationErrors.name && <p className="text-red-400 text-xs mt-1">{validationErrors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-1.5">Email</label>
                    <div className="relative">
                      <i className="ri-mail-line absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-lg"></i>
                      <input
                        type="email"
                        name="email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="you@company.com"
                        required
                        className="w-full pl-11 pr-4 py-3 rounded-lg bg-primary-900/50 border border-primary-800 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-accent-500/50 transition-colors"
                      />
                    </div>
                    {validationErrors.email && <p className="text-red-400 text-xs mt-1">{validationErrors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-1.5">Password</label>
                    <div className="relative">
                      <i className="ri-lock-line absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-lg"></i>
                      <input
                        type={showSignupPassword ? 'text' : 'password'}
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="Min 10 characters"
                        className="w-full pl-11 pr-11 py-3 rounded-lg bg-primary-900/50 border border-primary-800 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-accent-500/50 transition-colors"
                        aria-label="Password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors cursor-pointer"
                        aria-label={showSignupPassword ? 'Hide password' : 'Show password'}
                      >
                        <i className={`text-lg ${showSignupPassword ? 'ri-eye-off-line' : 'ri-eye-line'}`}></i>
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
                        type={showSignupPassword ? 'text' : 'password'}
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        placeholder="Repeat your password"
                        className="w-full pl-11 pr-4 py-3 rounded-lg bg-primary-900/50 border border-primary-800 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-accent-500/50 transition-colors"
                        aria-label="Confirm password"
                      />
                    </div>
                    {validationErrors.confirmPassword && <p className="text-red-400 text-xs mt-1">{validationErrors.confirmPassword}</p>}
                  </div>

                  <div className="space-y-2 pt-1">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded border-primary-800 bg-primary-900/50 text-accent-500 focus:ring-accent-500/30"
                      />
                      <span className="text-white/50 text-xs leading-relaxed">
                        I accept the{' '}
                        <Link to="/legal" className="text-accent-400 hover:text-accent-300 transition-colors">Terms of Service</Link>
                      </span>
                    </label>
                    {validationErrors.terms && <p className="text-red-400 text-xs ml-6">{validationErrors.terms}</p>}

                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacyAccepted}
                        onChange={(e) => setPrivacyAccepted(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded border-primary-800 bg-primary-900/50 text-accent-500 focus:ring-accent-500/30"
                      />
                      <span className="text-white/50 text-xs leading-relaxed">
                        I accept the{' '}
                        <Link to="/legal" className="text-accent-400 hover:text-accent-300 transition-colors">Privacy Policy</Link>
                      </span>
                    </label>
                    {validationErrors.privacy && <p className="text-red-400 text-xs ml-6">{validationErrors.privacy}</p>}

                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={marketingConsent}
                        onChange={(e) => setMarketingConsent(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded border-primary-800 bg-primary-900/50 text-accent-500 focus:ring-accent-500/30"
                      />
                      <span className="text-white/50 text-xs leading-relaxed">
                        Send me tips, guides, and product updates (optional)
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={signupLoading}
                    className="w-full py-3 rounded-lg bg-accent-500 text-white text-sm font-semibold hover:bg-accent-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    {signupLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                    {signupLoading ? 'Creating account...' : 'Create Account'}
                  </button>
                </form>
              )}

              {/* OAuth */}
              <div className="mt-6 pt-5 border-t border-white/10">
                <p className="text-white/40 text-xs text-center mb-4">Or continue with</p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => signInWithOAuth('google')}
                    className="flex-1 py-2.5 rounded-lg bg-primary-900/50 border border-primary-800 text-white/70 text-sm font-medium hover:bg-primary-900 transition-colors cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <i className="ri-google-fill text-lg"></i>
                    Google
                  </button>
                  <button
                    type="button"
                    onClick={() => signInWithOAuth('azure')}
                    className="flex-1 py-2.5 rounded-lg bg-primary-900/50 border border-primary-800 text-white/70 text-sm font-medium hover:bg-primary-900 transition-colors cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <i className="ri-microsoft-fill text-lg"></i>
                    Microsoft
                  </button>
                </div>
              </div>
            </div>
          )}

          <p className="text-center text-white/40 text-xs mt-6">
            {mode === 'login' ? (
              <>
                New here?{' '}
                <button onClick={() => setMode('signup')} className="text-accent-400 hover:text-accent-300 transition-colors cursor-pointer">
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button onClick={() => setMode('login')} className="text-accent-400 hover:text-accent-300 transition-colors cursor-pointer">
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </main>
    </div>
  );
}