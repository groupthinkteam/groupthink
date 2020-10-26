import React from 'react'
import {
  Route,
  Redirect,
} from "react-router-dom";

const PrivateRoute = ({ path, children, isSignedIn, ...rest }) => {
  console.log("PRIVATE ROUTE",isSignedIn)
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isSignedIn ? (
          children
        ) : (
            <Redirect
              to={{
                pathname: "/",
                state: { from: location }
              }}
            />
          )
      }
    />
  );
}
export default PrivateRoute;