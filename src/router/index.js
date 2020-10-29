import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import { useStore } from "../store/hook";
import { observer } from "mobx-react-lite";
import { auth } from "../services/firebase";

import LoginPage from "../pages/Login/Login";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../pages/Dashboard/Dashboard";
import Document from "../pages/Document/Document";
import ErrorsPage from "../pages/Errors/ErrorsPage";

function AppRoutes(props) {
  const { syncUser, currentUser, createSharedUser } = useStore();
  useEffect(
    () => {
      console.log("INDEX  ", isSignedIn, currentUser?.uid);
      let unsubscribe = auth().onAuthStateChanged(_ => syncUser())
      return () => unsubscribe()
    }
  )
  let isSignedIn = !!currentUser;

  return (
    <Router>
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
        <PrivateRoute isSignedIn={isSignedIn} path="/project/:projectID">
          <Document />
        </PrivateRoute>
        <Route path="/login" isSignedIn={isSignedIn}>
          <LoginPage />
        </Route>
        <PrivateRoute isSignedIn={isSignedIn} path="/dashboard">
          <Dashboard />
        </PrivateRoute>
        <Route path="/error">
          <ErrorsPage />
        </Route>
        {/* <Redirect to="/login" /> */}
      </Switch>
    </Router>
  );
}
export default observer(AppRoutes);