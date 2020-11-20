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
  let { projectID } = useParams();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    console.log("opening project", projectID);
    store.projectID = projectID
    store.addDocumentListeners()
    return () => store.removeDocumentListeners()
  }, [store, projectID])

  useEffect(() => {
    store.addCursorListener()
    return () => store.removeCursorListener()
  }, [store])

  const signOut = () => {
    console.log("SIGNOUT ")
    store.signout();
    history.push('/login', { from: location });
  }

  if (store.documentLoadPercent > 1 && !isLoaded) {
    setIsLoaded(true)
  }

  if (!isLoaded) {
    return <Loading />
  }
  return (
    <div>
      <MenuBar document signOut={signOut} projectID={projectID} />
      <CardContainer />
    </div>
  );
}

export default observer(Document);