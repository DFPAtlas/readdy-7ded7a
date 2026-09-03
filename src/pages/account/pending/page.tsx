import { Link } from 'react-router-dom';

export default function AccountPendingPage() {
  return (
    <div className="min-h-screen bg-primary-950 flex flex-col items-center justify-center px-6">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-900/40 blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-5 flex items-center justify-center rounded-2xl bg-amber-500/15">
          <i className="ri-hourglass-line text-3xl text-amber-400"></i>
        </div>
        <h1 className="font-heading text-2xl font-bold text-white mb-2">Verification Pending</h1>
        <p className="text-white/50 text-sm mb-6">
          Your email address hasn&apos;t been verified yet. Please check your inbox for the verification link.
          Once verified, you&apos;ll have full access to your account.
        </p>
        <Link
          to="/verify-email"
          className="inline-block w-full py-3 rounded-lg bg-accent-500 text-white text-sm font-semibold hover:bg-accent-600 transition-colors whitespace-nowrap"
        >
          Resend Verification
        </Link>
        <p className="text-white/40 text-xs mt-5">
          <Link to="/login" className="text-accent-400 hover:text-accent-300 transition-colors">Back to Sign In</Link>
        </p>
      </div>
    </div>
  );
}