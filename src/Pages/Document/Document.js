import React, { useEffect, useState } from "react";
import MenuBar from "../../components/MenuBar/MenuBar";
import Loading from "../../components/Loading";
import CardContainer from "../../components/DocumentCanvas/CardContainer";

export default function Document(props) {
  const [isloaded, setIsLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setIsLoaded(true), 4000) }, [])

  if (!isloaded) {
    return <Loading />
  }
  return (
    <div>
      <MenuBar document />
      <CardContainer />
    </div>
  );
}