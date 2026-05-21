import {
  initializeApp
}
from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";

import {
  getFirestore
}
from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

import {
  getAuth
}
from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

const firebaseConfig = {

  apiKey:
  "AIzaSyDCITnMVRuYXPrifZYzOSnej4HhBVhbEAg",

  authDomain:
  "clickjabo.firebaseapp.com",

  projectId:
  "clickjabo",

  storageBucket:
  "clickjabo.firebasestorage.app",

  messagingSenderId:
  "760270404162",

  appId:
  "1:760270404162:web:866ce38157f0b776d70bdb"

};

const app =
initializeApp(
  firebaseConfig
);

const db =
getFirestore(app);

const auth =
getAuth(app);

export {
  db,
  auth
};