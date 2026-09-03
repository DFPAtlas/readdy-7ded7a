import { supabase } from './client';
import type { Organisation, OrganisationMember } from './types';

export async function fetchUserOrganisations(userId: string): Promise<Organisation[]> {
  if (!supabase) return [];

  const { data: memberships, error: memberError } = await supabase
    .from('organisation_members')
    .select('organisation_id')
    .eq('user_id', userId)
    .eq('membership_status', 'active');

  if (memberError || !memberships || memberships.length === 0) {
    return [];
  }

  const orgIds = memberships.map((m) => m.organisation_id);

  const { data: organisations, error: orgError } = await supabase
    .from('organisations')
    .select('*')
    .in('id', orgIds);

  if (orgError) {
    console.error('Error fetching organisations:', orgError.message);
    return [];
  }

  return (organisations as Organisation[]) || [];
}

export async function fetchOrganisationMemberships(
  userId: string,
): Promise<OrganisationMember[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('organisation_members')
    .select('*')
    .eq('user_id', userId)
    .eq('membership_status', 'active');

  if (error) {
    console.error('Error fetching memberships:', error.message);
    return [];
  }

  return (data as OrganisationMember[]) || [];
}