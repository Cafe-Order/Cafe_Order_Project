import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyAvFPfn9Qu90NZtk4QgSSe0R90dmkLStl0",
  authDomain: "pb-term-project.firebaseapp.com",
  projectId: "pb-term-project",
  storageBucket: "pb-term-project.firebasestorage.app",
  messagingSenderId: "397633807448",
  appId: "1:397633807448:web:180c2547b16cebba69562d",
  measurementId: "G-MHSE4C72G4"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Firebase 서비스 내보내기
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;