
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDr7Ym41rk0m320sunRRBPz26m8fj9tjOY",
  authDomain: "social-media-app-e02b9.firebaseapp.com",
  projectId: "social-media-app-e02b9",
  storageBucket: "social-media-app-e02b9.appspot.com",
  messagingSenderId: "577999047363",
  appId: "1:577999047363:web:c3f83cb0f48ec902ca3076",
  measurementId: "G-DPLW606QKE"
};

// Initialize Firebase

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage();