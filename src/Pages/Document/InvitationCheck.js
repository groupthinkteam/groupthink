import React, { useEffect, useState } from "react";
import { useParams, useLocation, useHistory } from "react-router-dom";
import Loading from "../../components/Loading";
import isChild from "../Splash/SearchChild";
import * as Crypto from 'crypto-js';
export default function InvitationCheck(props) 
{
  const location = useLocation() 
  const history = useHistory();
  const { projectID ,permissionID} = useParams();
  function replaceAll(str, term, replacement) {
    return str.replace(new RegExp(escapeRegExp(term), 'g'), replacement);
  }
  function escapeRegExp(string){
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  } 
  React.useEffect(() => {
    (async () => {
      var  decryptPermissionID ;
      //----------Decrypt Credentials-----
      if(permissionID !=undefined)
      {
        const custom = replaceAll(permissionID,'$','/')
        decryptPermissionID = Crypto.AES.decrypt(custom,"grpthink12!").toString(Crypto.enc.Utf8);
        console.log("Permission ID DEcrypt",decryptPermissionID,permissionID,custom)
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
