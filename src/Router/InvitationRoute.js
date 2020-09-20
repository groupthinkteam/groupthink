import React from 'react'
import {
  Route,
  Redirect,
} from "react-router-dom";

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