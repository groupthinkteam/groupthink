import { firebaseDB } from "../../services/firebase";
import { auth } from "firebase"

/**
 * This File Search Child For Route Path ="/project/:projectID" & Inivitation Link
 */
const createUserForProject =async(path,child,permission)=>{ 
    const updates = {}
    updates[path+child]=permission
    const updatePrivate = await firebaseDB.ref().update(updates).then(()=>{return true}).catch(()=>{return false});
    return updatePrivate;
}
const isChild = async (child,senderID,permissionID) => {
    let flag = false;
    const uid = auth().currentUser?.uid
    const ischild = await firebaseDB.ref(`documents/${child}/`).once('value').then(snap => snap.exists())
    const Path = `documents/${child}/users/`;
    const isChildInUsers = await firebaseDB.ref(Path).once('value').then((snap)=>{ 
        console.log()
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
    if(senderID != undefined)
    {
        //-----Create This To Access Project-----
        flag = await createUserForProject(Path,uid,permissionID)
        return  [isChildInUsers , flag];
    }
    else
    return  [isChildInUsers , flag];
}
export default isChild; 
