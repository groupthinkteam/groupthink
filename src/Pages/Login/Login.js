import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { auth } from "../../services/auth";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

const LoginPage = () => {
  let history = useHistory();

  return (
    <div>
      <StyledFirebaseAuth uiConfig={auth.uiConfig} />
    </div>
  );
}

export default LoginPage;