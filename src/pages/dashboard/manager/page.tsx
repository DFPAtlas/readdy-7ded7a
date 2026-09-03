export default function ManagerPage() {
  return (
    <div className="p-6 md:p-10 max-w-4xl">
      <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground-950 mb-1">Manager Dashboard</h1>
      <p className="text-foreground-500 text-sm mb-8">People management tools and team insights.</p>

      <div className="bg-white border border-background-200/70 rounded-xl p-10 text-center">
        <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-2xl bg-secondary-100">
          <i className="ri-team-line text-2xl text-secondary-600"></i>
        </div>
        <h2 className="font-heading text-lg font-bold text-foreground-950 mb-2">Coming Soon</h2>
        <p className="text-sm text-foreground-500 max-w-md mx-auto">
          Team management features are being built. You&apos;ll be able to manage your team, track requests, and generate reports here.
        </p>
      </div>
    </div>
  );
}