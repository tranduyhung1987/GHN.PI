import { initializeApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

// Hỗ trợ Environment Variables (Vite) + Fallback hardcoded (cho dev nhanh)
// Khuyến nghị: Đặt các biến VITE_FIREBASE_* trên Vercel khi deploy production
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD5OVC-EAYpziBl3lqwBOL5iARUPdkw41U",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ghn-pi.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ghn-pi",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ghn-pi.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "282414858814",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:282414858814:web:d0f56ea2a67d1d7e0a476f",
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo Firestore
export const db: Firestore = getFirestore(app);

// Log cảnh báo nếu đang dùng config mặc định trong production
if (import.meta.env.PROD && !import.meta.env.VITE_FIREBASE_API_KEY) {
  console.warn('[Firebase] Đang dùng config hardcoded trong production. Khuyến nghị dùng Environment Variables.');
}