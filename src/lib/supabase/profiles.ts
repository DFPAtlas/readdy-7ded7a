import { supabase } from './client';
import type { Profile, UpdatableProfileFields } from './types';

export async function fetchProfile(userId: string): Promise<Profile | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching profile:', error.message);
    return null;
  }

  return data as Profile | null;
}

export async function updateProfile(
  userId: string,
  fields: Partial<UpdatableProfileFields>,
): Promise<{ success: boolean; error: string | null }> {
  if (!supabase) return { success: false, error: 'Supabase is not connected.' };

  const { error } = await supabase
    .from('profiles')
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq('id', userId);

  if (error) {
    console.error('Error updating profile:', error.message);
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

export async function updateOnboardingStatus(
  userId: string,
  data: {
    jurisdiction_country: string;
    jurisdiction_region: string | null;
    timezone: string;
    terms_accepted_at: string;
    privacy_accepted_at: string;
    onboarding_completed: boolean;
  },
): Promise<{ success: boolean; error: string | null }> {
  if (!supabase) return { success: false, error: 'Supabase is not connected.' };

  const { error } = await supabase
    .from('profiles')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', userId);

  if (error) {
    console.error('Error updating onboarding:', error.message);
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}