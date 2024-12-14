// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import serviceAccount from '../firebaseService.json' assert { type: "json" };

import dotenv from 'dotenv';
// require("dotenv").config();
//import firebase from '../../node_modules/@firebase';
// const firebase = require("firebase/app");
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyApP5hWjpLrXVkbUGrgo0AfbyiZOmCAdGc",
  authDomain: "proiect-isi-c4cf7.firebaseapp.com",
  databaseURL: "https://proiect-isi-c4cf7-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "proiect-isi-c4cf7",
  storageBucket: "proiect-isi-c4cf7.firebasestorage.app",
  messagingSenderId: "820497858291",
  appId: "1:820497858291:web:b42ca7ab6d393049950186",
  measurementId: "G-DVG1VLL5R2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendEmailVerification, sendPasswordResetEmail } from "firebase/auth";
// const { 
//     getAuth, 
//     createUserWithEmailAndPassword, 
//     signInWithEmailAndPassword, 
//     signOut, 
//     sendEmailVerification, 
//     sendPasswordResetEmail
  
// } = require("firebase/auth") ;

// module.exports = {
//     getAuth,
//     signInWithEmailAndPassword,
//     createUserWithEmailAndPassword,
//     signOut,
//     sendEmailVerification,
//     sendPasswordResetEmail,
//     admin
// };

import admin from 'firebase-admin';
// const admin = require('firebase-admin');
// const serviceAccount = require("../firebaseService.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// module.exports = admin;

//export default firebase;
export { getAuth, createUserWithEmailAndPassword }
export { signInWithEmailAndPassword, signOut }
export { sendEmailVerification, sendPasswordResetEmail }
export { admin }