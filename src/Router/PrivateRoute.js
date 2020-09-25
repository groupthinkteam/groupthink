import React from 'react'
import {
  Route,
  Redirect,
} from "react-router-dom";

/**
 * This File Handles The Project Detail  Route i.e if user is not Signed in Then it will redirect to Splash Page 
 * And Open Directly This Project Detail.
 * @param {String} path Invitation URL 
 * @param {Component} children The Children Means The Component Mapped to the Path .
 * @constants  `isAuth` Holds the user authenticated boolean value.
 */
const PrivateRoute = ({path, children, isAuth, ...rest }) => {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuth ? (
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