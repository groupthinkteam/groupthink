import React  from 'react'
import {
  Route,
  Redirect,
  useLocation,
  useHistory
} from "react-router-dom";
import { observer } from 'mobx-react-lite';
import { useStore } from '../store/hook';

const PrivateRoute = ({ path, children, isSignedIn, ...rest }) => {
  const store = useStore();
  const history = useHistory();
  const location = useLocation();
  console.log("PRIVATE ROUTE", isSignedIn);
  if (path === '/shared/:projectID/:keyID/:permission'&&isSignedIn) {
    const params = window.location.pathname.split("/");
    const projectID = params[2];
    const keyID = params[3];
    const permission = params[4];
    console.log("GOING IN STORE WITH PARAMS ", params, projectID, keyID, permission);
    let success = store.createSharedUser(projectID, keyID, permission)
    if (success)
      history.push('/project/' + projectID, { from: location });
    else
      history.push('/error', { from: location })
  }
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isSignedIn ? (
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
export default observer(PrivateRoute);