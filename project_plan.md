# HR Voodoo

## 1. Project Description
HR Voodoo is a human resources platform that provides HR advice, resources, and personalized guidance. It streamlines HR processes and empowers both employees and managers. The platform serves as a one-stop destination for workplace-related questions, policy guidance, and professional development resources.

- **Target Users:** HR professionals, managers, and employees seeking HR guidance
- **Core Value:** Accessible, trustworthy HR advice and resources in one centralized platform

## 2. Page Structure
- `/` - Homepage (Hero, Advice Categories, Dashboard Preview, Testimonials, CTA)
- `/login` - Login / Sign Up (real Supabase auth)
- `/pricing` - Pricing page
- `/legal` - Terms & Privacy
- `/verify-email` - Email verification page
- `/forgot-password` - Password reset request
- `/reset-password` - Set new password
- `/auth/callback` - OAuth callback handler
- `/onboarding` - New user onboarding flow
- `/account/pending` - Verification pending state
- `/account/suspended` - Suspended account state
- `/account/disabled` - Disabled account state
- `/chat` - AI HR advice chat (protected)
- `/dashboard` - Dashboard overview (protected)
- `/dashboard/profile` - Profile edit (protected)
- `/dashboard/security` - Security & password (protected)
- `/dashboard/settings` - Settings & consents (protected)
- `/dashboard/manager` - Manager dashboard (role-protected)
- `/dashboard/hr` - HR dashboard (role-protected)
- `/dashboard/organisation` - Organisation view (role-protected)
- `/dashboard/organisation/admin` - Organisation admin (role-protected)
- `/admin` - Platform admin (role-protected)
- `/categories` - Advice Categories Listing (future)
- `/category/:id` - Category Detail with articles & resources (future)

## 3. Core Features
- [x] Homepage with hero section
- [x] Advice categories grid with quick access
- [x] Personalized dashboard preview showcase
- [x] User testimonials section
- [x] Newsletter subscription
- [x] User authentication (Supabase — real auth)
- [x] Email verification flow
- [x] Password reset flow
- [x] OAuth (Google, Microsoft)
- [x] User profiles with role-based access
- [x] Role-protected routes (manager, HR, admin)
- [x] Organisation foundations (tables + membership)
- [x] Consent records (append-only, versioned)
- [x] Audit logging foundations
- [x] Protected dashboard shell with sidebar
- [x] Profile editing
- [x] Security page (password change, sessions)
- [x] Settings page (language, timezone, consents)
- [x] Onboarding flow (usage, location, consent)
- [x] Account state pages (pending, suspended, disabled)
- [ ] Full AI chat integration (Readdy Agent)
- [ ] Category detail pages with articles
- [ ] Saved advice / bookmarks
- [ ] Organisation member management UI
- [ ] Stripe payment integration

## 4. Data Model Design

### Table: profiles
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | PK, FK to auth.users |
| email | text | User email |
| full_name | text | Full name |
| display_name | text | Display name |
| phone | text | Phone number |
| job_title | text | Job title |
| avatar_url | text | Avatar URL |
| primary_role | user_role | Role (default: individual) |
| account_status | account_status | Account status |
| preferred_language | text | Language preference |
| jurisdiction_country | text | Country |
| jurisdiction_region | text | Region |
| timezone | text | Timezone |
| onboarding_completed | boolean | Onboarding done |
| terms_accepted_at | timestamptz | Terms acceptance time |
| privacy_accepted_at | timestamptz | Privacy acceptance time |
| marketing_consent | boolean | Marketing consent |
| last_login_at | timestamptz | Last login |
| created_at | timestamptz | Created |
| updated_at | timestamptz | Updated |

### Table: organisations
### Table: organisation_members
### Table: consent_records
### Table: audit_logs

(See migration file for full details)

## 5. Backend / Third-party Integration Plan
- Supabase: Connected — handles auth, profiles, organisations, consent, audit logging
- Readdy Agent: Plan to integrate AI chat for HR advice
- Stripe: Future phase for paid subscriptions
- Newsletter: Via Readdy Forms

## 6. Development Phase Plan

### Phase 1: Homepage ✅
- Goal: Build complete, visually rich homepage
- Deliverable: Hero, categories, dashboard preview, testimonials, CTA, footer
- Status: Complete

### Phase 2A: Supabase Auth & Security Foundation ✅
- Goal: Real authentication, role system, protected routes, security foundation
- Deliverable: Supabase client, auth pages, dashboard shell, profiles, RLS, audit logging
- Status: Complete

### Phase 3: AI Chat Integration
- Goal: Connect real AI chat via Readdy Agent
- Deliverable: Working AI HR advisor with real responses

### Phase 4: Organisation & Content Pages
- Goal: Organisation management UI and category detail pages
- Deliverable: Org admin, member management, article pages, search