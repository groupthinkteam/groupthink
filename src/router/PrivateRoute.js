import { observer } from 'mobx-react-lite';
import React from 'react'
import {
  Route,
  Redirect,
  useParams,
  useHistory
} from "react-router-dom";
import { useStore } from '../store/hook';

const PrivateRoute = ({ path, children, isSignedIn, invitation, validateInvitation, ...rest }) => {
  const history = useHistory()
  let { projectID, keyID, permission } = useParams();
  console.log("params", projectID, keyID, permission)
  let store = useStore()
  if (invitation) {
    console.log("invitation true")
    if (keyID) {
      console.log("keyid true", keyID)
      store.createSharedUser(projectID, keyID, permission, (success) => {
        console.log("callback was called")
        if (success) {
          console.log("success")
          history.push("/project/" + projectID)
        }
        else {
          console.log("fail")
          history.push("/error")
        }
      })
    }
    return <p>Checking your invite...</p>
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