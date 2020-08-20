import React , {useState}from "react"
import { firebaseDB } from "../services/firebase";


export const readFROMDB = (refURL , callback  ) => {
        //console.log("CRUD READ",refURL)
        firebaseDB.ref(refURL).once('value')//,snap=>{
        //        callback(snap.val())
        //});
        .then((snapshot) => {
           // console.log('Snapshot CRUD ', snapshot.val());
                callback(snapshot.val());
        });
      
}
export const writeToDB = (path,text,re_load) =>
{
        //alert.log("Write",path,text)
        console.log("path",path,text)
        firebaseDB.ref(path).push(text);
        //---- Reload Window --------
       
}
export const deleteFromDB = (path,title , id,re_load) =>
{
        console.log("DELETE METHOD", path , title ,id)
        alert(`Do You Want to Delete ${title}`);
        firebaseDB.ref(path+'/'+id).remove();
}
export const updateTheDB = (path,id,text,re_load) => 
{
        var up = {};
        console.log("Update METHOD",path,id,text);
        up[id]=text;
        firebaseDB.ref(path).update(up);
}  