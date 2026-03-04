import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyCTxL-15gcm-dgYPoT3netrpvuUSd4gNdY",
    authDomain: "ai-cancer-prediction.firebaseapp.com",
    projectId: "ai-cancer-prediction",
    storageBucket: "ai-cancer-prediction.firebasestorage.app",
    messagingSenderId: "803661300404",
    appId: "1:803661300404:web:3e30253faa4a85d4e3cde1",
};

// Prevent re-initialization on Expo hot reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Use require to bypass TypeScript type gap — getReactNativePersistence exists
// at runtime in the React Native Firebase bundle but is not in the TS typings
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getReactNativePersistence } = require('firebase/auth');

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);

export default app;
