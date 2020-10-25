import React, { useEffect, useState } from "react";
import MenuBar from "../../components/MenuBar/MenuBar";
import Loading from "../../components/Loading";
import CardContainer from "../../components/DocumentCanvas/CardContainer";
import { observer } from "mobx-react-lite";
import { useStore } from "../../store/hook";


function Document(props) {

  let store = useStore();

  const [isloaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 4000)
    store.addDocumentListeners()
    return () => store.removeDocumentListeners()
  }, [])

  if (!isloaded) {
    return <Loading />
  }
  return (
    <div>
      {/* <MenuBar document /> */}
      <CardContainer />
    </div>
  );
}

export default observer(Document);