import { firebaseDB } from "../../services/firebase";
import { auth } from "firebase"

export const isChild = (child,callback)=>{
    if(child!=undefined)
    firebaseDB.ref(`users/${auth().currentUser?.uid}/projects`).once('value',snap=>{
        //if(! snap.hasChild(child))
        callback(snap.hasChild(child))//page="/dashboard"
    });
}