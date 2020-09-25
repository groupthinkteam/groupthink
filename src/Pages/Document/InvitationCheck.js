import React, { useEffect } from "react";
import { useParams, useLocation, useHistory } from "react-router-dom";
import Loading from "../../components/Loading";
import isChild from "../Splash/SearchChild";
import * as Crypto from 'crypto-js';

/**
 * This File Validates The URL `project/projectID/:permission`
 * If Valid Then Redirects to `projects/:projectid`
 * If Not then Redirect to Error Containing in Link
 * And Till That Time Loader is Rendered
 */
export default function InvitationCheck() 
{
  const location = useLocation() 
  const history = useHistory();
  const { projectID ,permissionID} = useParams();
  useEffect(() => {
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
