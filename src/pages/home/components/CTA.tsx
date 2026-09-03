import { useNavigate } from 'react-router-dom';

export default function CTA() {
  const navigate = useNavigate();

  return (
    <section className="relative w-full py-24 md:py-32 lg:py-40 overflow-hidden bg-primary-950">
      {/* Abstract glow effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full bg-primary-900/30 blur-3xl"></div>
        <div className="absolute top-[30%] right-[20%] w-[25%] h-[25%] rounded-full bg-accent-900/15 blur-2xl"></div>
      </div>

      <div className="relative z-10 w-full px-6 md:px-10 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-500/15 border border-accent-500/25 text-accent-400 text-xs md:text-sm font-medium tracking-wide mb-6 md:mb-8">
          <i className="ri-magic-line text-sm"></i>
          Ready when you are
        </div>

        <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white font-bold leading-tight max-w-3xl tracking-tight">
          Ready to transform
          <br />
          your HR experience?
        </h2>
        <p className="text-white/60 text-sm md:text-base lg:text-lg mt-4 md:mt-6 max-w-lg leading-relaxed">
          Join thousands of HR professionals who are already making sense of the workplace with HR Voodoo.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 mt-8 md:mt-10">
          <button
            onClick={() => navigate('/chat')}
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-accent-500 text-white text-sm md:text-base font-semibold whitespace-nowrap hover:bg-accent-600 transition-all cursor-pointer"
          >
            <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 flex-shrink-0">
              <i className="ri-chat-smile-3-line text-sm"></i>
            </span>
            Start Chatting Free
            <i className="ri-arrow-right-up-line text-sm group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"></i>
          </button>
          <a
            href="#categories"
            className="px-8 py-4 rounded-full border border-white/20 text-white text-sm md:text-base font-medium whitespace-nowrap hover:bg-white/10 transition-colors cursor-pointer"
          >
            Browse Resources
          </a>
        </div>
      </div>
    </section>
  );
}