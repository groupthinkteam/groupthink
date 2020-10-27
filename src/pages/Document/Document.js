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
        history.push('/dashboard',{from:location});
      }
    })
  }, [store,projectID,history,location])

  const signOut = () => {
    console.log("SIGNOUT ")
    store.signout();
    history.push('/login',{from:location});

  }

  if (!isloaded) {
    return <Loading />
  }
  return (
    <div>
      <MenuBar document currentUser={store.currentUser} signOut={signOut} projectID={projectID}/>
      <CardContainer />
    </div>
  );
}

export default observer(Document);