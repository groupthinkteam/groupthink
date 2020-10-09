import React from 'react'
import { Redirect, useLocation, useParams } from "react-router-dom"
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import "../../styles/login.scss";

export default function LoginPage(props) {
  const location = useLocation()
  let path = "/dashboard"
  //----Check if Inivitation Link is there then Redirect to it once Sign IN---
  if (location.state?.from != undefined)
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
        <div id="landing">
          <div className="landing-title">
            groupthink
          </div>
          <div className="landing-subtitle">
            <b>Unleash your ideas like never before</b>
          </div>
          {/* <div id="landing-secondary"> */}
          <div className="landing-text">
            <em>groupthink</em> is a real-time collaborative platform that brings the power of the web into a new type of document.
          </div>
          {/* </div> */}
        </div>
        <StyledFirebaseAuth className="landing-login" uiConfig={props.uiConfig} firebaseAuth={props.auth()} />
      </div>
  )
}