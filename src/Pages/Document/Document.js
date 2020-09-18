import React, { useEffect, useState } from "react";
import { useParams, useLocation, Redirect, Link, useHistory } from "react-router-dom";
import MenuBar from "../../components/MenuBar/MenuBar";
import CardManager from "../../components/DocumentCanvas/CardManager";
import isChild from "../Splash/SearchChild";
import Loading from "../../components/Loading";
export default function Document(props) {
  const location = useLocation();
  const history = useHistory();
  const { projectID ,senderID,linkID ,permissionID} = useParams();
  const [isloaded, setIsLoaded] = useState(false);
  const [permission , setPermission] = useState(null);
  //console.log(projectID);
  useEffect(() => {
    (async () => {
      const  [isChildPermission,checkInvite]= await isChild(projectID,senderID,permissionID);
      setIsLoaded(true);
      //----Check For Invitation Link---- 
      if(checkInvite)
      {
        setPermission(permissionID)
        history.push(`/project/${projectID}`)
      }
      //---Check For Child Validation--
      else if(isChildPermission == null) {
        history.push('/dashboard')
      }
      //---Permission Associated -----
      else{
        setPermission(isChildPermission);
      }
    })()
  }, [])

  const logout = () => {
    props.signOut()
    return (
      <Redirect to={{
        pathname: "/login",
        state: { from: location }
      }}
      />
    )
  }
  if(!isloaded){
    return <Loading />
  }
  return (
    <div>
      <MenuBar onLogOut={logout} currentUser={props.currentUser} document={true} projectID={projectID}/>
      <Link to="/dashboard" class="back_btn">Back</Link>
      {
        permission != null ?
        <CardManager
          projectID={projectID}
          permission={permission}
        />
        :<div></div>
      }
      
    </div>
  );
}