/**
 * Generates an unpredictable short-lived dynamic QR token for an active attendance session.
 */
export function generateDynamicSessionToken(sessionId: string, version: number): string {
  const timestamp = Math.floor(Date.now() / 1000);
  const entropy = Math.random().toString(36).substring(2, 8).toUpperCase();
  // Pack structured token: AIQ:<sessionId>:<version>:<timestamp>:<entropy>
  return `AIQ_${sessionId}_v${version}_${timestamp}_${entropy}`;
}

/**
 * Parses and verifies basic structure of a dynamic QR token.
 */
export function parseSessionToken(token: string): {
  isValid: boolean;
  sessionId?: string;
  version?: number;
  timestamp?: number;
} {
  try {
    if (!token || !token.startsWith('AIQ_')) {
      return { isValid: false };
    }
    const parts = token.split('_');
    if (parts.length < 5) {
      return { isValid: false };
    }
    const sessionId = parts[1];
    const version = parseInt(parts[2].replace('v', ''), 10);
    const timestamp = parseInt(parts[3], 10);

    return {
      isValid: true,
      sessionId,
      version,
      timestamp,
    };
  } catch {
    return { isValid: false };
  }
}

