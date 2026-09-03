import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative w-full min-h-[100dvh] overflow-hidden bg-primary-950">
      {/* Abstract background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-primary-900/40 blur-3xl"></div>
        <div className="absolute top-[40%] -left-[15%] w-[50%] h-[50%] rounded-full bg-secondary-900/30 blur-3xl"></div>
        <div className="absolute bottom-[10%] right-[20%] w-[30%] h-[30%] rounded-full bg-accent-900/20 blur-3xl"></div>
        <div className="absolute top-[20%] right-[30%] w-2 h-2 rounded-full bg-accent-400/60"></div>
        <div className="absolute top-[60%] right-[15%] w-1.5 h-1.5 rounded-full bg-accent-400/40"></div>
        <div className="absolute bottom-[30%] left-[40%] w-1 h-1 rounded-full bg-accent-400/50"></div>
      </div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, oklch(var(--accent-500)) 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }}></div>

      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <div className="w-full px-6 md:px-10 lg:px-16 xl:px-24 pt-24 pb-20 flex flex-col items-center text-center">

          {/* Big proud logo */}
          <div className="mb-6 md:mb-8">
            <img
              src="https://public.readdy.ai/ai/img_res/af111a80-74f2-4632-a4df-c57e3709d54a.png"
              alt="HR Voodoo"
              className="w-[280px] h-[280px] md:w-[360px] md:h-[360px] lg:w-[420px] lg:h-[420px] object-contain drop-shadow-2xl"
              style={{ filter: 'drop-shadow(0 0 60px oklch(var(--accent-500) / 0.2)) drop-shadow(0 0 120px oklch(var(--secondary-500) / 0.15))' }}
            />
          </div>

          {/* Headline */}
          <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl xl:text-7xl text-white font-bold leading-tight md:leading-[1.1] lg:leading-[1.1] mb-6 md:mb-8">
            Ready for some
            <br />
            <span className="text-accent-400">HR magic?</span>
          </h1>

          {/* Subheadline */}
          <p className="text-white/70 text-base md:text-lg lg:text-xl leading-relaxed max-w-xl mb-8 md:mb-10">
            Ask questions, get guidance, and make sense of the workplace — all without the HR jargon.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4">
            <button
              onClick={() => navigate('/chat')}
              className="px-7 py-3.5 rounded-full bg-accent-500 text-white text-sm md:text-base font-semibold whitespace-nowrap hover:bg-accent-600 transition-colors cursor-pointer flex items-center gap-2"
            >
              <i className="ri-chat-smile-3-line text-lg"></i>
              Ask HR Voodoo
            </button>
            <a
              href="#categories"
              className="px-7 py-3.5 rounded-full border border-white/25 text-white text-sm md:text-base font-medium whitespace-nowrap hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-2"
            >
              <i className="ri-compass-3-line text-lg"></i>
              Explore Resources
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 z-10">
        <div className="flex flex-col items-center gap-2 text-white/40 text-xs">
          <span>Scroll to explore</span>
          <i className="ri-arrow-down-line animate-bounce text-sm"></i>
        </div>
      </div>
    </section>
  );
}