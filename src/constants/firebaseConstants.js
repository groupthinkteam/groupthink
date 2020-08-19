import { firebaseAuth } from "../services/firebase";
import { APP_CONSTANTS } from "./appConstants";

export const FIREBASE_CONSTANTS = {
    UI_CONFIG: {
        signInFlow: 'popup',
        // signInSuccessUrl: APP_CONSTANTS.URLS.DASHBOARD_URL,
        signInOptions: [
            firebaseAuth.GoogleAuthProvider.PROVIDER_ID,
            firebaseAuth.FacebookAuthProvider.PROVIDER_ID,
            firebaseAuth.EmailAuthProvider.PROVIDER_ID,
            firebaseAuth.PhoneAuthProvider.PROVIDER_ID
        ]
    }
}