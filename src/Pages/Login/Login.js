import React from 'react'
import { Redirect, useLocation, useParams } from "react-router-dom"
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import "../../styles/login.scss";
/**
 * This Is Login Component Provide Option to Sign-IN 
 * Opens When User Logout or NOt Signed in .
 * When Invitation Link is Given For New User It will Redirect To Invitation Page
 * @param {*} props Following are the props
 * @constant {firebase.auth} auth Firebase Auth Function
 * @constant {StyledFirebaseAuth} uiConfig StyledFirebaseAuth Configuration
 * @constant authState Containes Authentication State
 */
export default function LoginPage(props) {
  const location = useLocation()
  let path = "/dashboard"
  //----Check if Inivitation Link is there then Redirect to it once Sign IN---
  if(location.state?.from != undefined)
  path = location.state.from.pathname
  return (
    props.authState.isSignedIn ?
      <Redirect
        to={{
          pathname: path,// "/dashboard",
          state: { from: location }
        }}
      />
      :
      <div id="login">
        <h1 id="title">Groupthink</h1>
        <div className="row align-items-center h-100">
          <div className="col-6">
            <img src="https://picsum.photos/200?random=48"/>
          </div>
            <div className="col-6">
              <div className="landing-subtitle">
                <b>Unleash your ideas like never before</b>
              </div>
              <div className="landing-text">
                    <em>groupthink</em> is a real-time collaborative platform that brings the power of the web into a new type of document.
                  Gone are the days of static, unidimensional word docs and spreadsheets. <em>groupthink</em> is a live document that seamlessly
                  integrates video, text, images, links, Tweets, Spotify playlists, Charts, and much more in an easy-to-use interface.
              </div>
              <p id="sign">Please sign-in:</p>
              <StyledFirebaseAuth uiConfig={props.uiConfig} firebaseAuth={props.auth()} />
            </div>
        </div>
      </div>
  )
}