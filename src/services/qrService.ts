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

export function validateQrToken(token: string): {
  valid: boolean;
  message: string;
  sessionId?: string;
  tokenVersion?: number;
} {
  const parsed = parseSessionToken(token);
  if (!parsed.isValid || !parsed.sessionId) {
    return { valid: false, message: 'Invalid QR Code format or corrupt token.' };
  }

  const session = db.getActiveSession(parsed.sessionId);
  if (!session) {
    return { valid: false, message: 'The attendance session for this QR code is either closed or does not exist.' };
  }

  // Check if session expired
  if (new Date() > new Date(session.expiresAt)) {
    return { valid: false, message: 'This attendance session has already expired.' };
  }

  // Check QR version freshness (allow current version or at most 1 version prior for grace period)
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

