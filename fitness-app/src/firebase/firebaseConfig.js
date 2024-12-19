// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBirYJzzydlOAwquy_zgQ9TBUFjUAuDs-w",
  authDomain: "fitnessapp-2b5fe.firebaseapp.com",
  projectId: "fitnessapp-2b5fe",
  storageBucket: "fitnessapp-2b5fe.appspot.com",
  messagingSenderId: "902146670438",
  appId: "1:902146670438:web:e88c9a3bdcddef5eb612a7",
  measurementId: "G-102DDRM510"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;