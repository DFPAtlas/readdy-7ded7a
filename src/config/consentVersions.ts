export const CONSENT_VERSIONS = {
  terms: 'terms-v1',
  privacy: 'privacy-v1',
  marketing: 'marketing-v1',
  ai_processing: 'ai-processing-v1',
} as const;

export const CONSENT_DISPLAY_NAMES: Record<string, string> = {
  'terms-v1': 'Terms of Service v1',
  'privacy-v1': 'Privacy Policy v1',
  'marketing-v1': 'Marketing Communications Consent v1',
  'ai-processing-v1': 'AI Processing Consent v1',
};