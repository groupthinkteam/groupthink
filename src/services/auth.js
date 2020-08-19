// auth API: 
//      get()           : returns the firebase.auth() Auth object
//      auth.signOut()  : sign out
//      checkSignedIn() : check whether user is currently signed in (true if signed in)
//      uiConfig        : config for StyledFirebaseAuth component
//  Note: redirects automatically to dashboard on sign-in, but sign-out redirection
//        logic must be manually supplied as an arg to signOut()

// export const auth = {
//     get: () => firebaseAuth(),
//     getUserName: () => firebaseAuth().currentUser.displayName,
//     signOut: (onSignOut) => firebaseAuth().signOut().then(onSignOut),
//     checkSignedIn: () => firebaseAuth().currentUser === null,
// }

import { useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import { firebaseAuth } from "./firebase"
import { FIREBASE_CONSTANTS } from "../constants/firebaseConstants"
import { APP_CONSTANTS } from "../constants/appConstants"

export function useAuth() {
    const auth = firebaseAuth;
    const uiConfig = FIREBASE_CONSTANTS.UI_CONFIG;
    const [authState, setAuthState] = useState({
        isSignedIn: false,
        pendingAuth: true,
        user: null,
    });
    const history = useHistory()
    useEffect(() => {
        const unregisterAuthObserver = firebaseAuth().onAuthStateChanged(
            user => {
                setAuthState({ user, pending: false, isSignedIn: !!user });
                if (user) { history.push(APP_CONSTANTS.URLS.DASHBOARD_URL) };
            }
        )
        return () => unregisterAuthObserver()
    }, [history])

    return { auth, uiConfig, authState };
}