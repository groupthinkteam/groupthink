import { createStore } from "redux"
import firebase from "firebase/app"

const defaultState = {
    isLoggedIn: false
}

const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case "LOGIN":
            return { ...state, isLoggedIn: true }
        case "LOGOUT":
            // firebase.auth().signOut()
            return { ...state, isLoggedIn: false }
    }
    return state;
}

export const store = createStore(reducer)