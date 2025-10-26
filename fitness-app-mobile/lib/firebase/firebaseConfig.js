// Firebase config for Expo/React Native (no analytics)
import { initializeApp } from 'firebase/app';

// In Expo, prefer EXPO_PUBLIC_* env vars. Provide these in your env or app config.
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_MEASUREMENT_ID,
};

// Initialize Firebase app (safe even if analytics is unavailable)
const app = initializeApp(firebaseConfig);

export default app;
