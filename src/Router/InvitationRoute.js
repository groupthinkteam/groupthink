import React, { Component } from 'react'
import {
  Route,
  Redirect,
} from "react-router-dom";

/**
 * This File Handles The Invitation Route i.e if user is not Signed in Then it will redirect to Login Page 
 * And Open Directly This Invitation Link.
 * @param {String} path Invitation URL 
 * @param {Component} children The Children Means The Component Mapped to the Path or Inivitation Link.
 * @constants  `isAuth` Holds the user authenticated boolean value.
 */

const InivitationRoute = ({path, children, isAuth, ...rest }) => {
  console.log(path)
  
    return (
      <Route
        {...rest}
        render={({ location }) =>
          isAuth ? (
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
export default InivitationRoute;