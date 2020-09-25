import { firebaseDB } from "../../services/firebase";
import { auth } from "firebase"

/**
 * @function
 * This Function Search Child For Route Path `/project/:projectID` & `Inivitation Link`
 * @param {String} child Contains projectID Which is going to be authenticate in `documents/{child}/`
 * @param {String} permissionID Permission Associated to the project .
 * @returns project Validation Check i.e. if Valid then Returns `Permission Associated` to it OR
 * If not authenticated then Returns `Null`
 */

const isChild = async (child,permissionID) => {
    const uid = auth().currentUser?.uid
    const ischild = await firebaseDB.ref(`documents/${child}/`).once('value').then(snap => snap.exists())
    const Path = `documents/${child}/users/`;
    const isChildInUsers = await firebaseDB.ref(Path).once('value').then((snap)=>{ 
        //---False Project Id
        if(!ischild)
        {
            return null
        }
        //---Internal Check----
        if(snap.hasChild(uid))
        {
            //----Returns The Permission---
            return snap.child(uid).val()
        }
        if(snap.hasChild("public"))
        {
            //---Return Permission For Public----
            return snap.child("public").val()
        }
        else
        {
            return null
        }
    })
    
    //------Privately Send Invitation Params---
    if(permissionID != undefined)
    {
        //-----Create This To Access Project-----
        console.log(permissionID)
        const flag = await createUserForProject(Path,uid,permissionID)
        return   flag;
    }
    else
    return  isChildInUsers ;
}
/**
 * This Function is invoked When and authenticated User Gets Invitation Link .
 * This Updates the Permission GIven in Link to Database For Further Operation.
 * @param {String} path Path of Directory Where User's Permission is Created
 * @param {String} child Project ID To Which Permission is Granted  
 * @param {String} permission Permission of User in Link
 * @returns `True` If Created Permission to User  Else `False`
 */
const createUserForProject =async(path,child,permission)=>{ 
    const updates = {}
    updates[path+child]=permission
    if(permission === "r" || permission === "rw")
    {
        const updatePrivate = await firebaseDB.ref().update(updates).then(()=>{return true}).catch(()=>{return false});
        return updatePrivate;
    }
    else
    return false;    
}
export default isChild; 
