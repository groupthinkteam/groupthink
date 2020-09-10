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
  //console.log(projectID);
  useEffect(() => {
    (async () => {
      const isValid = await isChild(projectID);
      setIsLoaded(true);
      if (!isValid) {
        history.push('/dashboard')
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
      <MenuBar onLogOut={logout} currentUser={props.currentUser} />
      <Link to="/dashboard">Back</Link>
      <CardManager
        projectID={projectID}
      />
    </div>
  );
}