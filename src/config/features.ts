/**
 * Features that need the backend. While a flag is false the screens and tabs
 * for it are hidden, so nobody sees a chat that cannot answer.
 */
export const features = {
  /** AI tutor for learners and parent-to-tutor messages. Needs the server. */
  tutorChat: false,
  /** Weekly report on WhatsApp. Needs the server. */
  whatsappReports: false,
} as const;

/** Where parents manage billing. Payments live on the website, not in the app. */
export const WEB_ACCOUNT_URL: string | null = null;
