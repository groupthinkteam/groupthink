import React, { useEffect, useState } from "react";
import MenuBar from "../../components/MenuBar/MenuBar";
import Loading from "../../components/Loading";
import CardContainer from "../../components/DocumentCanvas/CardContainer";
import { observer } from "mobx-react-lite";
import { useStore } from "../../store/hook";
import { useHistory, useParams, useLocation } from "react-router-dom";


function Document() {
  let store = useStore();
  const history = useHistory();
  const location = useLocation();
  const { projectID, keyID, permission } = useParams();
  const [isloaded, setIsLoaded] = useState(false);
  useEffect(() => {
    console.log("DATA LOADED IN DOCUMENT KEY: ", keyID, "\n PROJECT \n", projectID);
    if (keyID) {
      //TODO:- Remove check and use in Index
      let success = store.createSharedUser(projectID, keyID, permission)
      if (success)
        history.push('/project/' + projectID, { from: location });
      else
        history.push('/error', { from: location })
    }
    else {
      let valid = store.isProjectValid(projectID);
      console.log("valid")
      if (valid) {
        setTimeout(() => setIsLoaded(true), 4000)
        store.projectID = projectID
        store.addDocumentListeners()
        return () => store.removeDocumentListeners()
      }
      else {
        console.log("this is happening")
        history.push('/dashboard', { from: location });
      }
    }
  }, [store, projectID, history, location, keyID])

  const signOut = () => {
    console.log("SIGNOUT ")
    store.signout();
    history.push('/login', { from: location });
  }

  if (!isloaded) {
    return <Loading />
  }
  return (
    <div>
      <MenuBar document currentUser={store.currentUser} signOut={signOut} projectID={projectID} />
      <CardContainer />
    </div>
  );
}

export default observer(Document);