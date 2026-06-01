import { initializeApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

/**
 * Firebase Configuration - Cloudflare Pages
 * 
 * BẮT BUỘC phải dùng Environment Variables trong production.
 * Không còn fallback hardcoded để tránh lộ key.
 */
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
];

const missingVars = requiredEnvVars.filter(
  (key) => !import.meta.env[key]
);

if (import.meta.env.PROD && missingVars.length > 0) {
  const errorMsg = `[Firebase] Thiếu Environment Variables: ${missingVars.join(', ')}. 
  Vui lòng cấu hình đầy đủ trong Cloudflare Pages → Settings → Environment Variables.`;
  
  console.error(errorMsg);
  throw new Error(errorMsg);
}

// Lấy config từ Environment Variables (bắt buộc trong production)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo Firestore
export const db: Firestore = getFirestore(app);

// Cảnh báo nhẹ trong development nếu chưa có env
if (!import.meta.env.PROD && missingVars.length > 0) {
  console.warn(
    `[Firebase] Đang chạy ở chế độ Development và thiếu một số biến môi trường: ${missingVars.join(', ')}. 
    Sẽ dùng giá trị mặc định (nếu có).`
  );
}