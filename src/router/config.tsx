import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import AuthPage from "../pages/auth/page";
import PricingPage from "../pages/pricing/page";
import ChatPage from "../pages/chat/page";
import LegalPage from "../pages/legal/page";
import VerifyEmailPage from "../pages/verify-email/page";
import ForgotPasswordPage from "../pages/forgot-password/page";
import ResetPasswordPage from "../pages/reset-password/page";
import AuthCallbackPage from "../pages/auth/callback/page";
import OnboardingPage from "../pages/onboarding/page";
import AccountPendingPage from "../pages/account/pending/page";
import AccountSuspendedPage from "../pages/account/suspended/page";
import AccountDisabledPage from "../pages/account/disabled/page";
import DashboardOverview from "../pages/dashboard/page";
import DashboardShell from "../pages/dashboard/components/DashboardShell";
import ProfilePage from "../pages/dashboard/profile/page";
import SecurityPage from "../pages/dashboard/security/page";
import SettingsPage from "../pages/dashboard/settings/page";
import ManagerPage from "../pages/dashboard/manager/page";
import HRPage from "../pages/dashboard/hr/page";
import OrganisationPage from "../pages/dashboard/organisation/page";
import OrganisationAdminPage from "../pages/dashboard/organisation/admin/page";
import AdminPage from "../pages/admin/page";

import { RequireAuth } from "../auth/RequireAuth";
import { RequireRole } from "../auth/RequireRole";
import { PublicOnlyRoute } from "../auth/PublicOnlyRoute";

const routes: RouteObject[] = [
  // Public routes
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: (
      <PublicOnlyRoute>
        <AuthPage />
      </PublicOnlyRoute>
    ),
  },
  {
    path: "/pricing",
    element: <PricingPage />,
  },
  {
    path: "/legal",
    element: <LegalPage />,
  },

  // Auth flow routes (public)
  {
    path: "/verify-email",
    element: <VerifyEmailPage />,
  },
  {
    path: "/forgot-password",
    element: (
      <PublicOnlyRoute>
        <ForgotPasswordPage />
      </PublicOnlyRoute>
    ),
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
  {
    path: "/auth/callback",
    element: <AuthCallbackPage />,
  },

  // Account state routes
  {
    path: "/account/pending",
    element: <AccountPendingPage />,
  },
  {
    path: "/account/suspended",
    element: <AccountSuspendedPage />,
  },
  {
    path: "/account/disabled",
    element: <AccountDisabledPage />,
  },

  // Onboarding (protected — requires auth but before onboarding complete)
  {
    path: "/onboarding",
    element: (
      <RequireAuth>
        <OnboardingPage />
      </RequireAuth>
    ),
  },

  // Chat (protected)
  {
    path: "/chat",
    element: (
      <RequireAuth>
        <ChatPage />
      </RequireAuth>
    ),
  },

  // Dashboard shell with nested routes
  {
    path: "/dashboard",
    element: (
      <RequireAuth>
        <DashboardShell />
      </RequireAuth>
    ),
    children: [
      {
        index: true,
        element: <DashboardOverview />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "security",
        element: <SecurityPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
      {
        path: "manager",
        element: (
          <RequireRole
            allowedRoles={['manager', 'hr_professional', 'organisation_admin', 'platform_admin']}
          >
            <ManagerPage />
          </RequireRole>
        ),
      },
      {
        path: "hr",
        element: (
          <RequireRole
            allowedRoles={['hr_professional', 'organisation_admin', 'platform_admin']}
          >
            <HRPage />
          </RequireRole>
        ),
      },
      {
        path: "organisation",
        element: (
          <RequireRole
            allowedRoles={['manager', 'hr_professional', 'organisation_admin', 'platform_admin']}
          >
            <OrganisationPage />
          </RequireRole>
        ),
      },
      {
        path: "organisation/admin",
        element: (
          <RequireRole
            allowedRoles={['organisation_admin', 'platform_admin']}
            allowedMembershipRoles={['owner', 'admin']}
            requireOrganisation
          >
            <OrganisationAdminPage />
          </RequireRole>
        ),
      },
    ],
  },

  // Admin (outside dashboard shell)
  {
    path: "/admin",
    element: (
      <RequireRole allowedRoles={['platform_admin']}>
        <AdminPage />
      </RequireRole>
    ),
  },

  // 404
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;