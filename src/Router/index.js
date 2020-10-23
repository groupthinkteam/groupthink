import React from "react";
import { BrowserRouter as Router, Switch, Route, } from "react-router-dom";
import LoginPage from "../pages/Login/Login";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../pages/Dashboard/Dashboard";
import Document from "../pages/Document/Document";
import InvitationCheck from "../pages/Document/InvitationCheck";
import ErrorsPage from "../pages/Errors/ErrorsPage";
import { useStore } from "../store/hook";

export default function AppRoutes() {
  let store = useStore();
  let isSignedIn = !!store.currentUser;
  return (
    <Router>
      <Switch>
        <PrivateRoute isSignedIn={isSignedIn} path="/project/:projectID/:permissionID/:typeID/:nameID">
          <InvitationCheck />
        </PrivateRoute>
        <PrivateRoute isSignedIn={isSignedIn} path="/project/:projectID">
          <Document />
        </PrivateRoute>
        <Route path="/login" >
          <LoginPage />
        </Route>
        <PrivateRoute isSignedIn={isSignedIn} path="/dashboard">
          <Dashboard />
        </PrivateRoute>
        <Route path="/error">
          <ErrorsPage />
        </Route>
        <Route path="/">
          {/* redirect to login or dashboard based on auth */}
        </Route>
      </Switch>
    </Router>
  );
}