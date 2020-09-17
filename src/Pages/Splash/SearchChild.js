import { firebaseDB } from "../../services/firebase";
import { auth } from "firebase"

const isChild = async (child) => {
    const uid = auth().currentUser?.uid
    const isChild = await firebaseDB.ref(`documents/${child}/`).once('value').then(snap => snap.exists())
    const Path = `documents/${child}/users/`;
    const isChildInUsers = await firebaseDB.ref(Path).once('value').then((snap)=>{ 
        console.log()
        //---False Project Id
        if(!isChild)
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
    return  isChildInUsers;
}
export default isChild; 
/**
 * else
        {
            const updates ={};
            updates[Path+uid] = "rw"
            const UpdatedCondition = (updates)=>{
                return  firebaseDB.ref().update(updates).then(()=>{return snap.child(uid).val()})
             }
            return UpdatedCondition(updates)
        }
 */