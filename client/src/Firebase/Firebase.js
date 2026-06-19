import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD5HR_UZ6o4XceF9pQ8nuzbFc8LTBMzyZI",
  authDomain: "oltinnisbatlogin.firebaseapp.com",
  projectId: "oltinnisbatlogin",
  storageBucket: "oltinnisbatlogin.firebasestorage.app",
  messagingSenderId: "58897396427",
  appId: "1:58897396427:web:d2fe6568de87a15a8d614e",
  measurementId: "G-JWW28QS24W"
};

function Firebase() {
  initializeApp(firebaseConfig);
}

const app = Firebase();
const db = getFirestore(app)
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
const analytics = getAnalytics(app);

export default Firebase
export {db}