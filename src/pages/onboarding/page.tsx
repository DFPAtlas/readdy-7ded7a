import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/useAuth';
import { updateProfile, updateOnboardingStatus } from '@/lib/supabase/profiles';
import { recordConsent } from '@/lib/supabase/consent';
import { writeAuditLog } from '@/lib/supabase/audit';

const USAGE_OPTIONS = [
  { value: 'individual', label: 'For myself', icon: 'ri-user-line', desc: 'Personal HR guidance and resources' },
  { value: 'employee', label: 'As an employee', icon: 'ri-briefcase-line', desc: 'Workplace advice and rights' },
  { value: 'manager', label: 'As a manager', icon: 'ri-team-line', desc: 'Team management support' },
  { value: 'hr_professional', label: 'As an HR professional', icon: 'ri-building-line', desc: 'HR tools and expertise' },
  { value: 'organisation', label: 'For my organisation', icon: 'ri-organization-chart', desc: 'Full organisation setup' },
];

const COUNTRIES = [
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'IE', name: 'Ireland' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'NL', name: 'Netherlands' },
];

const TIMEZONES = [
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Australia/Sydney',
];

export default function OnboardingPage() {
  const { profile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [usageType, setUsageType] = useState('');
  const [country, setCountry] = useState('GB');
  const [region, setRegion] = useState('');
  const [timezone, setTimezone] = useState('Europe/London');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [aiConsent, setAiConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!profile) return null;

  const handleComplete = async () => {
    setLoading(true);
    setError(null);

    const now = new Date().toISOString();

    const result = await updateOnboardingStatus(profile.id, {
      jurisdiction_country: country,
      jurisdiction_region: region || null,
      timezone,
      terms_accepted_at: now,
      privacy_accepted_at: now,
      onboarding_completed: true,
    });

    if (!result.success) {
      setError('Could not save your preferences. Please try again.');
      setLoading(false);
      return;
    }

    // Record consents
    await recordConsent(profile.id, 'terms', true, 'onboarding');
    await recordConsent(profile.id, 'privacy', true, 'onboarding');
    if (aiConsent) {
      await recordConsent(profile.id, 'ai_processing', true, 'onboarding');
    }

    await writeAuditLog({ event_type: 'terms_accepted', entity_type: 'profile', entity_id: profile.id });
    await writeAuditLog({ event_type: 'privacy_accepted', entity_type: 'profile', entity_id: profile.id });

    await refreshProfile();
    setLoading(false);
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen bg-background-50 flex flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-xl bg-primary-900">
            <i className="ri-book-open-line text-xl text-accent-400"></i>
          </div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground-950 mb-1">Welcome to HR Voodoo</h1>
          <p className="text-foreground-500 text-sm">Let&apos;s set up your account in a few quick steps.</p>

          {/* Step indicators */}
          <div className="flex items-center justify-center gap-2 mt-5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  s === step ? 'bg-accent-500' : s < step ? 'bg-accent-300' : 'bg-background-300'
                }`}
              ></div>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg text-sm font-medium bg-red-50 text-red-700 border border-red-200" role="alert">
            {error}
          </div>
        )}

        <div className="bg-white border border-background-200/70 rounded-2xl p-6 md:p-8">
          {/* Step 1: Usage */}
          {step === 1 && (
            <div>
              <h2 className="font-heading text-lg font-bold text-foreground-950 mb-4">How will you use HR Voodoo?</h2>
              <p className="text-sm text-foreground-500 mb-5">This helps us personalise your experience. You can change this later.</p>
              <div className="space-y-3">
                {USAGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setUsageType(opt.value)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-colors cursor-pointer ${
                      usageType === opt.value
                        ? 'border-accent-500 bg-accent-50'
                        : 'border-background-200 hover:border-background-300 hover:bg-background-50'
                    }`}
                  >
                    <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${usageType === opt.value ? 'bg-accent-500/15 text-accent-600' : 'bg-background-100 text-foreground-400'}`}>
                      <i className={`${opt.icon} text-lg`}></i>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground-900">{opt.label}</p>
                      <p className="text-xs text-foreground-500">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={!usageType}
                className="w-full mt-6 py-3 rounded-lg bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <div>
              <h2 className="font-heading text-lg font-bold text-foreground-950 mb-4">Where are you based?</h2>
              <p className="text-sm text-foreground-500 mb-5">This helps us provide relevant guidance for your jurisdiction.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-foreground-700 text-sm font-medium mb-1.5">Country</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-background-200 bg-background-50 text-foreground-900 text-sm focus:outline-none focus:border-accent-500/50 transition-colors cursor-pointer"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-foreground-700 text-sm font-medium mb-1.5">Region (optional)</label>
                  <input
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder="e.g. England, California"
                    className="w-full px-4 py-2.5 rounded-lg border border-background-200 bg-background-50 text-foreground-900 text-sm focus:outline-none focus:border-accent-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-foreground-700 text-sm font-medium mb-1.5">Timezone</label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-background-200 bg-background-50 text-foreground-900 text-sm focus:outline-none focus:border-accent-500/50 transition-colors cursor-pointer"
                  >
                    {TIMEZONES.map((tz) => (
                      <option key={tz} value={tz}>{tz}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 rounded-lg border border-background-200 text-foreground-700 text-sm font-semibold hover:bg-background-100 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 rounded-lg bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Consent */}
          {step === 3 && (
            <div>
              <h2 className="font-heading text-lg font-bold text-foreground-950 mb-4">Almost there</h2>
              <p className="text-sm text-foreground-500 mb-5">Please review and accept the following.</p>

              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-background-300 bg-background-50 text-accent-500"
                  />
                  <span className="text-sm text-foreground-800">
                    I accept the{' '}
                    <a href="/legal" target="_blank" rel="noreferrer" className="text-accent-500 hover:text-accent-600 underline">Terms of Service</a>
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacyAccepted}
                    onChange={(e) => setPrivacyAccepted(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-background-300 bg-background-50 text-accent-500"
                  />
                  <span className="text-sm text-foreground-800">
                    I accept the{' '}
                    <a href="/legal" target="_blank" rel="noreferrer" className="text-accent-500 hover:text-accent-600 underline">Privacy Policy</a>
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={aiConsent}
                    onChange={(e) => setAiConsent(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-background-300 bg-background-50 text-accent-500"
                  />
                  <span className="text-sm text-foreground-800">
                    I consent to HR Voodoo processing my questions using AI. My data will be handled in accordance with the Privacy Policy. This is optional and can be changed in Settings.
                  </span>
                </label>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 rounded-lg border border-background-200 text-foreground-700 text-sm font-semibold hover:bg-background-100 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Back
                </button>
                <button
                  onClick={handleComplete}
                  disabled={!termsAccepted || !privacyAccepted || loading}
                  className="flex-1 py-3 rounded-lg bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                  {loading ? 'Setting up...' : 'Get Started'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}