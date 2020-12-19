import React from 'react'
import { Redirect, useLocation } from "react-router-dom"
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import "../../styles/login.scss";
import { useStore } from "../../store/hook"
import { auth } from '../../services/firebase';
import { observer } from 'mobx-react-lite';

const LoginPage = observer(() => {
  const location = useLocation();
  const { currentUser, firebaseConfig } = useStore();
  let path = "/dashboard";
  console.log("LOGIN ")
  
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
        <div className="container">
          <img src={require("../../assets/dashboard/logo.svg")} alt="logo" />
          <div className="login">
            Sign in to continue
            <StyledFirebaseAuth className="landing-login" uiConfig={firebaseConfig} firebaseAuth={auth()} />
          </div>
        </div>
        <img src={require("../../assets/login/graphic-right.svg")} className="graphic-right" alt="decoration"/>
        <img src={require("../../assets/login/graphic-left.svg")} className="graphic-left" alt="decoration"/>
      </div>
  )
})
export default LoginPage;