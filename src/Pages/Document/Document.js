import React from "react";
import { useParams, useLocation, Redirect, Link } from "react-router-dom";
import MenuBar from "../../components/MenuBar/MenuBar";
import CardManager from "../../components/DocumentCanvas/CardManager";

export default function Document(props) {
  const location = useLocation();
  const { projectID } = useParams();
  console.log(projectID);

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