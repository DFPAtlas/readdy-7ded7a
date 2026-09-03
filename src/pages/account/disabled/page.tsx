import { Link } from 'react-router-dom';

export default function AccountDisabledPage() {
  return (
    <div className="min-h-screen bg-primary-950 flex flex-col items-center justify-center px-6">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-red-900/20 blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-5 flex items-center justify-center rounded-2xl bg-red-500/15">
          <i className="ri-forbid-line text-3xl text-red-400"></i>
        </div>
        <h1 className="font-heading text-2xl font-bold text-white mb-2">Account Disabled</h1>
        <p className="text-white/50 text-sm mb-6">
          This account has been disabled and is no longer accessible.
          If you believe this is an error, please contact our support team for assistance.
        </p>
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
          <p className="text-white/60 text-xs">
            <i className="ri-mail-line mr-1"></i> support@hrvoodoo.com
          </p>
        </div>
        <Link
          to="/login"
          className="inline-block w-full py-3 rounded-lg border border-white/10 text-white/70 text-sm font-semibold hover:bg-white/5 transition-colors whitespace-nowrap"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}