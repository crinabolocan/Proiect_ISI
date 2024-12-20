// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { ref, set, onValue } from "firebase/database";

// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyApP5hWjpLrXVkbUGrgo0AfbyiZOmCAdGc",
  authDomain: "proiect-isi-c4cf7.firebaseapp.com",
  projectId: "proiect-isi-c4cf7",
  storageBucket: "proiect-isi-c4cf7.firebasestorage.app",
  messagingSenderId: "820497858291",
  appId: "1:820497858291:web:b42ca7ab6d393049950186",
  measurementId: "G-DVG1VLL5R2",
  databaseURL: "https://proiect-isi-c4cf7-default-rtdb.europe-west1.firebasedatabase.app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

function writeUserData(userId, name, email, imageUrl) {
  const db = getDatabase();
  set(ref(db, 'users/' + userId), {
    username: name,
    email: email,
  });
}

function readUserData(userId) {
    const db = getDatabase();
    const starCountRef = ref(db, 'users/' + userId);
    onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        console.log(data);
    });
}

writeUserData('1', 'Crina', 'crina@gmail.com');

readUserData('1');

// register part of the code
import express from 'express';
import bodyParser from 'body-parser';
import firebaseAdmin from 'firebase-admin';
// const express = require('express');
// const bodyParser = require('body-parser');
// const firebaseAdmin = require('firebase-admin');

import serviceAccount from "./src/FirebaseService.json" assert { type: "json" };
// const serviceAccount = require('./proiect-isi-c4cf7-firebase-adminsdk-1zv3v-3b3b3b3b3b.json');
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: 'https://proiect-isi-c4cf7-default-rtdb.europe-west1.firebasedatabase.app'
});

const apps = express();
apps.use(bodyParser.json());


// Define the root route with a registration form
apps.get("/", (req, res) => {
    res.send(`
        <html>
        <head>
            <title>Register</title>
        </head>
        <body>
            <h1>Register</h1>
            <form action="/register" method="POST">
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" required><br><br>
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required><br><br>
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required><br><br>
                <button type="submit">Register</button>
            </form>
        </body>
        </html>
    `);
});

// Handle registration
apps.post('/register', async (req, res) => {
    const { email, username, password } = req.body;

    try {
        const user = await firebaseAdmin.auth().createUser({
            email,
            password,
            displayName: username
        });

        await firebaseAdmin.auth().setCustomUserClaims(user.uid, {
            role: 'user'
        });

        res.status(201).send(`
            <html>
            <body>
                <h1>Registration Successful!</h1>
                <p>User: ${username} has been registered successfully.</p>
                <a href="/">Back to Register</a>
            </body>
            </html>
        `);
    } catch (error) {
        console.error('Error registering:', error);
        res.status(500).send(`
            <html>
            <body>
                <h1>Error</h1>
                <p>An unknown error occurred during registration. Please try again.</p>
                <a href="/">Back to Register</a>
            </body>
            </html>
        `);
    }
});

// Start the server
apps.listen(3000, () => console.log('Server running on http://localhost:3000'));
