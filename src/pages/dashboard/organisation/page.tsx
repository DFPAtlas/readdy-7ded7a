import { useAuth } from '@/auth/useAuth';

export default function OrganisationPage() {
  const { organisationMemberships } = useAuth();

  return (
    <div className="p-6 md:p-10 max-w-4xl">
      <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground-950 mb-1">Organisation</h1>
      <p className="text-foreground-500 text-sm mb-8">Your organisation memberships and settings.</p>

      {organisationMemberships.length === 0 ? (
        <div className="bg-white border border-background-200/70 rounded-xl p-10 text-center">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-2xl bg-secondary-100">
            <i className="ri-building-line text-2xl text-secondary-600"></i>
          </div>
          <h2 className="font-heading text-lg font-bold text-foreground-950 mb-2">No Organisation</h2>
          <p className="text-sm text-foreground-500 max-w-md mx-auto">
            You&apos;re not a member of any organisation yet. When you join or create one, it will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {organisationMemberships.map((m) => (
            <div key={m.id} className="bg-white border border-background-200/70 rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground-900 font-semibold">Organisation #{m.organisation_id.slice(0, 8)}</p>
                  <p className="text-sm text-foreground-500 capitalize">{m.membership_role} &middot; {m.membership_status}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-700 capitalize">{m.membership_role}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}