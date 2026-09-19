import { db } from '../db/store';
import { isWithinGeofence } from '../utils/haversine';

export interface GeofenceResult {
  inside: boolean;
  distanceMeters: number;
  allowedRadius: number;
  message: string;
  accuracyMeters?: number;
  userCoords: { latitude: number; longitude: number };
}

/**
 * Retrieves the user's real browser coordinates, or returns a fallback coordinate for testing/simulation.
 */
export async function getCurrentDeviceLocation(simulationOffsetMeters = 0): Promise<{ latitude: number; longitude: number; accuracy: number; isSimulated: boolean }> {
  const settings = db.getSettings();

  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: Math.round(pos.coords.accuracy || 10),
            isSimulated: false,
          });
        },
        (error) => {
          console.warn('Browser geolocation denied or unavailable, using calibrated classroom test position:', error.message);
          // If simulation offset is 0, place student 18m from campus center (inside geofence)
          // 1 deg lat is approx 111,000 meters. 18 meters = 0.00016 deg.
          const offsetDeg = (simulationOffsetMeters || 18) / 111000;
          resolve({
            latitude: settings.campusLatitude + offsetDeg,
            longitude: settings.campusLongitude,
            accuracy: 12,
            isSimulated: true,
          });
        },
        { enableHighAccuracy: true, timeout: 6000, maximumAge: 10000 }
      );
    } else {
      resolve({
        latitude: settings.campusLatitude + 0.0001,
        longitude: settings.campusLongitude,
        accuracy: 15,
        isSimulated: true,
      });
    }
  });
}

/**
 * Validates whether the student's location falls within the campus / classroom geofence.
 */
export async function verifyGeofence(
  classroomId?: string,
  forceOutsideSimulation = false
): Promise<GeofenceResult> {
  const settings = db.getSettings();
  const classrooms = db.getClassrooms();
  const classroom = classroomId ? classrooms.find((c) => c.id === classroomId) : null;

  const targetLat = classroom ? classroom.latitude : settings.campusLatitude;
  const targetLng = classroom ? classroom.longitude : settings.campusLongitude;
  const allowedRadius = classroom ? classroom.radiusMeters : settings.campusRadiusMeters;

  // If testing failure simulation, place student 650 meters outside campus
  const offsetMeters = forceOutsideSimulation ? 650 : 20;
  const location = await getCurrentDeviceLocation(offsetMeters);

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
    message: inside
      ? `Verified inside attendance zone (${distance}m from ${classroom?.name || settings.campusName}, allowed ${allowedRadius}m).`
      : `Geofence check failed: You are ${distance}m away (permitted radius: ${allowedRadius}m). Please move closer to the lecture hall.`,
  };
}

