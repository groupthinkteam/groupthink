import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import SplashPage from "../Pages/Splash/Splash"
import LoginPage from "../Pages/Login/Login";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../Pages/Dashboard/Dashboard";
import Document from "../Pages/Document/Document";
import { useAuth } from "../services/auth";
import InvitationCheck from "../Pages/Document/InvitationCheck";
import ErrorsPage from "../Pages/Errors/ErrorsPage";
import InivitationRoute from "./InvitationRoute";

export default function AppRoutes() {
  const { auth, uiConfig, authState } = useAuth();
  // console.log("authState", authState.pendingAuth)
  if(authState.pendingAuth){
    return false;
  }
  return (
    <Router>
      <Switch>
        <InivitationRoute isAuth={authState.isSignedIn} path="/project/:projectID/:permissionID">
          <InvitationCheck/>  
        </InivitationRoute>
        <PrivateRoute isAuth={authState.isSignedIn} path="/project/:projectID">
          <Document
            currentUser={() => auth().currentUser}
            signOut={() => auth().signOut()} />
        </PrivateRoute>
        <Route path="/login" >
          <LoginPage auth={auth} uiConfig={uiConfig} authState={authState} />
        </Route>
        <PrivateRoute isAuth={authState.isSignedIn} path="/dashboard">
          <Dashboard
            currentUser={() => auth().currentUser}
            signOut={() => auth().signOut()} />
        </PrivateRoute>
        <Route path="/error">
          <ErrorsPage/>
        </Route>
        <Route path="/">
          <SplashPage pendingAuth={authState.pendingAuth} isAuth={authState.isSignedIn} />
        </Route>
      </Switch>
    </Router>
  );
}
/**
 * <Route path="/project/:projectID">
   <Document />
</Route>*/