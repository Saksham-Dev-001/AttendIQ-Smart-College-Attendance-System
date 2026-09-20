import QRCode from 'qrcode';
import { parseSessionToken } from '../utils/crypto';
import { db } from '../db/store';

export async function generateQrDataUrl(token: string): Promise<string> {
  try {
    return await QRCode.toDataURL(token, {
      width: 320,
      margin: 2,
      color: {
        dark: '#1e1b4b',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    });
  } catch (err) {
    console.error('QR generation error:', err);
    throw err;
  }
}

/**
 * Validates either a full dynamic QR payload (from scanner) or a manual short token code.
 * Enforces session status, expiration check, and rotation freshness window.
 */
export function validateQrToken(rawToken: string): {
  valid: boolean;
  message: string;
  sessionId?: string;
  tokenVersion?: number;
} {
  const token = (rawToken || '').trim();
  if (!token) {
    return { valid: false, message: 'Please provide a valid attendance token.' };
  }

  // 1. Try parsing full structured token: AIQ_<sessionId>_v<version>_<timestamp>_<entropy>
  const parsed = parseSessionToken(token);
  if (parsed.isValid && parsed.sessionId) {
    const session = db.getActiveSession(parsed.sessionId);
    if (!session) {
      return { valid: false, message: 'The attendance session for this QR code is either closed or does not exist.' };
    }

    if (new Date() > new Date(session.expiresAt)) {
      return { valid: false, message: 'This attendance session has already expired.' };
    }

    // Check QR version freshness (allow current version or at most 1 version prior for rotation grace period)
    if (session.qrVersion - (parsed.version || 0) > 1) {
      return { valid: false, message: 'This QR code screenshot has expired. Please scan the current live QR on the teacher screen.' };
    }

    return {
      valid: true,
      message: 'QR Code verified successfully.',
      sessionId: session.id,
      tokenVersion: parsed.version,
    };
  }

  // 2. Flexible fallback: Match active session by full token, ID, or 6-char entropy suffix
  const cleanInput = token.toUpperCase();
  const activeSessions = db.getSessions().filter(
    (s) => s.status === 'active' && new Date() < new Date(s.expiresAt)
  );

  const matched = activeSessions.find(
    (s) =>
      s.id.toUpperCase() === cleanInput ||
      s.currentQrToken.toUpperCase() === cleanInput ||
      s.currentQrToken.toUpperCase().endsWith(`_${cleanInput}`)
  );

  if (matched) {
    return {
      valid: true,
      message: 'Token verified successfully.',
      sessionId: matched.id,
      tokenVersion: matched.qrVersion,
    };
  }

  return {
    valid: false,
    message: 'Invalid or expired attendance QR token. Please verify the active code on the classroom display.',
  };
}
