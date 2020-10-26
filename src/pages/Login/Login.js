import React from 'react'
import { Redirect, useLocation } from "react-router-dom"
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import "../../styles/login.scss";
import { useStore } from "../../store/hook"
import { auth } from '../../services/firebase';
import { observer } from 'mobx-react-lite';

const LoginPage = observer(() => {
  const location = useLocation();
  const {currentUser,firebaseConfig} = useStore();
  let path = "/dashboard";
  console.log("LOGIN ",location)
  if (location.state?.from !== undefined)
    path = location.state.from.pathname
  return (
    currentUser ?
      <Redirect
        to={{
          pathname: path,
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
        <StyledFirebaseAuth className="landing-login" uiConfig={firebaseConfig} firebaseAuth={auth()} />
      </div>
  )
})
export default LoginPage;