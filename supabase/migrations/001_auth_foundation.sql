-- =============================================================================
-- HR Voodoo — Phase 2A: Auth Foundation Migration
-- =============================================================================

-- Enums -----------------------------------------------------------------------

DO $$ BEGIN
  CREATE TYPE public.user_role AS ENUM (
    'individual',
    'employee',
    'manager',
    'hr_professional',
    'organisation_admin',
    'platform_admin'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.account_status AS ENUM (
    'pending_verification',
    'active',
    'suspended',
    'disabled',
    'deleted'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.membership_role AS ENUM (
    'owner',
    'admin',
    'hr',
    'manager',
    'employee',
    'viewer'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.membership_status AS ENUM (
    'active',
    'inactive',
    'invited'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.consent_type AS ENUM (
    'terms',
    'privacy',
    'marketing',
    'ai_processing'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Helper: updated_at trigger --------------------------------------------------

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = '';

-- Profiles --------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.profiles (
  id                    uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email                 text,
  full_name             text,
  display_name          text,
  phone                 text,
  job_title             text,
  avatar_url            text,
  primary_role          public.user_role DEFAULT 'individual'::public.user_role,
  account_status        public.account_status DEFAULT 'pending_verification'::public.account_status,
  preferred_language    text DEFAULT 'en',
  jurisdiction_country  text DEFAULT 'GB',
  jurisdiction_region   text,
  timezone              text DEFAULT 'Europe/London',
  onboarding_completed  boolean DEFAULT false,
  terms_accepted_at     timestamptz,
  privacy_accepted_at   timestamptz,
  marketing_consent     boolean DEFAULT false,
  last_login_at         timestamptz,
  created_at            timestamptz DEFAULT now(),
  updated_at            timestamptz DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-create profile on auth.user insert ------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NULL)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = '';

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Organisations ---------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.organisations (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name                text NOT NULL,
  slug                text UNIQUE NOT NULL,
  organisation_type   text,
  industry            text,
  company_size        text,
  country_code        text DEFAULT 'GB',
  owner_user_id       uuid REFERENCES auth.users(id),
  subscription_status text DEFAULT 'trial',
  is_active           boolean DEFAULT true,
  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_organisations_updated_at ON public.organisations;
CREATE TRIGGER trg_organisations_updated_at
  BEFORE UPDATE ON public.organisations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Organisation Members --------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.organisation_members (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id   uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  user_id           uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  membership_role   public.membership_role DEFAULT 'employee'::public.membership_role,
  membership_status public.membership_status DEFAULT 'active'::public.membership_status,
  invited_by        uuid REFERENCES auth.users(id),
  joined_at         timestamptz,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now(),
  UNIQUE (organisation_id, user_id)
);

DROP TRIGGER IF EXISTS trg_organisation_members_updated_at ON public.organisation_members;
CREATE TRIGGER trg_organisation_members_updated_at
  BEFORE UPDATE ON public.organisation_members
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Consent Records -------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.consent_records (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_type     public.consent_type NOT NULL,
  consent_version  text NOT NULL,
  granted          boolean NOT NULL,
  source           text,
  ip_hash          text,
  user_agent       text,
  created_at       timestamptz DEFAULT now()
);

-- Audit Logs ------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id    uuid REFERENCES auth.users(id),
  organisation_id  uuid REFERENCES public.organisations(id),
  event_type       text NOT NULL,
  entity_type      text,
  entity_id        uuid,
  event_data       jsonb DEFAULT ''::jsonb,
  created_at       timestamptz DEFAULT now()
);

-- Index on audit_logs for performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_event_type ON public.audit_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);

-- Helper functions ------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS public.user_role AS $$
DECLARE
  _role public.user_role;
BEGIN
  SELECT primary_role INTO _role
  FROM public.profiles
  WHERE id = auth.uid();
  RETURN COALESCE(_role, 'individual'::public.user_role);
END;
$$ LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = '';

CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS boolean AS $$
BEGIN
  RETURN public.current_user_role() = 'platform_admin'::public.user_role;
END;
$$ LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = '';

CREATE OR REPLACE FUNCTION public.is_organisation_member(target_organisation_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.organisation_members
    WHERE organisation_id = target_organisation_id
      AND user_id = auth.uid()
      AND membership_status = 'active'
  );
END;
$$ LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = '';

CREATE OR REPLACE FUNCTION public.is_organisation_admin(target_organisation_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.organisation_members
    WHERE organisation_id = target_organisation_id
      AND user_id = auth.uid()
      AND membership_role IN ('owner', 'admin')
      AND membership_status = 'active'
  );
END;
$$ LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = '';

CREATE OR REPLACE FUNCTION public.is_organisation_owner(target_organisation_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.organisation_members
    WHERE organisation_id = target_organisation_id
      AND user_id = auth.uid()
      AND membership_role = 'owner'
      AND membership_status = 'active'
  );
END;
$$ LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = '';

-- =============================================================================
-- ROW-LEVEL SECURITY
-- =============================================================================

-- Profiles RLS ----------------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS profiles_select_own ON public.profiles;
CREATE POLICY profiles_select_own ON public.profiles
  FOR SELECT
  USING (id = auth.uid() OR public.is_platform_admin());

DROP POLICY IF EXISTS profiles_update_own ON public.profiles;
CREATE POLICY profiles_update_own ON public.profiles
  FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (
    id = auth.uid()
    AND primary_role = (SELECT primary_role FROM public.profiles WHERE id = auth.uid())
    AND account_status = (SELECT account_status FROM public.profiles WHERE id = auth.uid())
  );

DROP POLICY IF EXISTS profiles_insert_trigger ON public.profiles;
CREATE POLICY profiles_insert_trigger ON public.profiles
  FOR INSERT
  WITH CHECK (true);

-- Organisations RLS -----------------------------------------------------------

ALTER TABLE public.organisations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS organisations_select_member ON public.organisations;
CREATE POLICY organisations_select_member ON public.organisations
  FOR SELECT
  USING (public.is_organisation_member(id) OR public.is_platform_admin());

DROP POLICY IF EXISTS organisations_insert_auth ON public.organisations;
CREATE POLICY organisations_insert_auth ON public.organisations
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS organisations_update_admin ON public.organisations;
CREATE POLICY organisations_update_admin ON public.organisations
  FOR UPDATE
  USING (public.is_organisation_admin(id))
  WITH CHECK (public.is_organisation_admin(id));

-- Organisation Members RLS ----------------------------------------------------

ALTER TABLE public.organisation_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS org_members_select_member ON public.organisation_members;
CREATE POLICY org_members_select_member ON public.organisation_members
  FOR SELECT
  USING (
    public.is_organisation_member(organisation_id)
    OR public.is_platform_admin()
  );

DROP POLICY IF EXISTS org_members_insert_auth ON public.organisation_members;
CREATE POLICY org_members_insert_auth ON public.organisation_members
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND auth.uid() = user_id
    AND membership_role NOT IN ('owner', 'admin')
  );

DROP POLICY IF EXISTS org_members_update_admin ON public.organisation_members;
CREATE POLICY org_members_update_admin ON public.organisation_members
  FOR UPDATE
  USING (public.is_organisation_admin(organisation_id))
  WITH CHECK (public.is_organisation_admin(organisation_id));

DROP POLICY IF EXISTS org_members_delete_admin ON public.organisation_members;
CREATE POLICY org_members_delete_admin ON public.organisation_members
  FOR DELETE
  USING (public.is_organisation_admin(organisation_id));

-- Consent Records RLS ---------------------------------------------------------

ALTER TABLE public.consent_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS consent_select_own ON public.consent_records;
CREATE POLICY consent_select_own ON public.consent_records
  FOR SELECT
  USING (user_id = auth.uid() OR public.is_platform_admin());

DROP POLICY IF EXISTS consent_insert_own ON public.consent_records;
CREATE POLICY consent_insert_own ON public.consent_records
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- No UPDATE or DELETE on consent_records (append-only)

-- Audit Logs RLS ---------------------------------------------------------------

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS audit_select_admin ON public.audit_logs;
CREATE POLICY audit_select_admin ON public.audit_logs
  FOR SELECT
  USING (public.is_platform_admin());

DROP POLICY IF EXISTS audit_insert_auth ON public.audit_logs;
CREATE POLICY audit_insert_auth ON public.audit_logs
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = actor_user_id);

-- No UPDATE or DELETE on audit_logs