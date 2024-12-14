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