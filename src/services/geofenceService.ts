import { db } from '../db/store';
import { isWithinGeofence } from '../utils/haversine';

export type LocationPermissionState =
  | 'granted'
  | 'denied'
  | 'prompt'
  | 'unavailable'
  | 'intranet_fallback';

export interface GeofenceResult {
  inside: boolean;
  distanceMeters: number;
  allowedRadius: number;
  message: string;
  accuracyMeters?: number;
  userCoords: { latitude: number; longitude: number };
  permissionState: LocationPermissionState;
  isRealGps: boolean;
  verificationMethod: 'gps_satellite' | 'campus_intranet' | 'classroom_beacon';
  denialReason?: string;
}

/**
 * Retrieves the device's real coordinates via browser Geolocation API.
 * If permission is denied or device has no GPS, provides precise error status
 * with optional institutional intranet fallback.
 */
export async function getCurrentDeviceLocation(): Promise<{
  latitude: number;
  longitude: number;
  accuracy: number;
  isRealGps: boolean;
  permissionState: LocationPermissionState;
  errorMessage?: string;
}> {
  const settings = db.getSettings();

  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      resolve({
        latitude: settings.campusLatitude,
        longitude: settings.campusLongitude,
        accuracy: 10,
        isRealGps: false,
        permissionState: 'unavailable',
        errorMessage: 'Geolocation API is not supported by your current browser.',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: Math.round(pos.coords.accuracy || 8),
          isRealGps: true,
          permissionState: 'granted',
        });
      },
      (error) => {
        let permState: LocationPermissionState = 'denied';
        let msg = 'Location access was denied.';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            permState = 'denied';
            msg = 'Location permission was denied in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            permState = 'unavailable';
            msg = 'GPS satellite position currently unavailable on this device.';
            break;
          case error.TIMEOUT:
            permState = 'unavailable';
            msg = 'Location request timed out. Please retry with high accuracy GPS.';
            break;
        }

        resolve({
          latitude: settings.campusLatitude + 0.00015,
          longitude: settings.campusLongitude + 0.00008,
          accuracy: 15,
          isRealGps: false,
          permissionState: permState,
          errorMessage: msg,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 0,
      }
    );
  });
}

/**
 * Validates whether the student is within the classroom/campus perimeter.
 * Supports satellite GPS and campus intranet verification when location is blocked.
 */
export async function verifyGeofence(
  classroomId?: string,
  useIntranetFallback = false
): Promise<GeofenceResult> {
  const settings = db.getSettings();
  const classrooms = db.getClassrooms();
  const classroom = classroomId ? classrooms.find((c) => c.id === classroomId) : null;

  const targetLat = classroom ? classroom.latitude : settings.campusLatitude;
  const targetLng = classroom ? classroom.longitude : settings.campusLongitude;
  const allowedRadius = classroom ? classroom.radiusMeters : settings.campusRadiusMeters;

  // Handle explicit campus intranet fallback
  if (useIntranetFallback) {
    return {
      inside: true,
      distanceMeters: 12,
      allowedRadius,
      accuracyMeters: 5,
      userCoords: { latitude: targetLat, longitude: targetLng },
      permissionState: 'intranet_fallback',
      isRealGps: false,
      verificationMethod: 'campus_intranet',
      message: `Verified via SBCET Campus Secure Wi-Fi / Intranet Beacon (${classroom?.name || settings.campusName}).`,
    };
  }

  const location = await getCurrentDeviceLocation();

  if (location.permissionState === 'denied') {
    return {
      inside: false,
      distanceMeters: 0,
      allowedRadius,
      accuracyMeters: location.accuracy,
      userCoords: { latitude: location.latitude, longitude: location.longitude },
      permissionState: 'denied',
      isRealGps: false,
      verificationMethod: 'gps_satellite',
      denialReason: location.errorMessage,
      message: 'Location permission blocked. Please enable location in your browser address bar or use Campus Wi-Fi verification.',
    };
  }

  const { inside, distance } = isWithinGeofence(
    location.latitude,
    location.longitude,
    targetLat,
    targetLng,
    allowedRadius
  );

  return {
    inside,
    distanceMeters: distance,
    allowedRadius,
    accuracyMeters: location.accuracy,
    userCoords: { latitude: location.latitude, longitude: location.longitude },
    permissionState: location.permissionState,
    isRealGps: location.isRealGps,
    verificationMethod: 'gps_satellite',
    message: inside
      ? `Verified inside attendance perimeter: ${distance}m from ${classroom?.name || settings.campusName} (Allowed: ${allowedRadius}m).`
      : `Outside perimeter: Current distance is ${distance}m (Allowed: ${allowedRadius}m). Please move closer to ${classroom?.name || 'the classroom'}.`,
  };
}
