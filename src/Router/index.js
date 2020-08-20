import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import SplashPage from "../Pages/Splash/Splash"
import LoginPage from "../Pages/Login/Login";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../Pages/Dashboard/Dashboard";
import { useAuth } from "../services/auth";

export default function AppRoutes() {
  const { auth, uiConfig, authState } = useAuth();
  return (
    <Router>
      <Switch>
        <Route path="/login" >
          <LoginPage auth={auth} uiConfig={uiConfig} authState={authState} />
        </Route>
        <PrivateRoute isAuth={authState.isSignedIn} path="/dashboard">
          <Dashboard getUserID={() => auth().currentUser.uid} signOut={() => auth().signOut()} />
        </PrivateRoute>
        <Route path="/">
          <SplashPage pendingAuth={authState.pendingAuth} isAuth={authState.isSignedIn} />
        </Route>
      </Switch>
    </Router>
  );
}