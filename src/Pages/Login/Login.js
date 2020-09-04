import React from 'react'
import { Redirect, useLocation } from "react-router-dom"
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
export default function LoginPage(props) {
  const location = useLocation()
  return (
    props.authState.isSignedIn ?
      <Redirect
        to={{
          pathname: "/dashboard",
          state: { from: location }
        }}
      />
      :
      <div>
        <h1>Welcome to groupthink</h1>
        <p>Please sign-in:</p>
        <StyledFirebaseAuth uiConfig={props.uiConfig} firebaseAuth={props.auth()} />
      </div>
  )
}