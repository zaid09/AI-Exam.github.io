// ===== FIREBASE CONFIGURATION =====
// 🔧 Instructions to set up Firebase:
// 1. Go to https://console.firebase.google.com/
// 2. Click "Add project" → Enter project name → Create
// 3. Click "Build" → "Realtime Database" → "Create Database"
// 4. Choose location → Start in TEST mode → Enable
// 5. Go to Project Settings (gear icon) → "Add app" → Web (</> icon)
// 6. Copy the firebaseConfig values below
// 7. Replace the placeholder values with your actual Firebase config

export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
