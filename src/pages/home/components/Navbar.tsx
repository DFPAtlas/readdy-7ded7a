import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { navLinks } from '@/mocks/homeData';
import { useAuth } from '@/auth/useAuth';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    if (href.startsWith('/')) {
      navigate(href);
    }
    setMobileOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background-50/95 backdrop-blur-md border-b border-background-200/70'
          : 'bg-transparent'
      }`}
    >
      <div className="w-full px-6 md:px-10 flex items-center justify-between h-16 md:h-[72px]">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className={`w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-lg transition-colors ${
            scrolled ? 'bg-primary-900' : 'bg-white/10 backdrop-blur-sm'
          }`}>
            <i className="ri-book-open-line text-lg md:text-xl text-accent-400"></i>
          </div>
          <div className="flex flex-col leading-none">
            <span
              className={`text-lg md:text-xl font-heading font-bold tracking-tight whitespace-nowrap transition-colors ${
                scrolled ? 'text-primary-900' : 'text-white'
              }`}
            >
              HR Voodoo
            </span>
            {!scrolled && (
              <span className="text-[10px] text-white/60 font-medium tracking-wide hidden md:block">
                Making HR make sense
              </span>
            )}
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                if (link.href.startsWith('/')) {
                  e.preventDefault();
                  handleNavClick(link.href);
                }
              }}
              className={`text-sm font-medium whitespace-nowrap transition-colors hover:opacity-80 ${
                scrolled ? 'text-foreground-600' : 'text-white/90'
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className={`text-sm font-medium whitespace-nowrap transition-colors hover:opacity-80 ${
                  scrolled ? 'text-foreground-500' : 'text-white/80'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/chat"
                className="px-5 py-2.5 rounded-full bg-accent-500 text-white text-sm font-semibold whitespace-nowrap hover:bg-accent-600 transition-colors"
              >
                Ask HR Voodoo
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`text-sm font-medium whitespace-nowrap transition-colors hover:opacity-80 ${
                  scrolled ? 'text-foreground-500' : 'text-white/80'
                }`}
              >
                Sign In
              </Link>
              <Link
                to="/login"
                className="px-5 py-2.5 rounded-full bg-accent-500 text-white text-sm font-semibold whitespace-nowrap hover:bg-accent-600 transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        <button
          className={`md:hidden w-10 h-10 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
            scrolled ? 'text-foreground-800' : 'text-white'
          }`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <i className={`text-xl ${mobileOpen ? 'ri-close-line' : 'ri-menu-line'}`}></i>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-background-50 border-t border-background-200/70 px-6 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                if (link.href.startsWith('/')) {
                  e.preventDefault();
                  handleNavClick(link.href);
                } else {
                  setMobileOpen(false);
                }
              }}
              className="text-sm font-medium text-foreground-700 py-2 hover:text-accent-500 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="flex items-center gap-3 pt-3 border-t border-background-200/70">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-sm font-medium text-foreground-600 hover:text-accent-500 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/chat"
                  className="px-5 py-2.5 rounded-full bg-accent-500 text-white text-sm font-semibold whitespace-nowrap hover:bg-accent-600 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Ask HR Voodoo
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-foreground-600 hover:text-accent-500 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/login"
                  className="px-5 py-2.5 rounded-full bg-accent-500 text-white text-sm font-semibold whitespace-nowrap hover:bg-accent-600 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}