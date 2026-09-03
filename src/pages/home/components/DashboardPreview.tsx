import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardCards } from '@/mocks/homeData';

export default function DashboardPreview() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const navigate = useNavigate();

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    return () => el.removeEventListener('scroll', checkScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 380;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  return (
    <section id="dashboard" className="relative bg-white py-16 md:py-20 lg:py-24 overflow-hidden">
      <div className="w-full px-6 md:px-10 lg:px-16 xl:px-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-14">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-100 text-accent-700 text-xs font-medium mb-4">
              <i className="ri-dashboard-3-line"></i>
              Dashboard Preview
            </span>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-primary-900 font-bold leading-tight">
              Your personalized
              <br />
              <span className="text-secondary-500">HR command center.</span>
            </h2>
            <p className="text-foreground-500 text-sm md:text-base mt-3 max-w-md">
              Everything you need, organized and ready. Bookmark resources, track your progress, and get tailored recommendations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full border transition-all cursor-pointer ${
                canScrollLeft
                  ? 'border-foreground-300 text-foreground-600 hover:bg-background-100'
                  : 'border-background-300 text-background-400 cursor-not-allowed'
              }`}
              aria-label="Scroll left"
            >
              <i className="ri-arrow-left-s-line text-lg"></i>
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full border transition-all cursor-pointer ${
                canScrollRight
                  ? 'border-foreground-300 text-foreground-600 hover:bg-background-100'
                  : 'border-background-300 text-background-400 cursor-not-allowed'
              }`}
              aria-label="Scroll right"
            >
              <i className="ri-arrow-right-s-line text-lg"></i>
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-5 md:gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {dashboardCards.map((card) => (
            <div
              key={card.id}
              className="flex-shrink-0 w-[300px] md:w-[340px] lg:w-[360px] snap-start"
            >
              <div className="bg-background-50 rounded-xl p-5 md:p-6 border border-background-200/70 h-full">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-500"></div>
                  <span className="text-xs font-medium text-foreground-500 uppercase tracking-wider">
                    {card.title}
                  </span>
                </div>
                <p className="text-xs text-foreground-400 mb-5">{card.subtitle}</p>

                <div className="flex flex-col gap-3">
                  {card.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-lg bg-white border border-background-200/50 hover:border-accent-300/50 transition-colors cursor-pointer group"
                    >
                      <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-primary-50 text-primary-600 group-hover:bg-accent-50 group-hover:text-accent-600 transition-colors flex-shrink-0">
                        <i className={`${item.icon} text-sm md:text-base`}></i>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground-800 truncate group-hover:text-primary-700 transition-colors">
                          {item.label}
                        </p>
                        <span className="text-xs text-foreground-400">{item.type}</span>
                      </div>
                      <i className="ri-arrow-right-s-line text-foreground-300 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"></i>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <div className="flex-shrink-0 w-[300px] md:w-[340px] lg:w-[360px] snap-start">
            <div className="bg-primary-50 rounded-xl p-5 md:p-6 border border-primary-200/40 border-dashed h-full flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-accent-100 text-accent-500 mb-4">
                <i className="ri-add-line text-2xl"></i>
              </div>
              <h4 className="font-heading text-base md:text-lg font-bold text-primary-900 mb-2">
                Create your dashboard
              </h4>
              <p className="text-xs md:text-sm text-foreground-500 mb-5 max-w-[220px]">
                Sign up to personalize your workspace and save resources.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="px-5 py-2.5 rounded-full bg-accent-500 text-white text-sm font-semibold whitespace-nowrap hover:bg-accent-600 transition-colors cursor-pointer"
              >
                Get Started Free
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}