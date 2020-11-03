import { observer } from 'mobx-react-lite';
import React from 'react'
import {
  Route,
  Redirect,
  useParams,
  useHistory
} from "react-router-dom";
import { useStore } from '../store/hook';

const PrivateRoute = ({ path, children, isSignedIn, invitation, validateInvitation,document, ...rest }) => {
  const history = useHistory()
  let { projectID, keyID, permission } = useParams();
  let store = useStore()
  if (invitation) {
    console.log("invitation is valid")
    if (keyID) {
      console.log("keyid true", keyID)
      store.createSharedUser(projectID, keyID, permission, (success) => {
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
  if(document)
  {
    store.isProjectValid(projectID,success=>{
      if (!success){
        console.log("Invalid Project ")
        history.push("/dashboard")
      }
    })
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