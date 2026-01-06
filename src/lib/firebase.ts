import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDAitZngMBiCjXLTivj64GufQtBEISB5i8",
    authDomain: "explorard-19b5b.firebaseapp.com",
    projectId: "explorard-19b5b",
    storageBucket: "explorard-19b5b.firebasestorage.app",
    messagingSenderId: "223831647558",
    appId: "1:223831647558:web:ec331d306897c858513147",
    measurementId: "G-JZKH80B7WR"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
