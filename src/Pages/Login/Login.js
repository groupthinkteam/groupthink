import React from 'react';
import { auth } from "../../services/auth";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

const LoginPage = () => {
  return (
    <div>
      <StyledFirebaseAuth uiConfig={auth.uiConfig} firebaseAuth={auth.get()} />
    </div>
  );
}

export default LoginPage;