import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCM71imi-1tbCZhSmxpbMmcV5MyJCagHes",
  authDomain: "oltinnisbatlogin-3deba.firebaseapp.com",
  projectId: "oltinnisbatlogin-3deba",
  storageBucket: "oltinnisbatlogin-3deba.firebasestorage.app",
  messagingSenderId: "755493298909",
  appId: "1:755493298909:web:ceebf5768a7eedfc1d7134",
  measurementId: "G-5RGZDZQ071"
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