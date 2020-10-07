import React, { useEffect, useState } from "react";
import { useParams, useLocation, Redirect, Link, useHistory } from "react-router-dom";
import MenuBar from "../../components/MenuBar/MenuBar";
import CardManager from "../../components/DocumentCanvas/CardManager";
import isChild from "../Splash/SearchChild";
import Loading from "../../components/Loading";
export default function Document(props) {
  const location = useLocation();
  const history = useHistory();
  const { projectID } = useParams();
  const [isloaded, setIsLoaded] = useState(false);
  const [permission, setPermission] = useState(null);
  const [isOwner , setOwner] = useState();
  //console.log(projectID);
  useEffect(() => {
    (async () => {
      const [isChildPermission,isOwner] = await isChild(projectID);
      console.log("Permission", isChildPermission,isOwner)
      setTimeout(() => setIsLoaded(true), 3000);

      //---Check For Child Validation--
      if (isChildPermission == null) {
        history.push('/dashboard')
      }
      //---Permission Associated -----
      else {
        setPermission(isChildPermission);
        setOwner(isOwner)
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
  if (!isloaded) {
    return <Loading />
  }
  return (
    <div>
      <MenuBar style={{ position: "absolute", zIndex: 0 }}
        onLogOut={logout} currentUser={props.currentUser} document={permission} projectID={projectID} isOwner={isOwner}/>
      {
        permission != null ?
          <CardManager
            projectID={projectID}
            currentUser={props.currentUser}
            permission={permission}
            isOwner={isOwner}
          />
          : <div></div>
      }
    </div>
  );
}