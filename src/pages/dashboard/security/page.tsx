import { useState } from 'react';
import { useAuth } from '@/auth/useAuth';
import { writeAuditLog } from '@/lib/supabase/audit';
import { useNavigate } from 'react-router-dom';

export default function SecurityPage() {
  const { profile, updatePassword, signOut } = useAuth();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  if (!profile) return null;

  const validatePassword = () => {
    const errors: Record<string, string> = {};
    if (!currentPassword) errors.currentPassword = 'Current password is required.';
    if (newPassword.length < 10) errors.newPassword = 'Password must be at least 10 characters.';
    if (!/[A-Z]/.test(newPassword)) errors.newPassword = 'Password must contain an uppercase letter.';
    if (!/[a-z]/.test(newPassword)) errors.newPassword = 'Password must contain a lowercase letter.';
    if (!/[0-9]/.test(newPassword)) errors.newPassword = 'Password must contain a number.';
    if (newPassword !== confirmPassword) errors.confirmPassword = 'Passwords do not match.';
    return errors;
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validatePassword();
    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    setMessage(null);

    const result = await updatePassword(newPassword);
    if (result.error) {
      setMessage({ type: 'error', text: result.error });
    } else {
      await writeAuditLog({
        event_type: 'password_updated',
        entity_type: 'profile',
        entity_id: profile.id,
      });
      setMessage({ type: 'success', text: 'Password updated successfully.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
    setSaving(false);
  };

  const handleSignOutAll = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="p-6 md:p-10 max-w-2xl">
      <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground-950 mb-1">Security</h1>
      <p className="text-foreground-500 text-sm mb-8">Manage your account security settings.</p>

      {message && (
        <div
          className={`mb-6 p-3 rounded-lg text-sm font-medium ${
            message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}
          role="alert"
          aria-live="polite"
        >
          {message.text}
        </div>
      )}

      {/* Account info */}
      <div className="bg-white border border-background-200/70 rounded-xl p-6 mb-6">
        <h2 className="font-heading text-lg font-bold text-foreground-950 mb-4">Account Information</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-foreground-500">Email</span>
            <span className="text-foreground-900 font-medium">{profile.email}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-foreground-500">Verification Status</span>
            <span className={`font-medium ${profile.account_status === 'active' ? 'text-green-600' : 'text-amber-600'}`}>
              {profile.account_status === 'active' ? 'Verified' : 'Pending'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-foreground-500">Account Status</span>
            <span className="text-foreground-900 font-medium capitalize">{profile.account_status.replace(/_/g, ' ')}</span>
          </div>
          {profile.last_login_at && (
            <div className="flex justify-between items-center">
              <span className="text-foreground-500">Last Login</span>
              <span className="text-foreground-900 font-medium">
                {new Date(profile.last_login_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Password change */}
      <div className="bg-white border border-background-200/70 rounded-xl p-6 mb-6">
        <h2 className="font-heading text-lg font-bold text-foreground-950 mb-4">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-foreground-700 text-sm font-medium mb-1.5">Current Password</label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2.5 pr-10 rounded-lg border border-background-200 bg-background-50 text-foreground-900 text-sm focus:outline-none focus:border-accent-500/50 transition-colors"
                aria-label="Current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-400 hover:text-foreground-600 cursor-pointer"
                aria-label={showCurrent ? 'Hide password' : 'Show password'}
              >
                <i className={`text-lg ${showCurrent ? 'ri-eye-off-line' : 'ri-eye-line'}`}></i>
              </button>
            </div>
            {validationErrors.currentPassword && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.currentPassword}</p>
            )}
          </div>

          <div>
            <label className="block text-foreground-700 text-sm font-medium mb-1.5">New Password</label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2.5 pr-10 rounded-lg border border-background-200 bg-background-50 text-foreground-900 text-sm focus:outline-none focus:border-accent-500/50 transition-colors"
                aria-label="New password"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-400 hover:text-foreground-600 cursor-pointer"
                aria-label={showNew ? 'Hide password' : 'Show password'}
              >
                <i className={`text-lg ${showNew ? 'ri-eye-off-line' : 'ri-eye-line'}`}></i>
              </button>
            </div>
            {validationErrors.newPassword && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.newPassword}</p>
            )}
            <p className="text-foreground-400 text-xs mt-1">Minimum 10 characters with uppercase, lowercase, and numbers.</p>
          </div>

          <div>
            <label className="block text-foreground-700 text-sm font-medium mb-1.5">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 pr-10 rounded-lg border border-background-200 bg-background-50 text-foreground-900 text-sm focus:outline-none focus:border-accent-500/50 transition-colors"
                aria-label="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-400 hover:text-foreground-600 cursor-pointer"
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                <i className={`text-lg ${showConfirm ? 'ri-eye-off-line' : 'ri-eye-line'}`}></i>
              </button>
            </div>
            {validationErrors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-lg bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
          >
            {saving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
            {saving ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Sessions */}
      <div className="bg-white border border-background-200/70 rounded-xl p-6">
        <h2 className="font-heading text-lg font-bold text-foreground-950 mb-4">Sessions</h2>
        <p className="text-sm text-foreground-500 mb-4">
          Sign out of all sessions to protect your account if you suspect unauthorized access.
        </p>
        <button
          onClick={handleSignOutAll}
          className="px-5 py-2.5 rounded-lg border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2"
        >
          <i className="ri-logout-box-r-line"></i>
          Sign Out Everywhere
        </button>
      </div>
    </div>
  );
}