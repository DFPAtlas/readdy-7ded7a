import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pricingPlans } from '@/mocks/homeData';

function PricingNavbar() {
  const navigate = useNavigate();
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background-50/95 backdrop-blur-md border-b border-background-200/70">
      <div className="w-full px-6 md:px-10 flex items-center justify-between h-16 md:h-[72px]">
        <a href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-primary-900">
            <i className="ri-book-open-line text-lg text-accent-400"></i>
          </div>
          <span className="text-lg font-heading font-bold text-primary-900 tracking-tight">HR Voodoo</span>
        </a>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/login')} className="text-sm font-medium text-foreground-600 hover:text-accent-500 transition-colors cursor-pointer">
            Sign In
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-5 py-2.5 rounded-full bg-accent-500 text-white text-sm font-semibold whitespace-nowrap hover:bg-accent-600 transition-colors cursor-pointer"
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}

function PricingFooter() {
  const navigate = useNavigate();
  return (
    <footer className="bg-primary-950 py-10 px-6 md:px-10">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 flex items-center justify-center rounded bg-primary-800">
            <i className="ri-book-open-line text-sm text-accent-400"></i>
          </div>
          <span className="text-sm font-heading font-bold text-white/60">HR Voodoo</span>
        </div>
        <div className="flex items-center gap-4 text-white/40 text-xs">
          <button onClick={() => navigate('/legal')} className="hover:text-white/70 transition-colors cursor-pointer">Privacy</button>
          <button onClick={() => navigate('/legal')} className="hover:text-white/70 transition-colors cursor-pointer">Terms</button>
          <span>&copy; {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}

function GdprFaqItem({ question, answer, isOpen, onToggle }: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border border-background-200/70 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer hover:bg-background-50/50 transition-colors"
      >
        <span className="text-sm font-semibold text-primary-900 pr-2">{question}</span>
        <i className={`ri-${isOpen ? 'subtract' : 'add'}-line text-base text-foreground-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}></i>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="px-5 pb-4 text-sm text-foreground-600 leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  );
}

const gdprFaqs = [
  {
    question: 'Is HR Voodoo compliant with UK GDPR?',
    answer: 'Yes. HR Voodoo is fully aligned with the UK General Data Protection Regulation as enforced by the Information Commissioner\'s Office (ICO). We process all personal data in accordance with the Data Protection Act 2018 and UK GDPR principles — lawfulness, fairness, transparency, purpose limitation, data minimisation, accuracy, storage limitation, integrity, and confidentiality.',
  },
  {
    question: 'Where is my data stored and processed?',
    answer: 'All customer data is stored and processed within the United Kingdom and the European Economic Area. We do not transfer personal data outside the UK or EEA without adequate safeguards in place, as required under UK GDPR adequacy regulations. Our hosting infrastructure is ISO 27001 certified.',
  },
  {
    question: 'What is your lawful basis for processing employee data?',
    answer: 'As an HR platform, we act as a data processor on your behalf. Your organisation, as the data controller, determines the lawful basis for processing employee data — typically this falls under "legitimate interests" or "performance of a contract" for employment-related processing. We provide a comprehensive Data Processing Agreement (DPA) to all Professional and Enterprise customers upon request.',
  },
  {
    question: 'How do you handle Subject Access Requests (SARs)?',
    answer: 'HR Voodoo provides built-in tools to help your organisation respond to Subject Access Requests within the statutory 30-day UK GDPR deadline. You can export individual employee records, activity logs, and all associated data in a structured, machine-readable format. Our support team can assist with complex or bulk SARs at no extra charge on Professional and Enterprise plans.',
  },
  {
    question: 'Do you have a Data Protection Officer (DPO)?',
    answer: 'Yes. We have a designated Data Protection Officer registered with the ICO. Our DPO oversees all data protection activities, conducts regular Data Protection Impact Assessments (DPIAs), and serves as the primary point of contact for both our customers and the ICO. Contact details are available in our privacy policy.',
  },
  {
    question: 'What happens to our data if we cancel our subscription?',
    answer: 'Under UK GDPR\'s storage limitation principle, we retain your account data for 90 days following cancellation to allow you to export any information you need. After this period, all personal data is permanently deleted from our systems using secure data destruction methods, unless retention is required by applicable UK law. You can request immediate deletion at any time by contacting our DPO.',
  },
];

export default function PricingPage() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const navigate = useNavigate();

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-background-50">
      <PricingNavbar />

      {/* Hero */}
      <section className="relative bg-primary-950 pt-28 md:pt-32 pb-16 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-primary-900/30 blur-3xl"></div>
          <div className="absolute bottom-[10%] left-[20%] w-[30%] h-[30%] rounded-full bg-accent-900/15 blur-3xl"></div>
        </div>

        <div className="relative z-10 w-full px-6 md:px-10 lg:px-16 xl:px-24 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-500/15 border border-accent-500/25 text-accent-400 text-xs md:text-sm font-medium tracking-wide mb-6">
            <i className="ri-sparkling-line text-sm"></i>
            Simple, transparent pricing
          </span>
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white font-bold leading-tight mb-4">
            Choose your plan
          </h1>
          <p className="text-white/60 text-base md:text-lg max-w-lg mx-auto mb-8">
            Start free and scale as your team grows. No hidden fees, no surprises.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-1 bg-primary-900/60 rounded-full p-1">
            <button
              onClick={() => setBilling('monthly')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                billing === 'monthly'
                  ? 'bg-accent-500 text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('yearly')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer flex items-center gap-2 ${
                billing === 'yearly'
                  ? 'bg-accent-500 text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Yearly
              <span className="text-[10px] bg-accent-500/20 text-accent-400 px-1.5 py-0.5 rounded-full">Save 20%</span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="relative z-10 -mt-8 px-6 md:px-10 lg:px-16 xl:px-24 pb-16 md:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan) => {
            const displayPrice = billing === 'yearly' && plan.price > 0
              ? Math.round(plan.price * 0.8)
              : plan.price;

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-6 md:p-8 transition-all hover:shadow-xl ${
                  plan.popular
                    ? 'bg-primary-900 border-2 border-accent-500/30 shadow-lg'
                    : 'bg-white border border-background-200/70'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 rounded-full bg-accent-500 text-white text-xs font-semibold whitespace-nowrap">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className={`font-heading text-xl font-bold mb-1 ${plan.popular ? 'text-white' : 'text-primary-900'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm ${plan.popular ? 'text-white/60' : 'text-foreground-500'}`}>
                    {plan.description}
                  </p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className={`font-heading text-4xl md:text-5xl font-bold ${plan.popular ? 'text-white' : 'text-primary-900'}`}>
                      £{displayPrice}
                    </span>
                    <span className={`text-sm ${plan.popular ? 'text-white/50' : 'text-foreground-400'}`}>
                      {plan.period}
                    </span>
                  </div>
                </div>

                <ul className="flex flex-col gap-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className={`flex items-start gap-2.5 text-sm ${plan.popular ? 'text-white/80' : 'text-foreground-600'}`}>
                      <i className="ri-check-line text-accent-500 mt-0.5 flex-shrink-0"></i>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate('/login')}
                  className={`w-full py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                    plan.popular
                      ? 'bg-accent-500 text-white hover:bg-accent-600'
                      : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* GDPR Compliance Stripe */}
      <section className="relative px-6 md:px-10 lg:px-16 xl:px-24">
        <div className="max-w-5xl mx-auto bg-primary-950 rounded-2xl overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center gap-8 p-8 md:p-10 lg:p-12">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-2xl bg-accent-500/15">
                <i className="ri-shield-check-line text-2xl md:text-3xl text-accent-400"></i>
              </div>
            </div>
            <div className="flex-1 text-center lg:text-left">
              <h2 className="font-heading text-xl md:text-2xl font-bold text-white mb-3">
                UK GDPR Compliant by Design
              </h2>
              <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-2xl">
                HR Voodoo is built from the ground up with UK data protection law at its core. We are registered with the 
                <strong className="text-white/80"> Information Commissioner's Office (ICO)</strong>, maintain a dedicated 
                <strong className="text-white/80"> Data Protection Officer</strong>, and process all personal data exclusively within the United Kingdom and EEA. 
                Every plan — including our free Starter tier — comes with full UK GDPR alignment, so you can focus on your people, not paperwork.
              </p>
            </div>
            <div className="flex-shrink-0">
              <a
                href="/legal#dpa"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 text-white text-sm font-semibold hover:bg-white/15 transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-file-text-line text-base"></i>
                View DPA
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* UK GDPR FAQ */}
      <section className="py-14 md:py-20 px-6 md:px-10 lg:px-16 xl:px-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-600 text-xs font-medium tracking-wide mb-4">
              <i className="ri-lock-line text-sm"></i>
              Data Protection
            </span>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary-900 mb-3">
              UK GDPR — Your Questions Answered
            </h2>
            <p className="text-foreground-500 text-sm md:text-base max-w-lg mx-auto">
              Everything you need to know about how HR Voodoo handles your data under UK law, enforced by the ICO.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {gdprFaqs.map((faq, index) => (
              <GdprFaqItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFaq === index}
                onToggle={() => toggleFaq(index)}
              />
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-sm text-foreground-400 mb-4">
              Still have questions about data protection or compliance?
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => navigate('/chat')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent-500 text-white text-sm font-semibold hover:bg-accent-600 transition-colors cursor-pointer"
              >
                <i className="ri-chat-smile-3-line text-lg"></i>
                Chat with us
              </button>
              <a
                href="https://ico.org.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-background-100 text-foreground-600 text-sm font-semibold hover:bg-background-200 transition-colors cursor-pointer"
              >
                <i className="ri-external-link-line text-base"></i>
                Visit ICO Website
              </a>
            </div>
          </div>
        </div>
      </section>

      <PricingFooter />
    </div>
  );
}