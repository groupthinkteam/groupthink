import React, { useEffect, useState } from "react";
import { useParams, useLocation, Redirect, Link, useHistory } from "react-router-dom";
import Loading from "../../components/Loading";
import isChild from "../Splash/SearchChild";
import * as Crypto from 'crypto-js';
export default function InvitationCheck(props) 
{
  const location = useLocation() 
  const history = useHistory();
  const { projectID ,permissionID} = useParams();
  React.useEffect(() => {
    (async () => {
      var  decryptPermissionID ;
      //----------Decrypt Credentials-----
      if(permissionID !=undefined)
      {
        decryptPermissionID = Crypto.AES.decrypt(permissionID,"grpthink12!").toString(Crypto.enc.Utf8);
      }
      const  checkInvite= await isChild(projectID,decryptPermissionID);
      if(checkInvite)
      {
        history.push(`/project/${projectID}`)
      }
      else
      {
        history.push('/error',{from : location})
      }
    })()
  }, [])
  return(<div>
      <Loading/>
  </div>)
} 
