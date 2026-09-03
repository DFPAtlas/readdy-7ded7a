import { useEffect, useState, useCallback, type ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { fetchProfile } from '@/lib/supabase/profiles';
import { fetchOrganisationMemberships } from '@/lib/supabase/organisations';
import { AuthContext } from './useAuth';
import type { AuthState } from './useAuth';

const NOT_CONNECTED_ERROR = 'Authentication is not configured yet. Please connect Supabase to enable login and account features.';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState(null);
  const [organisationMemberships, setOrganisationMemberships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const isConnected = supabase !== null;

  const loadProfile = useCallback(async (userId: string) => {
    if (!isConnected) return null;
    const prof = await fetchProfile(userId);
    setProfile(prof);
    return prof;
  }, [isConnected]);

  const loadMemberships = useCallback(async (userId: string) => {
    if (!isConnected) return;
    const memberships = await fetchOrganisationMemberships(userId);
    setOrganisationMemberships(memberships);
  }, [isConnected]);

  const refreshProfile = useCallback(async () => {
    if (!supabase) return;
    const currentUser = (await supabase.auth.getUser()).data.user;
    if (currentUser) {
      await loadProfile(currentUser.id);
      await loadMemberships(currentUser.id);
    }
  }, [loadProfile, loadMemberships]);

  const signIn = useCallback(
    async (_email: string, _password: string): Promise<{ error: string | null }> => {
      if (!supabase) return { error: NOT_CONNECTED_ERROR };

      const { data, error } = await supabase.auth.signInWithPassword({ email: _email, password: _password });

      if (error) {
        return { error: mapAuthError(error.message) };
      }

      if (data.user) {
        const prof = await loadProfile(data.user.id);

        if (!prof) {
          await supabase.auth.signOut();
          return { error: 'Account profile not found. Please contact support.' };
        }

        const status = prof.account_status;
        if (status === 'suspended' || status === 'disabled' || status === 'deleted') {
          await supabase.auth.signOut();
          const statusMessages: Record<string, string> = {
            suspended: 'Your account has been suspended. Please contact support for assistance.',
            disabled: 'Your account has been disabled. Please contact support.',
            deleted: 'This account has been deleted.',
          };
          return { error: statusMessages[status] || 'Your account is not active.' };
        }

        await loadMemberships(data.user.id);
      }

      return { error: null };
    },
    [loadProfile, loadMemberships],
  );

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      fullName: string,
      marketingConsent: boolean,
    ): Promise<{ error: string | null; needsVerification: boolean }> => {
      if (!supabase) return { error: NOT_CONNECTED_ERROR, needsVerification: false };

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });

      if (error) {
        return { error: mapAuthError(error.message), needsVerification: false };
      }

      if (data.user) {
        const { error: consentError } = await supabase.from('consent_records').insert([
          {
            user_id: data.user.id,
            consent_type: 'terms',
            consent_version: 'terms-v1',
            granted: true,
            source: 'registration',
            user_agent: navigator.userAgent,
          },
          {
            user_id: data.user.id,
            consent_type: 'privacy',
            consent_version: 'privacy-v1',
            granted: true,
            source: 'registration',
            user_agent: navigator.userAgent,
          },
        ]);

        if (!consentError && marketingConsent) {
          await supabase.from('consent_records').insert({
            user_id: data.user.id,
            consent_type: 'marketing',
            consent_version: 'marketing-v1',
            granted: true,
            source: 'registration',
            user_agent: navigator.userAgent,
          });
        }
      }

      const needsVerification =
        data.user?.identities?.length === 0 || !data.session;

      return { error: null, needsVerification };
    },
    [],
  );

  const signInWithOAuth = useCallback(async (provider: 'google' | 'azure') => {
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }, []);

  const signOut = useCallback(async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setProfile(null);
    setOrganisationMemberships([]);
  }, []);

  const resetPassword = useCallback(
    async (email: string): Promise<{ error: string | null }> => {
      if (!supabase) return { error: NOT_CONNECTED_ERROR };

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { error: mapAuthError(error.message) };
      }

      return { error: null };
    },
    [],
  );

  const updatePassword = useCallback(
    async (newPassword: string): Promise<{ error: string | null }> => {
      if (!supabase) return { error: NOT_CONNECTED_ERROR };

      const { error } = await supabase.auth.updateUser({ password: newPassword });

      if (error) {
        return { error: mapAuthError(error.message) };
      }

      await refreshProfile();
      return { error: null };
    },
    [refreshProfile],
  );

  const resendVerificationEmail = useCallback(async (): Promise<{ error: string | null }> => {
    if (!supabase) return { error: NOT_CONNECTED_ERROR };

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: user?.email ?? '',
    });

    if (error) {
      return { error: mapAuthError(error.message) };
    }

    return { error: null };
  }, [user]);

  useEffect(() => {
    // If Supabase is not connected, skip auth init entirely
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    let mounted = true;

    const initAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;

        const currentSession = data.session;
        setSession(currentSession);

        if (currentSession?.user) {
          setUser(currentSession.user);
          const prof = await loadProfile(currentSession.user.id);
          if (prof) {
            await loadMemberships(currentSession.user.id);
          }
        }
      } catch {
        // Silently handle init errors
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!mounted) return;

        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (event === 'SIGNED_IN' && currentSession?.user) {
          const prof = await loadProfile(currentSession.user.id);
          if (prof) {
            await loadMemberships(currentSession.user.id);
          }
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
          setOrganisationMemberships([]);
        } else if (event === 'USER_UPDATED' && currentSession?.user) {
          const prof = await loadProfile(currentSession.user.id);
          if (prof) {
            await loadMemberships(currentSession.user.id);
          }
        }
      },
    );

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [loadProfile, loadMemberships]);

  const isAuthenticated = isConnected && !!user && !!profile;
  const isEmailVerified = !!user?.email_confirmed_at;
  const role = profile?.primary_role ?? null;

  const value: AuthState = {
    user,
    session,
    profile,
    role,
    organisationMemberships,
    isLoading,
    isAuthenticated,
    isEmailVerified,
    signIn,
    signUp,
    signInWithOAuth,
    signOut,
    resetPassword,
    updatePassword,
    refreshProfile,
    resendVerificationEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function mapAuthError(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes('invalid login credentials') || lower.includes('invalid email or password')) {
    return 'Invalid email or password. Please try again.';
  }
  if (lower.includes('email not confirmed') || lower.includes('email not verified')) {
    return 'Please verify your email address before signing in. Check your inbox for the verification link.';
  }
  if (lower.includes('user already registered') || lower.includes('already exists')) {
    return 'An account with this email already exists. Please sign in instead.';
  }
  if (lower.includes('password') && lower.includes('weak')) {
    return 'Please choose a stronger password. Use at least 10 characters with uppercase, lowercase, and numbers.';
  }
  if (lower.includes('rate limit') || lower.includes('too many')) {
    return 'Too many attempts. Please wait a moment and try again.';
  }
  if (lower.includes('network') || lower.includes('fetch')) {
    return 'A network error occurred. Please check your connection and try again.';
  }

  return 'An unexpected error occurred. Please try again.';
}