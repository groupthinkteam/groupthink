import React from "react";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
import LoginPage from "../Pages/Login/Login";
import PrivateRoute from "./PrivateRoute";
import { auth } from "../services/auth"
import Dashboard from "../Pages/Dashboard/Dashboard";

const AppRoutes = () => {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={LoginPage} />
        <PrivateRoute path="/dashboard" component={Dashboard} />
        <Redirect to={auth.isAuthenticated ? '/dashboard' : '/login'} />
      </Switch>
    </Router>
  );
}

export default AppRoutes;