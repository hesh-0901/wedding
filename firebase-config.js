// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Ta configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDxj2LH5k1EpE3-ssQb2E1D4WPOZwBn1l8",
  authDomain: "japhm-6445b.firebaseapp.com",
  projectId: "japhm-6445b",
  storageBucket: "japhm-6445b.firebasestorage.app",
  messagingSenderId: "433387974348",
  appId: "1:433387974348:web:3c6bd215f0350378c1dc69",
  measurementId: "G-297W02X06F"
};

// Initialisation de Firebase et de Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// On exporte la base de données et les fonctions utiles pour les autres fichiers
export { db, doc, getDoc, setDoc };
