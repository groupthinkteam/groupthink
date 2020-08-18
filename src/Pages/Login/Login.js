import React from 'react';
import auth from '../../Auth/auth';
import { useHistory, useLocation } from 'react-router-dom';
// const { default: auth } = require("../../Auth/auth");
const LoginPage = () => {
  let history = useHistory();
  let location = useLocation();

  let { from } = location.state || { from: { pathname: "/" } };
  let login = () => {
    auth.authenticate(() => {
      history.push('/dashboard')
    });
  };

  return (
    <div>
      <p>You must log in to view the page at {from.pathname}</p>
      <button onClick={login}>Log in</button>
    </div>
  );
}

export default LoginPage;