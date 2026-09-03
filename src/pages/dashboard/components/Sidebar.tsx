import { useState, useEffect, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/useAuth';
import type { UserRole } from '@/lib/supabase/types';

interface NavItem {
  label: string;
  icon: string;
  path: string;
  roles: UserRole[];
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Overview', icon: 'ri-dashboard-line', path: '/dashboard', roles: [] },
  { label: 'Ask HR Voodoo', icon: 'ri-psychotherapy-line', path: '/chat', roles: [] },
  { label: 'Saved Advice', icon: 'ri-bookmark-line', path: '/dashboard', roles: [] },
  { label: 'Resources', icon: 'ri-folder-line', path: '/dashboard', roles: [] },
  { label: 'Organisation', icon: 'ri-building-line', path: '/dashboard/organisation', roles: ['organisation_admin', 'platform_admin', 'manager', 'hr_professional'] },
  { label: 'Profile', icon: 'ri-user-settings-line', path: '/dashboard/profile', roles: [] },
  { label: 'Security', icon: 'ri-shield-check-line', path: '/dashboard/security', roles: [] },
  { label: 'Settings', icon: 'ri-settings-3-line', path: '/dashboard/settings', roles: [] },
];

const ADMIN_ITEMS: NavItem[] = [
  { label: 'Admin Panel', icon: 'ri-admin-line', path: '/admin', roles: ['platform_admin'] },
];

function filterNavItems(items: NavItem[], role: UserRole | null): NavItem[] {
  if (!role) return [];
  return items.filter((item) => item.roles.length === 0 || item.roles.includes(role));
}

export default function Sidebar() {
  const { role, profile, organisationMemberships, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const visibleItems = filterNavItems(NAV_ITEMS, role);
  const adminItems = filterNavItems(ADMIN_ITEMS, role);
  const orgName = organisationMemberships.length > 0 ? 'My Org' : null;
  const initials = profile?.display_name
    ? profile.display_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : (profile?.email ?? '').slice(0, 2).toUpperCase();

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 border-b border-primary-800/50">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-800">
            <i className="ri-book-open-line text-base text-accent-400"></i>
          </div>
          <span className="text-base font-heading font-bold text-white tracking-tight whitespace-nowrap">HR Voodoo</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {visibleItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-accent-500/15 text-accent-400'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <i className={`${item.icon} text-lg`}></i>
                {item.label}
              </Link>
            );
          })}
        </div>

        {adminItems.length > 0 && (
          <div className="mt-6 pt-5 border-t border-primary-800/50">
            <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-2">Admin</p>
            {adminItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-accent-500/15 text-accent-400'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <i className={`${item.icon} text-lg`}></i>
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      <div className="px-3 py-4 border-t border-primary-800/50">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-accent-500/20 text-accent-400 text-xs font-bold">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{profile?.display_name || profile?.full_name || 'User'}</p>
            {orgName && <p className="text-xs text-white/40 truncate">{orgName}</p>}
          </div>
        </div>
        <button
          onClick={() => { signOut(); navigate('/'); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 mt-2 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-logout-box-line text-lg"></i>
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-primary-950 border-r border-primary-800/50 z-40">
        {sidebarContent}
      </aside>

      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed top-3 left-3 z-50 w-9 h-9 flex items-center justify-center rounded-lg bg-primary-950 text-white cursor-pointer"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        <i className={`text-lg ${mobileOpen ? 'ri-close-line' : 'ri-menu-line'}`}></i>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)}></div>
          <div className="relative w-64 h-full bg-primary-950 border-r border-primary-800/50 z-50 animate-slide-in">
            {sidebarContent}
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        .animate-slide-in { animation: slideIn 0.2s ease-out; }
      `}</style>
    </>
  );
}