import { useState, useEffect } from "react"
import { firebaseAuth } from "./firebase"
import { FIREBASE_CONSTANTS } from "../constants/firebaseConstants"

export function useAuth() {
    const auth = firebaseAuth;
    const uiConfig = FIREBASE_CONSTANTS.UI_CONFIG;
    const [authState, setAuthState] = useState({
        isSignedIn: false,
        pendingAuth: true,
        user: null,
    });
    useEffect(() => {
        const unregisterAuthObserver = firebaseAuth().onAuthStateChanged(
            user => {
                setAuthState({ user: user, pendingAuth: false, isSignedIn: !!user });
            }
        )
        return () => unregisterAuthObserver()
    }, [])
    return { auth, uiConfig, authState };
}