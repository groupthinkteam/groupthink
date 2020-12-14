import firebase from "firebase/app";
import "firebase/auth"
import "firebase/database"
import 'firebase/storage';
import 'firebase/functions'

// const FIREBASE_CONFIG = {
//     apiKey: "AIzaSyAjOQlUVvfpaPFKw_dsjVF-ZO9xAFFwLJc",
//     authDomain: "groupthink-fc4b2.firebaseapp.com",
//     databaseURL: "https://groupthink-fc4b2.firebaseio.com",
//     projectId: "groupthink-fc4b2",
//     storageBucket: "groupthink-fc4b2.appspot.com",
//     messagingSenderId: "268412476509",
//     appId: "1:268412476509:web:6a00e11a591b5852d4c1b4",
//     measurementId: "G-94X9F74RYY"
// }
const FIREBASE_CONFIG = {
    apiKey: "AIzaSyAjOQlUVvfpaPFKw_dsjVF-ZO9xAFFwLJc",
    authDomain: "groupthink-fc4b2.firebaseapp.com",
    databaseURL: "https://groupthink-test-fc4b2-d3113.firebaseio.com/",
    projectId: "groupthink-fc4b2",
    storageBucket: "groupthink-fc4b2-test",
    messagingSenderId: "268412476509",
    appId: "1:268412476509:web:921bf39858ccb0a0d4c1b4",
    measurementId: "G-R4RZ7YFB6S"
};
firebase.initializeApp(FIREBASE_CONFIG);

export const auth = firebase.auth;
export const database = firebase.database();
export const servertime = firebase.database.ServerValue.TIMESTAMP;
export const storage = firebase.storage;
export const functions = firebase.functions();