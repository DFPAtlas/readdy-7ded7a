import { useAuth } from '@/auth/useAuth';
import { Link } from 'react-router-dom';

const ROLE_LABELS: Record<string, string> = {
  individual: 'Individual',
  employee: 'Employee',
  manager: 'Manager',
  hr_professional: 'HR Professional',
  organisation_admin: 'Organisation Admin',
  platform_admin: 'Platform Admin',
};

export default function DashboardOverview() {
  const { profile, organisationMemberships } = useAuth();

  if (!profile) {
    return (
      <div className="p-6 md:p-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-background-200 rounded"></div>
          <div className="h-4 w-72 bg-background-200 rounded"></div>
        </div>
      </div>
    );
  }

  const completionFields = [
    { label: 'Display Name', filled: !!profile.display_name },
    { label: 'Phone', filled: !!profile.phone },
    { label: 'Job Title', filled: !!profile.job_title },
    { label: 'Region', filled: !!profile.jurisdiction_region },
  ];
  const completedCount = completionFields.filter((f) => f.filled).length;
  const completionPercentage = Math.round((completedCount / completionFields.length) * 100);

  return (
    <div className="p-6 md:p-10 max-w-4xl">
      <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground-950 mb-1">
        Welcome{profile.display_name ? `, ${profile.display_name}` : ''}!
      </h1>
      <p className="text-foreground-500 text-sm mb-8">Here&apos;s your dashboard overview.</p>

      {/* Status cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-background-200/70 rounded-xl p-5">
          <p className="text-xs font-semibold text-foreground-400 uppercase tracking-wider mb-2">Role</p>
          <p className="text-foreground-950 font-semibold">{ROLE_LABELS[profile.primary_role] || profile.primary_role}</p>
        </div>
        <div className="bg-white border border-background-200/70 rounded-xl p-5">
          <p className="text-xs font-semibold text-foreground-400 uppercase tracking-wider mb-2">Account Status</p>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${profile.account_status === 'active' ? 'bg-green-500' : profile.account_status === 'pending_verification' ? 'bg-amber-500' : 'bg-red-500'}`}></span>
            <p className="text-foreground-950 font-semibold capitalize">{profile.account_status.replace(/_/g, ' ')}</p>
          </div>
        </div>
        <div className="bg-white border border-background-200/70 rounded-xl p-5">
          <p className="text-xs font-semibold text-foreground-400 uppercase tracking-wider mb-2">Email Verified</p>
          <p className={`font-semibold ${profile.account_status === 'active' ? 'text-green-600' : 'text-amber-600'}`}>
            {profile.account_status === 'active' ? 'Yes' : 'Pending'}
          </p>
        </div>
        <div className="bg-white border border-background-200/70 rounded-xl p-5">
          <p className="text-xs font-semibold text-foreground-400 uppercase tracking-wider mb-2">Jurisdiction</p>
          <p className="text-foreground-950 font-semibold">{profile.jurisdiction_country}{profile.jurisdiction_region ? `, ${profile.jurisdiction_region}` : ''}</p>
        </div>
        <div className="bg-white border border-background-200/70 rounded-xl p-5">
          <p className="text-xs font-semibold text-foreground-400 uppercase tracking-wider mb-2">Timezone</p>
          <p className="text-foreground-950 font-semibold">{profile.timezone}</p>
        </div>
        <div className="bg-white border border-background-200/70 rounded-xl p-5">
          <p className="text-xs font-semibold text-foreground-400 uppercase tracking-wider mb-2">Profile Complete</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-background-200 rounded-full overflow-hidden">
              <div className="h-full bg-accent-500 rounded-full transition-all" style={{ width: `${completionPercentage}%` }}></div>
            </div>
            <span className="text-sm font-semibold text-foreground-700">{completionPercentage}%</span>
          </div>
        </div>
      </div>

      {/* Organisation */}
      {organisationMemberships.length > 0 && (
        <div className="bg-white border border-background-200/70 rounded-xl p-5 mb-8">
          <h2 className="font-heading text-lg font-bold text-foreground-950 mb-3">Organisation</h2>
          <p className="text-sm text-foreground-600">
            You are a member of <span className="font-semibold text-foreground-900">{organisationMemberships.length}</span> organisation{organisationMemberships.length > 1 ? 's' : ''}.
          </p>
        </div>
      )}

      {/* Quick links */}
      <div className="flex flex-wrap gap-3">
        <Link
          to="/dashboard/profile"
          className="px-5 py-2.5 rounded-lg bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-colors cursor-pointer whitespace-nowrap"
        >
          Edit Profile
        </Link>
        <Link
          to="/chat"
          className="px-5 py-2.5 rounded-lg border border-background-200 text-foreground-700 text-sm font-semibold hover:bg-background-100 transition-colors cursor-pointer whitespace-nowrap"
        >
          Ask HR Voodoo
        </Link>
        {organisationMemberships.length > 0 && (
          <Link
            to="/dashboard/organisation"
            className="px-5 py-2.5 rounded-lg border border-background-200 text-foreground-700 text-sm font-semibold hover:bg-background-100 transition-colors cursor-pointer whitespace-nowrap"
          >
            View Organisation
          </Link>
        )}
      </div>

      {profile.account_status !== 'active' && (
        <div className="mt-8 p-4 rounded-xl bg-amber-50 border border-amber-200">
          <p className="text-sm text-amber-800">
            <i className="ri-information-line mr-1"></i>
            Your email is not yet verified. Please check your inbox for the verification link.
          </p>
        </div>
      )}
    </div>
  );
}