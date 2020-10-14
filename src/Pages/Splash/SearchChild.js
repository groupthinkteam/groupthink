import { firebaseDB, firebaseFunction, firebaseTIME } from "../../services/firebase";
import { auth } from "firebase"

/**
 * This File Search Child For Route Path ="/project/:projectID" & Inivitation Link
 */
const isChild = async (child,permissionID,typeID , nameID) => {
    const uid = auth().currentUser?.uid;
    const Path = `documents/${child}/users/`;
    
    //------Privately Send Invitation Params---
    if(permissionID != undefined )
    {
        //-----Create This To Access Project-----
        console.log("Permission in Search Child",permissionID)
        const flag = await createUserinDocument(Path,child,permissionID,uid)
        const updateUser = await updateInUserTree(uid,child,typeID,nameID,permissionID);
        console.log("If User is Updated in User Tree ",updateUser)
        return   flag;
    }
    //-----When Project Detail Page is Rendered---
    else
    {
        const ischildren = await firebaseDB.ref(`documents/${child}/`).once('value').then(snap => snap.exists()).catch(err=>console.log("isCHild Error \n",err))
        console.log('isChildren',ischildren)
        //---If Project Id Exists in DOcument
        if(ischildren!=undefined &&  ischildren)
        {
            const isOwner = await firebaseDB.ref("users/"+uid+"/projects/"+child+"/shared").once('value').then(snap => snap.exists()).catch(err=>console.log("iS Owner Error",err))
            firebaseDB.ref(`documents/${child}/users/${uid}/`).update({lastUpdatedAt:firebaseTIME}).then(console.log("Updated LastUpdated Prop")).catch(err=>console.log("Update in LastUpdate Error \n",err))
            firebaseDB.ref("users/"+uid+"/projects/"+child).update({createdAt:firebaseTIME}).then(console.log("Updated cratedAt Prop")).catch(err=>console.log("Update in LastUpdate Error \n",err))
            const isChildInUsers = await firebaseDB.ref(Path).once('value').then((snap)=>{ 
                
                //---Internal Check----
                if(snap.hasChild(uid))
                {
                    //----Returns The Permission---
                    
                    return snap.child(uid).val().permission
                }
                if(snap.hasChild("public"))
                {
                    //---Return Permission For Public----
                    return snap.child("public").val().permission
                    
                }
                else
                {
                    return null
                }
            })
            .catch(err=>console.log("IschildinUsers Error \n",err))
            return  [isChildInUsers , isOwner] ;
        }
        else
        return [null ,null ]
    }
    
}
/**
 * Create user in Document For Invitation Link
 * @param {String} path 
 * @param {String} child 
 * @param {String} permission 
 * @param {String} uid 
 */
const createUserinDocument =async(path,child,permission,uid)=>{ 
    const updates = {}
    //Initialize cursor Axis
    updates[`documents/${child}/cursors/${uid}`] = {
        x:0,
        y:0
    };
    // Update the Time 
    updates[`documents/${child}/lastActive/${uid}`] ={
        time:firebaseTIME
    }
    //Enter User to Document-Users Tree
    updates[path+uid] ={
        name : auth().currentUser.displayName,
        photoURL : auth().currentUser.photoURL,
        email: auth().currentUser.email,
        permission:permission,
        lastUpdatedAt:firebaseTIME
    }
    if(permission === "r" || permission === "rw")
    {
        var addMsg = firebaseFunction.httpsCallable('createNewProject')
        var t = addMsg(updates).then((result) =>{return true}).catch(err => console.log(err))
        console.log("user Created", t)
        
        return t;
    }
    else
    return false;    
}
/**
 * Create User in DB's User's Tree for `All type`
 * @param {String} uid 
 * @param {String} projectID 
 * @param {String} typeID 
 * @param {String} nameID 
 * @param {String} permissionID 
 */
const updateInUserTree = async(uid , projectID , typeID, nameID , permissionID ) => {
    const projectMetdata = await firebaseDB.ref("documents/"+projectID+"/metadata/").once('value').then(snap =>{console.log(snap.val());return snap.val()}).catch(err=>console.log("Updated In User Tree Error",err))
    var isLocked = true;
    if(permissionID === 'rw')
    {
        isLocked = false;
    }
    console.log("Project MEtadata \n",projectMetdata?.name )
    const updates = {};
    updates["users/"+uid+"/projects/"+projectID+"/"] = {
        access : permissionID,
        name : projectMetdata?.name,
        thumbnailURL : projectMetdata?.thumbnailURL,
        isLocked :isLocked,
        createdAt : firebaseTIME,
        shared : {
            name: nameID,
            type : typeID
        }
    } 
    updates["creator/"+projectID] = uid
    var addMsg = firebaseFunction.httpsCallable('createNewProject')
    var t = addMsg(updates).then((result) =>{return true}).catch(err => console.log(err))
    console.log("user Created", t)
    return t;
}
export default isChild;  
