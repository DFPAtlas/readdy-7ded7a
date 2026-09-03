import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { footerLinks } from '@/mocks/homeData';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const honeypot = (formData.get('phone_alt') as string || '').trim();
    if (honeypot) {
      setStatus('success');
      setEmail('');
      return;
    }
    if (!email.trim()) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('https://readdy.ai/api/form/d96fbefpg5pqhofcuoag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ email: email.trim() }).toString(),
      });
      const text = await res.text();
      let parsed: Record<string, unknown> = {};
      try { parsed = JSON.parse(text); } catch { /* ignore parse errors */ }

      const code = parsed?.code;
      const serverMsg = (parsed?.meta as Record<string, string>)?.message || (parsed?.message as string) || (parsed?.meta as Record<string, string>)?.detail || text;

      if (res.ok && code === 'OK') {
        setStatus('success');
        setEmail('');
      } else if (!res.ok || code !== 'OK' || (typeof serverMsg === 'string' && serverMsg.toLowerCase().includes('spam'))) {
        setStatus('error');
        setErrorMsg(serverMsg || 'Something went wrong. Please try again.');
      } else {
        setStatus('error');
        setErrorMsg(serverMsg || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Network error. Please check your connection and try again.');
    }
  };

  return (
    <footer className="relative bg-primary-950 overflow-hidden">
      {/* Subtle dot pattern */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div className="w-full h-full" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, oklch(var(--accent-500)) 1px, transparent 1px), radial-gradient(circle at 80% 30%, oklch(var(--secondary-500)) 1px, transparent 1px)',
          backgroundSize: '60px 60px, 80px 80px',
        }}></div>
      </div>

      <div className="relative z-10 w-full px-6 md:px-10 lg:px-16 xl:px-24 py-14 md:py-18 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
          <div className="lg:col-span-2">
            <a href="/" className="inline-flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-primary-800">
                <i className="ri-book-open-line text-lg text-accent-400"></i>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl font-heading font-bold text-white tracking-tight">
                  HR Voodoo
                </span>
                <span className="text-[10px] text-white/40 font-medium tracking-wide">
                  Making HR make sense
                </span>
              </div>
            </a>

            <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-sm">
              Your all-in-one human resources platform for clear advice, curated resources, and personalized guidance — without the confusing jargon.
            </p>

            <form onSubmit={handleSubmit} data-readdy-form="" className="flex gap-2 mb-4">
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-4 py-2.5 rounded-lg bg-primary-900/80 text-white text-sm placeholder:text-white/30 border border-primary-800 focus:outline-none focus:border-accent-500/50 transition-colors"
              />
              <input
                type="text"
                name="phone_alt"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                readOnly
                className="hp-field"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-4 py-2.5 rounded-lg bg-accent-500 text-white text-sm font-semibold whitespace-nowrap hover:bg-accent-600 transition-colors disabled:opacity-60 cursor-pointer"
              >
                {status === 'loading' ? (
                  <i className="ri-loader-4-line animate-spin"></i>
                ) : (
                  <i className="ri-send-plane-fill"></i>
                )}
              </button>
            </form>

            {status === 'success' && (
              <p className="text-accent-400 text-xs">Thanks for subscribing! Check your inbox.</p>
            )}
            {status === 'error' && (
              <p className="text-red-400 text-xs">{errorMsg}</p>
            )}

            <p className="font-heading text-white/80 text-lg md:text-xl font-bold mt-5 leading-snug">
              HR wisdom,
              <br />
              <span className="text-accent-400">at your fingertips.</span>
            </p>
          </div>

          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-8">
            {Object.values(footerLinks).map((section) => (
              <div key={section.title}>
                <h4 className="text-white text-sm font-semibold mb-4">{section.title}</h4>
                <ul className="flex flex-col gap-2.5">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        onClick={(e) => {
                          if (link.href.startsWith('/')) {
                            e.preventDefault();
                            navigate(link.href);
                          }
                        }}
                        className="text-white/50 text-sm hover:text-accent-400 transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 md:mt-16 pt-6 md:pt-8 border-t border-primary-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            &copy; {new Date().getFullYear()} HR Voodoo. All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            {['ri-linkedin-fill', 'ri-twitter-x-fill', 'ri-instagram-line', 'ri-youtube-fill'].map((icon) => (
              <a
                key={icon}
                href="#"
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-primary-800 text-white/40 hover:text-accent-400 hover:border-accent-500/30 transition-colors"
                rel="nofollow"
              >
                <i className={`${icon} text-sm`}></i>
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 text-white/30 text-xs">
            <button onClick={() => navigate('/legal')} className="hover:text-white/60 transition-colors cursor-pointer">
              Privacy Policy
            </button>
            <span>·</span>
            <button onClick={() => navigate('/legal')} className="hover:text-white/60 transition-colors cursor-pointer">
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}