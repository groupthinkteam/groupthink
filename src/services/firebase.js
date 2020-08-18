import firebase from "firebase"
import { APP_CONSTANTS } from "../constants/appConstants"

firebase.initializeApp(APP_CONSTANTS.FIREBASE_CONFIG);

export const firebaseAuth = firebase.auth;
export const firebaseDB = firebase.database();