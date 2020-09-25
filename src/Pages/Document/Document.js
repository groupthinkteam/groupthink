import React, { useEffect, useState } from "react"; 
import { useParams, useLocation, Redirect, Link, useHistory } from "react-router-dom";
import MenuBar from "../../components/MenuBar/MenuBar";
import CardManager from "../../components/DocumentCanvas/CardManager";
import isChild from "../Splash/SearchChild";
import Loading from "../../components/Loading";

/**
 * This File Opens The Project Detail Page At Path :- `/projects/"projectID"`
 * @component
 * @param {*} props Following Are The Props :
 * @constant ` CurrentUser` :- Contains UID And USer's Info 
 * @function `signOut()` :- This Function Sign Out from Project
 * @returns  `JSX Element Consists of Menu Bar &  Card Manager`
 */

export default function Document(props) {
  const location = useLocation();
  const history = useHistory();
  const { projectID } = useParams();
  
  /**State Store Boolean If Loaded or Not */
  const [isloaded, setIsLoaded] = useState(false);

  /**State Stores Permission of Project */
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