import { useState } from 'react';
import { useAuth } from '@/auth/useAuth';
import { updateProfile } from '@/lib/supabase/profiles';
import { recordConsent } from '@/lib/supabase/consent';
import { writeAuditLog } from '@/lib/supabase/audit';
import { useNavigate } from 'react-router-dom';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'es', name: 'Spanish' },
];

const TIMEZONES = [
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Stockholm',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Australia/Sydney',
  'Pacific/Auckland',
];

export default function SettingsPage() {
  const { profile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [language, setLanguage] = useState(profile?.preferred_language ?? 'en');
  const [timezone, setTimezone] = useState(profile?.timezone ?? 'Europe/London');
  const [country, setCountry] = useState(profile?.jurisdiction_country ?? 'GB');
  const [region, setRegion] = useState(profile?.jurisdiction_region ?? '');
  const [marketingConsent, setMarketingConsent] = useState(profile?.marketing_consent ?? false);
  const [aiConsentAcknowledged, setAiConsentAcknowledged] = useState(false);

  if (!profile) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const result = await updateProfile(profile.id, {
      preferred_language: language,
      timezone,
      jurisdiction_country: country,
      jurisdiction_region: region || null,
    });

    if (!result.success) {
      setMessage({ type: 'error', text: result.error || 'Failed to save settings.' });
      setSaving(false);
      return;
    }

    if (marketingConsent !== profile.marketing_consent) {
      await recordConsent(profile.id, 'marketing', marketingConsent, 'settings');
      await writeAuditLog({
        event_type: 'marketing_consent_changed',
        entity_type: 'profile',
        entity_id: profile.id,
        event_data: { marketing_consent: marketingConsent },
      });
    }

    if (aiConsentAcknowledged) {
      await recordConsent(profile.id, 'ai_processing', true, 'settings');
      setAiConsentAcknowledged(false);
    }

    await refreshProfile();
    setMessage({ type: 'success', text: 'Settings saved successfully.' });
    setSaving(false);
  };

  return (
    <div className="p-6 md:p-10 max-w-2xl">
      <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground-950 mb-1">Settings</h1>
      <p className="text-foreground-500 text-sm mb-8">Configure your preferences and consent settings.</p>

      {message && (
        <div
          className={`mb-6 p-3 rounded-lg text-sm font-medium ${
            message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}
          role="alert"
          aria-live="polite"
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white border border-background-200/70 rounded-xl p-6 space-y-6">
        <div>
          <h2 className="font-heading text-lg font-bold text-foreground-950 mb-4">Preferences</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-foreground-700 text-sm font-medium mb-1.5">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-background-200 bg-background-50 text-foreground-900 text-sm focus:outline-none focus:border-accent-500/50 transition-colors cursor-pointer"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>{l.name}</option>
                ))}
              </select>
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

            <div>
              <label className="block text-foreground-700 text-sm font-medium mb-1.5">Country</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-background-200 bg-background-50 text-foreground-900 text-sm focus:outline-none focus:border-accent-500/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-foreground-700 text-sm font-medium mb-1.5">Region</label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-background-200 bg-background-50 text-foreground-900 text-sm focus:outline-none focus:border-accent-500/50 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-background-200/70 pt-6">
          <h2 className="font-heading text-lg font-bold text-foreground-950 mb-4">Consent</h2>

          <label className="flex items-start gap-3 mb-4 cursor-pointer">
            <input
              type="checkbox"
              checked={marketingConsent}
              onChange={(e) => setMarketingConsent(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-background-300 bg-background-50 text-accent-500 focus:ring-accent-500/30"
            />
            <div>
              <span className="text-sm font-medium text-foreground-900">Marketing Communications</span>
              <p className="text-xs text-foreground-500 mt-0.5">Receive tips, guides, and product updates from HR Voodoo.</p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={aiConsentAcknowledged}
              onChange={(e) => setAiConsentAcknowledged(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-background-300 bg-background-50 text-accent-500 focus:ring-accent-500/30"
            />
            <div>
              <span className="text-sm font-medium text-foreground-900">AI Processing Consent</span>
              <p className="text-xs text-foreground-500 mt-0.5">
                I consent to HR Voodoo processing my questions using AI technology. My data will be handled in accordance with the Privacy Policy.
              </p>
            </div>
          </label>
        </div>

        <div className="border-t border-background-200/70 pt-6">
          <h2 className="font-heading text-lg font-bold text-foreground-950 mb-4">Account</h2>
          <p className="text-sm text-foreground-500 mb-3">
            Account deletion is not yet available in self-service. Please contact support if you need to delete your account.
          </p>
          <button
            type="button"
            disabled
            className="px-5 py-2.5 rounded-lg border border-background-200 text-foreground-400 text-sm font-semibold cursor-not-allowed whitespace-nowrap"
          >
            Delete Account
          </button>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-lg bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
          >
            {saving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}