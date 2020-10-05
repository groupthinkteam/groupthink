import { firebaseDB, firebaseFunction } from "../../services/firebase";
import { auth } from "firebase"

/**
 * This File Search Child For Route Path ="/project/:projectID" & Inivitation Link
 */
const createUserForProject =async(path,child,permission,uid)=>{ 
    const updates = {}
    updates[path+uid]=permission;
    updates[`documents/${child}/room/`+uid] ={
        X_POS : 0 ,
        Y_POS : 0
    }
    if(permission === "r" || permission === "rw")
    {
        //const updatePrivate = await firebaseDB.ref().update(updates).then(()=>{return true}).catch((err)=>{console.log(err); return false});
        var addMsg = firebaseFunction.httpsCallable('createNewProject')
        var t = addMsg(updates).then((result) =>{return true}).catch(err => console.log(err))
        console.log("user Created", t)
        
        return t;
    }
    else
    return false;    
}
const createRoom = async(child,uid) =>
{
    const updates = {};
    updates[`documents/${child}/room/`+uid] ={
        X_POS : 0 ,
        Y_POS : 0
    }
    
    const roomflag = await firebaseDB.ref().update(updates).then(console.log("Created ROOM")).catch(err=>err)
    return roomflag
}
const isChild = async (child,permissionID) => {
    const uid = auth().currentUser?.uid
    const ischild = await firebaseDB.ref(`documents/${child}/`).once('value').then(snap => snap.exists()).catch(err=>err)
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
            const test = createRoom(child,uid).then(resultt=>resultt).catch(err=>err)
            console.log(test)
            return snap.child("public").val()
            
        }
        else
        {
            return null
        }
    })
    .catch(err=>err)
    
    //------Privately Send Invitation Params---
    if(permissionID != undefined)
    {
        //-----Create This To Access Project-----
        console.log(permissionID)
        const flag = await createUserForProject(Path,child,permissionID,uid)
        return   flag;
    }
    else
    return  isChildInUsers ;
}
export default isChild; 
