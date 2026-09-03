export type UserRole =
  | 'individual'
  | 'employee'
  | 'manager'
  | 'hr_professional'
  | 'organisation_admin'
  | 'platform_admin';

export type AccountStatus =
  | 'pending_verification'
  | 'active'
  | 'suspended'
  | 'disabled'
  | 'deleted';

export type MembershipRole =
  | 'owner'
  | 'admin'
  | 'hr'
  | 'manager'
  | 'employee'
  | 'viewer';

export type MembershipStatus = 'active' | 'inactive' | 'invited';

export type ConsentType = 'terms' | 'privacy' | 'marketing' | 'ai_processing';

export type AuditEventType =
  | 'account_created'
  | 'email_verified'
  | 'login_success'
  | 'logout'
  | 'password_reset_requested'
  | 'password_updated'
  | 'profile_updated'
  | 'terms_accepted'
  | 'privacy_accepted'
  | 'marketing_consent_changed'
  | 'role_changed'
  | 'account_suspended'
  | 'account_reactivated';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  display_name: string | null;
  phone: string | null;
  job_title: string | null;
  avatar_url: string | null;
  primary_role: UserRole;
  account_status: AccountStatus;
  preferred_language: string;
  jurisdiction_country: string;
  jurisdiction_region: string | null;
  timezone: string;
  onboarding_completed: boolean;
  terms_accepted_at: string | null;
  privacy_accepted_at: string | null;
  marketing_consent: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Organisation {
  id: string;
  name: string;
  slug: string;
  organisation_type: string | null;
  industry: string | null;
  company_size: string | null;
  country_code: string;
  owner_user_id: string;
  subscription_status: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrganisationMember {
  id: string;
  organisation_id: string;
  user_id: string;
  membership_role: MembershipRole;
  membership_status: MembershipStatus;
  invited_by: string | null;
  joined_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConsentRecord {
  id: string;
  user_id: string;
  consent_type: ConsentType;
  consent_version: string;
  granted: boolean;
  source: string | null;
  ip_hash: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_user_id: string | null;
  organisation_id: string | null;
  event_type: AuditEventType;
  entity_type: string | null;
  entity_id: string | null;
  event_data: Record<string, unknown>;
  created_at: string;
}

export type UpdatableProfileFields = Pick<
  Profile,
  'full_name' | 'display_name' | 'phone' | 'job_title' | 'jurisdiction_country' | 'jurisdiction_region' | 'timezone' | 'preferred_language' | 'avatar_url'
>;