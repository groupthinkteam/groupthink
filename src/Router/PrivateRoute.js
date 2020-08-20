import React from 'react'
import { useAuth } from "../services/auth";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";

const PrivateRoute = ({ children, ...rest }) => {
  const { authState } = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        authState.isSignedIn ? (
          children
        ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location }
              }}
            />
          )
      }
    />
  );
}
export default PrivateRoute;