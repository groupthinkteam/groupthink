import { firebaseAuth } from "../services/firebase";

export const FIREBASE_CONSTANTS = {
    UI_CONFIG: {
        signInFlow: 'popup',
        // signInSuccessUrl: APP_CONSTANTS.URLS.DASHBOARD_URL,
        signInOptions: [
            firebaseAuth.GoogleAuthProvider.PROVIDER_ID,
            firebaseAuth.FacebookAuthProvider.PROVIDER_ID,
            firebaseAuth.EmailAuthProvider.PROVIDER_ID,
            firebaseAuth.PhoneAuthProvider.PROVIDER_ID
        ],
        callbacks: {
            signInSuccessWithAuthResult: () => false
        }
    }
}