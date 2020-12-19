import { auth } from "../services/firebase";
// import { APP_CONSTANTS } from "./appConstants";

export const FIREBASE_CONSTANTS = {
    UI_CONFIG: {
        signInFlow: 'popup',
        //signInSuccessUrl: APP_CONSTANTS.URLS.DASHBOARD_URL,
        signInOptions: [
            {
                provider: auth.EmailAuthProvider.PROVIDER_ID,
                requireDisplayName: true
            },
            auth.GoogleAuthProvider.PROVIDER_ID,
            auth.FacebookAuthProvider.PROVIDER_ID,
        ],
        callbacks: {
            signInSuccessWithAuthResult: () => false
        }
    }
}