import React , {useState}from "react"
import firebase from "firebase/app"
import "firebase/database"


 //----- For Debug ----
 const reload = (reload) => {
       //window.location.reload(!reload);
    }

export const readFROMDB = (refURL , callback  ) => {
        
        const database = firebase.database();
        database.ref(refURL).on('value',snap=>{
                callback(snap.val())
        });
      /*  .then((snapshot) => {
            console.log('Snapshot CRUD ', snapshot);
                callback(snapshot.val());
        });
      */
}
export const writeToDB = (path,text,re_load) =>
{
        console.log("path",path)
        const database = firebase.database();
        database.ref(path).push(text);
        //---- Reload Window --------
       reload(re_load);
}
export const deleteFromDB = (path,title , id,re_load) =>
{
        console.log("DELETE METHOD", path , title ,id)
        const database = firebase.database();
        alert(`Do You Want to Delete ${title}`);
        database.ref(path+id).remove();
        reload(re_load)
}
export const updateTheDB = (path,id,text,re_load) => 
{
        var up = {};
        const database = firebase.database();
        //console.log("Update Text",text);
        up[id]=text;
        database.ref(path).update(up);
        reload(re_load);
}  