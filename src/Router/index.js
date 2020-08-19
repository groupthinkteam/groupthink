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
import { useAuth } from "../services/auth"
import Dashboard from "../Pages/Dashboard/Dashboard";

const AppRoutes = () => {
  const { authState } = useAuth();
  return (
    <Router>
      <Switch>
        <Route path="/login" component={LoginPage} />
        <PrivateRoute path="/dashboard" component={Dashboard}/>
        <PrivateRoute path="/document/:id" component={Document}/>
        <Redirect to={authState.isSignedIn ? '/dashboard' : '/login'} />
      </Switch>
    </Router>
  );
}

export default AppRoutes;