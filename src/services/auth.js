import { firebaseAuth } from "./firebase"
import { APP_CONSTANTS } from "../constants/appConstants"

// auth API: 
//      get()           : returns the firebase.auth() Auth object
//      auth.signOut()  : sign out
//      checkSignedIn() : check whether user is currently signed in (true if signed in)
//      uiConfig        : config for StyledFirebaseAuth component
export const auth = {
    get: () => firebaseAuth(),
    signOut: (promise) => firebaseAuth().signOut().then(promise),
    checkSignedIn: () => firebaseAuth().currentUser === null,
    uiConfig: {
        signInFlow: 'popup',
        signInSuccessUrl: APP_CONSTANTS.URLS.DASHBOARD_URL,
        signInOptions: [
            firebaseAuth.GoogleAuthProvider.PROVIDER_ID,
            firebaseAuth.FacebookAuthProvider.PROVIDER_ID,
            firebaseAuth.EmailAuthProvider.PROVIDER_ID,
            firebaseAuth.PhoneAuthProvider.PROVIDER_ID
        ],
        // commented out for DEBUG purposes:
        // callbacks: {
        //     signInSuccessWithAuthResult: () => false
        // }
    }
}