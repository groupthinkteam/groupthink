import React from "react"
import firebase from "firebase/app"
import "firebase/auth"
import auth from "../../firebaseAPI/firebaseAPI"
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

// props:
// callback
export default class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
    }

    uiConfig = {
        signInFlow: 'popup',
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.FacebookAuthProvider.PROVIDER_ID,
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
            firebase.auth.PhoneAuthProvider.PROVIDER_ID
        ],
        callbacks: {
            signInSuccessWithAuthResult: () => false
        }
    };


    // Listen to the Firebase Auth state and set the local state.
    componentDidMount() {
        this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
            (user) => this.props.callback(!!user)
        );
    }

    // Make sure we un-register Firebase observers when the component unmounts.
    componentWillUnmount() {
        this.unregisterAuthObserver();
    }

    render() {
        return (<StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()} />)
    }
}

