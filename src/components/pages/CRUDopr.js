import React , {useState}from "react"
import firebase from "firebase/app"
import "firebase/database"
import "firebase/auth"


export const readFromDB = (refURL  ) => {
        let [data , setData] = useState({}) ;
        const database = firebase.database();
        database.ref(refURL).once('value')
        .then((snapshot) => {
            console.log('Snapshot CRUD ', snapshot);
            setData(snapshot.val());
        });
        return data;
}
export const writeToDB = (database , refURL,text) =>
{
        evt.preventDefault();
        database.ref(refURL).push(text);
        //---- Reload Window --------
        window.location.reload(false);
}
export const deleteFromDB = (database ,refURL,title , key_id) =>
{
        alert(`Do You Want to Delete ${title}`);
         database.ref(refURL + key_id).remove();
        window.location.reload(false);
}
export const updateTheDB = (database , refURL,key_id,text) => 
{
        console.log("PROTEXT",text);
         database.ref(refURL+key_id).update({text});
        window.location.reload(false);
}  