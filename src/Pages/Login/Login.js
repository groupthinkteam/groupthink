import React, { useContext } from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import { useAuth } from '../../services/auth'
import AppContext from '../../contexts/AppContext';

function LoginPage() {
  const UserID = useContext(AppContext);
  
  const { auth, uiConfig, authState } = useAuth()
  if (authState.pending) {
    return <h1>waiting...</h1>
  }
  else
  {
    UserID.setUid(auth().currentUser?.uid);
    console.log("UserID",UserID.uid);
   // debugger;
  }
  //UserID.setUid(auth().currentUser?.uid);
  //console.log("Global UID",UserID.uid);
  return (
    <div>
      <h1>Welcome to groupthink</h1>
      <p>Please sign-in:</p>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth()} />
      {//console.log("Login ",auth().currentUser?.uid)
      }
    </div>
  )
}
export default LoginPage;