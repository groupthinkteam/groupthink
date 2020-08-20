import * as firebase from "firebase/app"
import "firebase/auth"
import "firebase/database"

const FIREBASE_CONFIG = {
    apiKey: "AIzaSyAjOQlUVvfpaPFKw_dsjVF-ZO9xAFFwLJc",
    authDomain: "groupthink-fc4b2.firebaseapp.com",
    databaseURL: "https://groupthink-fc4b2.firebaseio.com",
    projectId: "groupthink-fc4b2",
    storageBucket: "groupthink-fc4b2.appspot.com",
    messagingSenderId: "268412476509",
    appId: "1:268412476509:web:6a00e11a591b5852d4c1b4",
    measurementId: "G-94X9F74RYY"
}

firebase.initializeApp(FIREBASE_CONFIG);

export const firebaseAuth = firebase.auth;
export const firebaseDB = firebase.database();