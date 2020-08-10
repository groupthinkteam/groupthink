import React from "react"
import ReactDOM from "react-dom"

import firebase from "firebase/app"

import App from "./App"


// it is completely fine to expose these keys publicly
// https://stackoverflow.com/questions/37482366/is-it-safe-to-expose-firebase-apikey-to-the-public
const firebaseConfig = {
    apiKey: "AIzaSyAjOQlUVvfpaPFKw_dsjVF-ZO9xAFFwLJc",
    authDomain: "groupthink-fc4b2.firebaseapp.com",
    databaseURL: "https://groupthink-fc4b2.firebaseio.com",
    projectId: "groupthink-fc4b2",
    storageBucket: "groupthink-fc4b2.appspot.com",
    messagingSenderId: "268412476509",
    appId: "1:268412476509:web:6a00e11a591b5852d4c1b4",
    measurementId: "G-94X9F74RYY"
};

// only needs to be done once
firebase.initializeApp(firebaseConfig)

ReactDOM.render(
    <App />,
    document.getElementById("root")
)