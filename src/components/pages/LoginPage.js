import React from "react"
import firebase from "firebase/app"
import "firebase/auth"
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import "./LoginPage.scss"

// props:
// callback function to be called when auth state changes
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
            // calls callback(true) if user is logged in, callback(false) otherwise
            (user) => this.props.callback(!!user)
        );
    }

    // Make sure we un-register Firebase observers when the component unmounts.
    componentWillUnmount() {
        this.unregisterAuthObserver();
    }

    render() {
        return (
            <div className="welcome-container">
                <div className="welcome-card">
                    <div className="welcome-title">
                        groupthink
                    </div>
                    <div className="welcome-subtitle">
                        unleash your ideas like never before
                    </div>
                    <div className="welcome-text">
                        <em>groupthink</em> is a real-time collaborative platform that brings the power
                        of the web into a new type of document. You can seamlessly integrate files, videos,
                        text, images, links, Tweets, Spotify playlists, Charts, and much more
                        in an easy-to-use interface.
                    </div>
                </div>
                <div className="login-container">
                    <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()} />
                </div>
            </div>
        )
    }
}

