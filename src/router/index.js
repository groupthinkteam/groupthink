import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import { useStore } from "../store/hook";
import { observer } from "mobx-react-lite";
import { auth } from "../services/firebase";

import LoginPage from "../pages/Login/Login";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../pages/Dashboard/Dashboard";
import Document from "../pages/Document/Document";
import ErrorsPage from "../pages/Errors/ErrorsPage";
import Settings from "../pages/Settings/Settings";

function AppRoutes(props) {
  const { syncUser, currentUser, createSharedUser } = useStore();
  let [pendingAuth, setPendingAuth] = useState(true);
  let isSignedIn = !!currentUser;

  useEffect(() => {
    console.log("login status: pending | signedIn | currentUser:\n", pendingAuth, isSignedIn, currentUser?.uid);
    let unsubscribe = auth().onAuthStateChanged(_ => { setPendingAuth(false); syncUser(); })
    return () => unsubscribe()
  })


  return (
    <Router>
      { pendingAuth ?
        <div style={{ width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
          Auth Pending
        </div> :
        <Switch>
          <Route path="/shared/:projectID/:keyID/:permission"
            render={({ location }) =>
              isSignedIn ? (
                <PrivateRoute isSignedIn={isSignedIn} invitation validateInvitation={createSharedUser} path="/shared/:projectID/:keyID/:permission">
                  <Document />
                </PrivateRoute>
              ) : (
                  <Redirect
                    to={{
                      pathname: "/login",
                      state: { from: location }
                    }}
                  />
                )
            }>
          </Route>
          <Route path="/project/:projectID"
            render={({ location }) =>
              isSignedIn ? (
                <PrivateRoute isSignedIn={isSignedIn} document path="/project/:projectID">
                  <Document />
                </PrivateRoute>
              ) : (
                  <Redirect
                    to={{
                      pathname: "/login",
                      state: { from: location }
                    }}
                  />
                )
            }>
          </Route>
          <Route path="/login" isSignedIn={isSignedIn}>
            <LoginPage />
          </Route>
          <PrivateRoute isSignedIn={isSignedIn} path="/dashboard">
            <Dashboard />
          </PrivateRoute>
          <PrivateRoute isSignedIn={isSignedIn} path="/settings">
            <Settings />
          </PrivateRoute>
          <Route path="/error">
            <ErrorsPage />
          </Route>
          <Redirect to={isSignedIn ? "/dashboard" : "/login"} />
        </Switch>
      }
    </Router>
  );
}
export default observer(AppRoutes);