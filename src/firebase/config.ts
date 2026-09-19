/**
 * AttendIQ — Firebase Cloud Configuration Bridge
 *
 * Currently, AttendIQ runs with an in-memory & LocalStorage reactive store that
 * mirrors Cloud Firestore collections and real-time listeners 1:1.
 *
 * WHEN READY TO CONNECT TO LIVE FIREBASE:
 * 1. Install firebase: `npm install firebase`
 * 2. Create a Firebase project in console.firebase.google.com
 * 3. Replace the placeholder config below with your Firebase Web App credentials.
 * 4. Set `USE_FIREBASE_CLOUD = true`.
 */

export const USE_FIREBASE_CLOUD = false;

export const firebaseConfig = {
  apiKey: "AIzaSyYOUR_API_KEY_HERE",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};

