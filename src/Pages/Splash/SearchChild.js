import { firebaseDB } from "../../services/firebase";
import { auth } from "firebase"

const isChild = (child)=>{
    console.log("Chiled",child)
    let childVal=null;
    if(child!=undefined)
        firebaseDB.ref(`users/${auth().currentUser?.uid}/projects/`).on('value',snap=>{
            childVal = snap.hasChild(child).valueOf()
            console.log("Child Val",childVal)
       });
    if(childVal !=null)
    return childVal
    else
    return false
}
export default isChild;