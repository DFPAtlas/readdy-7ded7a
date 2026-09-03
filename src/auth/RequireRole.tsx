import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import type { UserRole, OrganisationMember, MembershipRole } from '@/lib/supabase/types';
import type { ReactNode } from 'react';

interface RequireRoleProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  allowedMembershipRoles?: MembershipRole[];
  requireOrganisation?: boolean;
}

export function RequireRole({
  children,
  allowedRoles,
  allowedMembershipRoles,
  requireOrganisation = false,
}: RequireRoleProps) {
  const { isAuthenticated, isLoading, role, organisationMemberships } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-50 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requireOrganisation && organisationMemberships.length === 0) {
    return <Navigate to="/dashboard" replace />;
  }

  if (allowedMembershipRoles && allowedMembershipRoles.length > 0) {
    const hasValidMembership = organisationMemberships.some((m: OrganisationMember) =>
      allowedMembershipRoles.includes(m.membership_role),
    );

    if (!hasValidMembership) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
}