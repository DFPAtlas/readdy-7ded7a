import { useState } from 'react';
import { useAuth } from '@/auth/useAuth';
import { updateProfile } from '@/lib/supabase/profiles';
import { writeAuditLog } from '@/lib/supabase/audit';

const COUNTRIES = [
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'IE', name: 'Ireland' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
];

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'es', name: 'Spanish' },
  { code: 'nl', name: 'Dutch' },
  { code: 'sv', name: 'Swedish' },
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

export default function ProfilePage() {
  const { profile, refreshProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [form, setForm] = useState({
    full_name: profile?.full_name ?? '',
    display_name: profile?.display_name ?? '',
    phone: profile?.phone ?? '',
    job_title: profile?.job_title ?? '',
    jurisdiction_country: profile?.jurisdiction_country ?? 'GB',
    jurisdiction_region: profile?.jurisdiction_region ?? '',
    timezone: profile?.timezone ?? 'Europe/London',
    preferred_language: profile?.preferred_language ?? 'en',
    avatar_url: profile?.avatar_url ?? '',
  });

  if (!profile) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const result = await updateProfile(profile.id, form);
    if (result.success) {
      await writeAuditLog({
        event_type: 'profile_updated',
        entity_type: 'profile',
        entity_id: profile.id,
      });
      await refreshProfile();
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to update profile.' });
    }

    setSaving(false);
  };

  return (
    <div className="p-6 md:p-10 max-w-2xl">
      <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground-950 mb-1">Profile</h1>
      <p className="text-foreground-500 text-sm mb-8">Manage your personal information.</p>

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

      <form onSubmit={handleSubmit} className="bg-white border border-background-200/70 rounded-xl p-6 space-y-5">
        {/* Read-only fields */}
        <div className="bg-background-50/50 border border-background-200/30 rounded-lg p-4">
          <p className="text-xs font-semibold text-foreground-400 uppercase tracking-wider mb-2">Account Info (read-only)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-foreground-400">Email:</span>
              <span className="ml-2 text-foreground-800">{profile.email}</span>
            </div>
            <div>
              <span className="text-foreground-400">Role:</span>
              <span className="ml-2 text-foreground-800 capitalize">{profile.primary_role.replace(/_/g, ' ')}</span>
            </div>
            <div>
              <span className="text-foreground-400">Status:</span>
              <span className="ml-2 text-foreground-800 capitalize">{profile.account_status.replace(/_/g, ' ')}</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-foreground-700 text-sm font-medium mb-1.5">Full Name</label>
          <input
            type="text"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-background-200 bg-background-50 text-foreground-900 text-sm focus:outline-none focus:border-accent-500/50 transition-colors"
          />
        </div>

        <div>
          <label className="block text-foreground-700 text-sm font-medium mb-1.5">Display Name</label>
          <input
            type="text"
            value={form.display_name}
            onChange={(e) => setForm({ ...form, display_name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-background-200 bg-background-50 text-foreground-900 text-sm focus:outline-none focus:border-accent-500/50 transition-colors"
          />
        </div>

        <div>
          <label className="block text-foreground-700 text-sm font-medium mb-1.5">Phone</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-background-200 bg-background-50 text-foreground-900 text-sm focus:outline-none focus:border-accent-500/50 transition-colors"
          />
        </div>

        <div>
          <label className="block text-foreground-700 text-sm font-medium mb-1.5">Job Title</label>
          <input
            type="text"
            value={form.job_title}
            onChange={(e) => setForm({ ...form, job_title: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-background-200 bg-background-50 text-foreground-900 text-sm focus:outline-none focus:border-accent-500/50 transition-colors"
          />
        </div>

        <div>
          <label className="block text-foreground-700 text-sm font-medium mb-1.5">Avatar URL</label>
          <input
            type="url"
            value={form.avatar_url}
            onChange={(e) => setForm({ ...form, avatar_url: e.target.value })}
            placeholder="https://example.com/avatar.jpg"
            className="w-full px-4 py-2.5 rounded-lg border border-background-200 bg-background-50 text-foreground-900 text-sm focus:outline-none focus:border-accent-500/50 transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-foreground-700 text-sm font-medium mb-1.5">Country</label>
            <select
              value={form.jurisdiction_country}
              onChange={(e) => setForm({ ...form, jurisdiction_country: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-background-200 bg-background-50 text-foreground-900 text-sm focus:outline-none focus:border-accent-500/50 transition-colors cursor-pointer"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-foreground-700 text-sm font-medium mb-1.5">Region</label>
            <input
              type="text"
              value={form.jurisdiction_region}
              onChange={(e) => setForm({ ...form, jurisdiction_region: e.target.value })}
              placeholder="e.g. England"
              className="w-full px-4 py-2.5 rounded-lg border border-background-200 bg-background-50 text-foreground-900 text-sm focus:outline-none focus:border-accent-500/50 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-foreground-700 text-sm font-medium mb-1.5">Timezone</label>
            <select
              value={form.timezone}
              onChange={(e) => setForm({ ...form, timezone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-background-200 bg-background-50 text-foreground-900 text-sm focus:outline-none focus:border-accent-500/50 transition-colors cursor-pointer"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-foreground-700 text-sm font-medium mb-1.5">Language</label>
            <select
              value={form.preferred_language}
              onChange={(e) => setForm({ ...form, preferred_language: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-background-200 bg-background-50 text-foreground-900 text-sm focus:outline-none focus:border-accent-500/50 transition-colors cursor-pointer"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>{l.name}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-lg bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
        >
          {saving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}