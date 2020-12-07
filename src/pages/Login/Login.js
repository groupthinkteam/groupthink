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
        <div className="row" style={{padding:'5px 34px 10px'}}>
          <img src={require("../../assets/dashboard/logo.svg")} alt="logo"/>
        </div>
        <div className="row" style={{padding:'5px 70px 10px'}}>
          Sign in to continue
      </div>
        <div className="row">
          <StyledFirebaseAuth className="landing-login" uiConfig={firebaseConfig} firebaseAuth={auth()} />
        </div>
      </div>
    </div>
  )
})
export default LoginPage;