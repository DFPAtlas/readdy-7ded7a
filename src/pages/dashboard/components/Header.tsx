import { Link } from 'react-router-dom';
import { useAuth } from '@/auth/useAuth';

export default function DashboardHeader() {
  const { profile } = useAuth();

  const initials = profile?.display_name
    ? profile.display_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : (profile?.email ?? '').slice(0, 2).toUpperCase();

  return (
    <header className="lg:hidden h-14 bg-background-50 border-b border-background-200/70 flex items-center justify-between px-5 pl-14">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-7 h-7 flex items-center justify-center rounded-md bg-primary-900">
          <i className="ri-book-open-line text-sm text-accent-400"></i>
        </div>
        <span className="text-sm font-heading font-bold text-primary-900">HR Voodoo</span>
      </Link>

      <div className="flex items-center gap-2">
        <div className="w-7 h-7 flex items-center justify-center rounded-full bg-accent-500/15 text-accent-600 text-[10px] font-bold">
          {initials}
        </div>
      </div>
    </header>
  );
}