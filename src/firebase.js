import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAI9jOB-LaDnabcY5uJQEjO2_P3jUZ-RUk",
    authDomain: "harmony-ea990.firebaseapp.com",
    projectId: "harmony-ea990",
    storageBucket: "harmony-ea990.firebasestorage.app",
    messagingSenderId: "1027357152107",
    appId: "1:1027357152107:web:813a231dd38e3195ba322e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider }; 