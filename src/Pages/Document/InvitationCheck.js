import React, { useEffect, useState } from "react";
import { useParams, useLocation, useHistory } from "react-router-dom";
import Loading from "../../components/Loading";
import isChild from "../Splash/SearchChild";
import * as Crypto from 'crypto-js';
export default function InvitationCheck(props) 
{
  const location = useLocation() 
  const history = useHistory();
  const { projectID ,permissionID , typeID , nameID} = useParams();
  function replaceAll(str, term, replacement) {
    return str.replace(new RegExp(escapeRegExp(term), 'g'), replacement);
  }
  function escapeRegExp(string){
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  } 
  React.useEffect(() => {
    (async () => {
      var  decryptPermissionID,decryptTypeID,decryptNameID ;
      //----------Decrypt Credentials-----
      if(permissionID !=undefined)
      {
        const customPermission = replaceAll(permissionID,'$','/');
        const customType = replaceAll(typeID , '$','/');
        const customName = replaceAll(nameID,'$','/')
        decryptPermissionID = Crypto.AES.decrypt(customPermission,"grpthink12!").toString(Crypto.enc.Utf8);
        decryptTypeID = Crypto.AES.decrypt(customType,"grpthink12!").toString(Crypto.enc.Utf8)
        decryptNameID = Crypto.AES.decrypt(customName,"grpthink12!").toString(Crypto.enc.Utf8)
        // console.log("Permission ID DEcrypt",decryptPermissionID,permissionID,customPermission)
        // console.log("Type ID Decrypt ",decryptTypeID,customType,typeID );
        // console.log("Decrypt Name ID ",decryptNameID,customName,nameID);
      }
      const checkInvite= await isChild(projectID,decryptPermissionID,decryptTypeID,decryptNameID);
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
