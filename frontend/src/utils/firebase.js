import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// ─────────────────────────────────────────────────────────────────────────────
// Nuvera Naturals Web App Firebase Configuration
// ─────────────────────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyAAoYd_mb-feA7s-U5zP7IjqVsOxOrZ-Nw",
  authDomain: "nuvera-natural-e11ca.firebaseapp.com",
  projectId: "nuvera-natural-e11ca",
  storageBucket: "nuvera-natural-e11ca.firebasestorage.app",
  messagingSenderId: "264856507109",
  appId: "1:264856507109:web:31874eba528affbd913a0c",
  measurementId: "G-FPEQ6RYF1Q"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
