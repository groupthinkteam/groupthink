import React, { useEffect, useState } from "react";
import MenuBar from "../../components/MenuBar/MenuBar";
import Loading from "../../components/Loading";
import CardContainer from "../../components/DocumentCanvas/CardContainer";
import { observer } from "mobx-react-lite";
import { useStore } from "../../store/hook";
import { useHistory, useParams } from "react-router-dom";


function Document() {
  let store = useStore();
  const history = useHistory();
  const {projectID}=useParams();
  const [isloaded, setIsLoaded] = useState(false);
  useEffect(() => {
    store.isProjectValid(projectID,data=>{
      console.log("DATA ",data)
      if(data)
      {
        setTimeout(() => setIsLoaded(true), 4000)
        store.projectID=projectID
        store.addDocumentListeners()
        return () => store.removeDocumentListeners()
      }
      else
      {
        history.push('/dashboard');
      }
    })
  }, [store,projectID,history])

  const signOut = () => {
    console.log("SIGNOUT ")
    store.signout();
    history.push('/login');

  }

  if (!isloaded) {
    return <Loading />
  }
  return (
    <div>
      <MenuBar document currentUser={store.currentUser} signOut={signOut} />
      <CardContainer />
    </div>
  );
}

export default observer(Document);