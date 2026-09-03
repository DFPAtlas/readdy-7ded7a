import { useNavigate } from 'react-router-dom';

function LegalNavbar() {
  const navigate = useNavigate();
  return (
    <nav className="w-full px-6 md:px-10 py-5 border-b border-background-200/70 bg-background-50/95 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-900">
            <i className="ri-book-open-line text-sm text-accent-400"></i>
          </div>
          <span className="text-base font-heading font-bold text-primary-900 tracking-tight">HR Voodoo</span>
        </a>
        <button onClick={() => navigate('/')} className="text-sm font-medium text-foreground-600 hover:text-accent-500 transition-colors cursor-pointer">
          Back to Home
        </button>
      </div>
    </nav>
  );
}

export default function LegalPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background-50">
      <LegalNavbar />

      <main className="w-full max-w-3xl mx-auto px-6 md:px-10 py-12 md:py-16">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary-900 mb-3">
          Terms of Service & Privacy Policy
        </h1>
        <p className="text-foreground-500 text-sm mb-10">
          Last updated: July 7, 2026
        </p>

        {/* Terms of Service */}
        <section className="mb-12">
          <h2 className="font-heading text-xl md:text-2xl font-bold text-primary-900 mb-4">
            Terms of Service
          </h2>

          <div className="space-y-6 text-foreground-600 text-sm leading-relaxed">
            <div>
              <h3 className="font-semibold text-foreground-800 mb-2">1. Acceptance of Terms</h3>
              <p>
                By accessing or using HR Voodoo, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform. We reserve the right to update these terms at any time, and your continued use constitutes acceptance of the revised terms.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground-800 mb-2">2. Description of Service</h3>
              <p>
                HR Voodoo provides general human resources guidance, resources, and information to help users understand workplace topics. Our service includes curated content, personalized recommendations, and AI-assisted Q&amp;A features.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground-800 mb-2">3. Not Legal Advice</h3>
              <p>
                <strong className="text-foreground-800">Important:</strong> The information provided through HR Voodoo is for general guidance purposes only and does not constitute legal, financial, or professional advice. We are not a law firm, and no attorney-client relationship is created by using our platform. Always consult with a qualified legal professional or HR specialist for advice specific to your situation.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground-800 mb-2">4. User Accounts</h3>
              <p>
                To access certain features, you may need to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate and complete information when creating your account.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground-800 mb-2">5. Acceptable Use</h3>
              <p>
                You agree not to use HR Voodoo for any unlawful purpose or in any way that could damage, disable, or impair our service. You may not attempt to gain unauthorized access to any portion of the platform or its related systems.
              </p>
            </div>
          </div>
        </section>

        {/* Privacy Policy */}
        <section className="mb-12">
          <h2 className="font-heading text-xl md:text-2xl font-bold text-primary-900 mb-4">
            Privacy Policy
          </h2>

          <div className="space-y-6 text-foreground-600 text-sm leading-relaxed">
            <div>
              <h3 className="font-semibold text-foreground-800 mb-2">1. Information We Collect</h3>
              <p>
                We collect information you provide directly to us, such as your name, email address, and any content you submit through our platform. We also collect usage data to improve our service, including interactions with our content and features.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground-800 mb-2">2. How We Use Your Information</h3>
              <p>
                We use your information to provide and improve our services, personalize your experience, communicate with you, and ensure the security of our platform. We do not sell your personal information to third parties.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground-800 mb-2">3. Data Security</h3>
              <p>
                We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, or destruction. However, no method of transmission over the internet is 100% secure.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground-800 mb-2">4. Your Rights</h3>
              <p>
                Depending on your location, you may have rights to access, correct, delete, or restrict the processing of your personal data. Contact us to exercise these rights.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground-800 mb-2">5. Cookies</h3>
              <p>
                We use cookies and similar technologies to enhance your experience, analyze usage, and support our marketing efforts. You can manage cookie preferences through your browser settings.
              </p>
            </div>
          </div>
        </section>

        {/* Data Processing Agreement */}
        <section id="dpa" className="mb-12 scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-accent-500/10">
              <i className="ri-shield-check-line text-base text-accent-500"></i>
            </div>
            <h2 className="font-heading text-xl md:text-2xl font-bold text-primary-900">
              Data Processing Agreement (DPA)
            </h2>
          </div>

          <p className="text-foreground-500 text-sm mb-6">
            This Data Processing Agreement forms part of the Terms of Service between HR Voodoo ("Processor", "we", "us") and the customer organisation ("Controller", "you"). It governs our processing of personal data on your behalf under UK GDPR and the Data Protection Act 2018.
          </p>

          <div className="space-y-6 text-foreground-600 text-sm leading-relaxed">
            <div>
              <h3 className="font-semibold text-foreground-800 mb-2">1. Definitions & Interpretation</h3>
              <p>
                Terms used in this DPA — including "personal data", "processing", "data subject", "controller", "processor", "personal data breach", and "supervisory authority" — carry the meanings given in Article 4 of the UK GDPR. References to the ICO refer to the Information Commissioner's Office, the UK's independent data protection regulator.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground-800 mb-2">2. Roles & Responsibilities</h3>
              <p>
                <strong className="text-foreground-800">You (the Controller)</strong> determine the purposes and means of processing personal data within HR Voodoo. You are responsible for establishing a lawful basis for processing, providing privacy notices to your employees and data subjects, and ensuring the personal data you upload complies with UK data protection law.
              </p>
              <p className="mt-2">
                <strong className="text-foreground-800">We (the Processor)</strong> process personal data solely on your documented instructions. We will never use your personal data for our own purposes, sell it, or share it with third parties except as expressly authorised in this DPA.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground-800 mb-2">3. Categories of Data & Data Subjects</h3>
              <p>
                The personal data processed through HR Voodoo typically includes: employee names, email addresses, job titles, department information, and HR-related records you choose to upload. Data subjects are your employees, contractors, and job applicants whose personal data you store on the platform. We do not process special category data unless you explicitly configure your account to do so, in which case additional safeguards apply.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground-800 mb-2">4. Duration of Processing</h3>
              <p>
                Processing continues for the duration of your active subscription. Upon termination or cancellation, we retain personal data for a 90-day grace period to allow you to export records, after which all personal data is permanently deleted in accordance with our data retention policy — unless retention is required by applicable UK law.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground-800 mb-2">5. Sub-Processors</h3>
              <p>
                We use a limited number of sub-processors to deliver HR Voodoo. All sub-processors are bound by contracts that impose data protection obligations no less protective than those in this DPA. Our current sub-processors include our cloud hosting provider (ISO 27001 certified, UK/EEA-based) and our email delivery service. We will notify you before engaging any new sub-processor, and you may object on reasonable data protection grounds within 14 days.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground-800 mb-2">6. Technical & Organisational Measures</h3>
              <p>
                We maintain industry-standard security measures including: encryption of data in transit (TLS 1.3) and at rest (AES-256), multi-factor authentication for administrative access, regular penetration testing, continuous security monitoring, role-based access controls, and annual security awareness training for all personnel. Our hosting infrastructure maintains ISO 27001 certification. A detailed schedule of security measures is available upon written request.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground-800 mb-2">7. Personal Data Breach Notification</h3>
              <p>
                In the event of a confirmed personal data breach, we will notify you without undue delay and in any event within 48 hours of becoming aware. Our notification will describe the nature of the breach, the categories and approximate number of data subjects and records affected, likely consequences, and measures taken or proposed to address the breach. We will cooperate fully with your obligations to notify the ICO within 72 hours where required under Article 33 of the UK GDPR.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground-800 mb-2">8. Assisting with Data Subject Rights</h3>
              <p>
                HR Voodoo includes built-in tools to help you respond to Subject Access Requests (SARs), rectification requests, and erasure requests from data subjects within the statutory deadlines. We will promptly notify you if we receive any request directly from a data subject and will not respond unless authorised by you. Professional and Enterprise plan customers receive priority assistance for complex or bulk SARs.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground-800 mb-2">9. Cross-Border Data Transfers</h3>
              <p>
                All personal data is processed and stored within the United Kingdom and the European Economic Area. We do not transfer personal data outside the UK or EEA. In the event this changes, we will implement UK Government-approved transfer mechanisms — such as an International Data Transfer Agreement (IDTA) or the UK Addendum to the EU Standard Contractual Clauses — and notify you in advance.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground-800 mb-2">10. Audit Rights</h3>
              <p>
                Upon reasonable written notice (minimum 30 days), you may audit our compliance with this DPA. Audits are limited to once per calendar year unless required by a supervisory authority or following a confirmed personal data breach. You may engage an independent auditor subject to a confidentiality agreement. We will provide our most recent ISO 27001 certificate and SOC 2 report (where applicable) to satisfy routine due diligence without the need for an on-site visit.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground-800 mb-2">11. Data Protection Officer</h3>
              <p>
                Our Data Protection Officer is registered with the ICO and can be contacted at <strong className="text-foreground-800">dpo@hrvoodoo.com</strong>. The DPO oversees all data protection activities, conducts Data Protection Impact Assessments (DPIAs), and serves as the primary point of contact for both customers and the ICO regarding data protection matters.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground-800 mb-2">12. Governing Law & Jurisdiction</h3>
              <p>
                This DPA is governed by the laws of England and Wales. Any disputes arising from or in connection with this DPA shall be subject to the exclusive jurisdiction of the courts of England and Wales. Nothing in this clause limits the powers of the ICO as the UK supervisory authority.
              </p>
            </div>
          </div>

          <div className="mt-8 p-5 rounded-xl bg-accent-500/5 border border-accent-500/15">
            <h4 className="font-semibold text-foreground-800 text-sm mb-2">
              <i className="ri-download-line mr-1.5 text-accent-500"></i>
              Download a Signed Copy
            </h4>
            <p className="text-foreground-500 text-xs mb-4">
              Professional and Enterprise customers can request a countersigned PDF copy of this DPA. We typically return signed DPAs within two business days.
            </p>
            <button
              onClick={() => navigate('/chat')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent-500 text-white text-xs font-semibold hover:bg-accent-600 transition-colors cursor-pointer"
            >
              <i className="ri-chat-smile-3-line text-sm"></i>
              Request DPA via Chat
            </button>
          </div>
        </section>

        {/* Contact */}
        <section>
          <h2 className="font-heading text-xl md:text-2xl font-bold text-primary-900 mb-4">
            Contact Us
          </h2>
          <p className="text-foreground-600 text-sm leading-relaxed mb-4">
            If you have any questions about these Terms, our Privacy Policy, or the Data Processing Agreement, please reach out to us.
          </p>
          <button
            onClick={() => navigate('/chat')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent-500 text-white text-sm font-semibold hover:bg-accent-600 transition-colors cursor-pointer"
          >
            <i className="ri-chat-smile-3-line text-lg"></i>
            Chat with HR Voodoo
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary-950 py-8 px-6 md:px-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 flex items-center justify-center rounded bg-primary-800">
              <i className="ri-book-open-line text-sm text-accent-400"></i>
            </div>
            <span className="text-sm font-heading font-bold text-white/60">HR Voodoo</span>
          </div>
          <p className="text-white/30 text-xs">
            &copy; {new Date().getFullYear()} HR Voodoo. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}