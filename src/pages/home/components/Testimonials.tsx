import { useState } from 'react';
import { testimonials } from '@/mocks/homeData';

export default function Testimonials() {
  const [active, setActive] = useState(0);

  const prev = () => setActive((p) => (p === 0 ? testimonials.length - 1 : p - 1));
  const next = () => setActive((p) => (p === testimonials.length - 1 ? 0 : p + 1));

  const current = testimonials[active];

  return (
    <section id="about" className="relative bg-primary-950 py-16 md:py-20 lg:py-24 overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, oklch(var(--accent-500)) 1px, transparent 0)',
        backgroundSize: '50px 50px',
      }}></div>

      <div className="relative z-10 w-full px-6 md:px-10 lg:px-16 xl:px-24">
        <div className="flex flex-col lg:flex-row gap-10 md:gap-14 lg:gap-20 items-center">
          <div className="w-full lg:w-2/5">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] lg:aspect-[3/4] bg-primary-900 shadow-2xl">
              <img
                src={current.image}
                alt={current.name}
                title={`${current.name} — ${current.role}`}
                className="w-full h-full object-cover object-top transition-opacity duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-950/60 via-transparent to-transparent"></div>
            </div>
          </div>

          <div className="w-full lg:w-3/5">
            <span className="inline-flex items-center gap-1.5 text-accent-400 text-xs md:text-sm font-medium tracking-wide mb-3">
              <i className="ri-heart-3-line text-xs"></i>
              What our users say
            </span>

            <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-white font-bold leading-tight mt-3 mb-8 md:mb-10 lg:mb-12">
              Trusted by HR leaders
              <br />
              <span className="text-white/50 font-normal">across industries.</span>
            </h2>

            <blockquote className="relative mb-8 md:mb-10">
              <i className="ri-double-quotes-l text-3xl md:text-4xl text-accent-500/40 absolute -top-2 -left-1"></i>
              <p className="text-white/80 text-sm md:text-base lg:text-lg leading-relaxed pl-8 md:pl-10">
                {current.quote}
              </p>
            </blockquote>

            <div className="mb-8 md:mb-10">
              <p className="font-heading text-base md:text-lg font-bold text-white">
                — {current.name}
              </p>
              <p className="text-xs md:text-sm text-white/50 mt-1">{current.role}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={prev}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-white/20 text-white/60 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                aria-label="Previous testimonial"
              >
                <i className="ri-arrow-left-line"></i>
              </button>
              <button
                onClick={next}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-accent-500 text-white hover:bg-accent-600 transition-colors cursor-pointer"
                aria-label="Next testimonial"
              >
                <i className="ri-arrow-right-line"></i>
              </button>

              <div className="flex items-center gap-2 ml-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActive(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      idx === active
                        ? 'bg-accent-500 w-6'
                        : 'bg-white/25 hover:bg-white/40 w-2'
                    }`}
                    aria-label={`Go to testimonial ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}