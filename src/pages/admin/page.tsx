export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background-50 p-6 md:p-10 max-w-4xl mx-auto">
      <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground-950 mb-1">Platform Admin</h1>
      <p className="text-foreground-500 text-sm mb-8">Platform-wide administration tools.</p>

      <div className="bg-white border border-background-200/70 rounded-xl p-10 text-center">
        <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-2xl bg-primary-100">
          <i className="ri-shield-user-line text-2xl text-primary-600"></i>
        </div>
        <h2 className="font-heading text-lg font-bold text-foreground-950 mb-2">Coming Soon</h2>
        <p className="text-sm text-foreground-500 max-w-md mx-auto">
          Platform administration tools are under development. You&apos;ll be able to manage users, audit logs, and platform settings here.
        </p>
      </div>
    </div>
  );
}