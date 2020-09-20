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
  const [permission , setPermission] = useState(null);
  //console.log(projectID);
  useEffect(() => {
    (async () => {
      const  isChildPermission= await isChild(projectID);
      setIsLoaded(true);
      
      //---Check For Child Validation--
      if(isChildPermission == null) {
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
      <MenuBar onLogOut={logout} currentUser={props.currentUser} document={permission} projectID={projectID}/>
      <Link to="/dashboard" className="back_btn">Back</Link>
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