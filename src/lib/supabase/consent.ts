import { supabase } from '../supabase/client';
import { CONSENT_VERSIONS } from '@/config/consentVersions';
import type { ConsentType } from '../supabase/types';

export async function recordConsent(
  userId: string,
  consentType: ConsentType,
  granted: boolean,
  source: string = 'web',
): Promise<void> {
  if (!supabase) return;

  const versionKey = consentType as keyof typeof CONSENT_VERSIONS;
  const consentVersion = CONSENT_VERSIONS[versionKey];

  if (!consentVersion) return;

  const { error } = await supabase.from('consent_records').insert({
    user_id: userId,
    consent_type: consentType,
    consent_version: consentVersion,
    granted,
    source,
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
    ip_hash: null,
  });

  if (error) {
    console.error('Error recording consent:', error.message);
  }
}

export async function recordRegistrationConsents(
  userId: string,
  marketingConsent: boolean,
): Promise<void> {
  await Promise.all([
    recordConsent(userId, 'terms', true, 'registration'),
    recordConsent(userId, 'privacy', true, 'registration'),
    recordConsent(userId, 'marketing', marketingConsent, 'registration'),
  ]);
}