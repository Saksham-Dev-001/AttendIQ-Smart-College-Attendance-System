export interface FaceVerificationResult {
  verified: boolean;
  livenessPassed: boolean;
  matchScore: number;
  message: string;
}

export type LivenessChallenge =
  | 'blink'
  | 'smile'
  | 'turn_head';

export const LIVENESS_PROMPTS: Record<LivenessChallenge, { title: string; instruction: string; icon: string }> = {
  blink: {
    title: 'Blink Challenge',
    instruction: 'Please blink both eyes naturally now',
    icon: '👀',
  },
  smile: {
    title: 'Expression Challenge',
    instruction: 'Please give a slight smile to the camera',
    icon: '😊',
  },
  turn_head: {
    title: 'Head Movement Challenge',
    instruction: 'Please turn your head slightly to the right',
    icon: '🔄',
  },
};

export function getRandomLivenessChallenge(): LivenessChallenge {
  const challenges: LivenessChallenge[] = ['blink', 'smile', 'turn_head'];
  return challenges[Math.floor(Math.random() * challenges.length)];
}

export async function requestCameraStream(): Promise<MediaStream | null> {
  try {
    if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      return await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });
    }
    return null;
  } catch (err) {
    console.warn('Camera access denied or unavailable:', err);
    return null;
  }
}

export function stopCameraStream(stream: MediaStream | null) {
  if (!stream) return;
  try {
    stream.getTracks().forEach((track) => track.stop());
  } catch (err) {
    console.error('Error stopping camera stream:', err);
  }
}

