import { supabase } from './client';
import type { AuditEventType } from './types';

interface AuditLogPayload {
  event_type: AuditEventType;
  entity_type?: string;
  entity_id?: string;
  event_data?: Record<string, unknown>;
  organisation_id?: string;
}

export async function writeAuditLog(payload: AuditLogPayload): Promise<void> {
  if (!supabase) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { error } = await supabase.from('audit_logs').insert({
    actor_user_id: user.id,
    event_type: payload.event_type,
    entity_type: payload.entity_type || null,
    entity_id: payload.entity_id || null,
    event_data: payload.event_data || {},
    organisation_id: payload.organisation_id || null,
  });

  if (error) {
    console.error('Error writing audit log:', error.message);
  }
}

export async function recordLoginAudit(): Promise<void> {
  if (!supabase) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase.from('profiles').update({ last_login_at: new Date().toISOString() }).eq('id', user.id);

  await writeAuditLog({
    event_type: 'login_success',
    entity_type: 'profile',
    entity_id: user.id,
    event_data: { email: user.email },
  });
}

export async function recordLogoutAudit(): Promise<void> {
  await writeAuditLog({ event_type: 'logout' });
}