import { firebaseDB } from "../../services/firebase";


export const readFROMDB = (refURL , callback  ) => {
        firebaseDB.ref(refURL).on('value' ,snap=>{
                callback(snap.val())
        });         
}
export const writeToDB = (path) =>
{
        console.log("clicked add new")
        let projectID = firebaseDB.ref().child(path).push().key;
        let updates = {};
        //const thumbnail = "https://picsum.photos/200?random=" + Math.floor(Math.random() * 100) ;
        updates[path+projectID]={
                title:"New Child Node",
                content : "Content ..."
        }
        firebaseDB.ref().update(updates).then(console.log("successfully added a new project with id", projectID))
}
export const onRename = (path,nodeId, text) => {
        console.log("about to rename project,  changing title from to", text);
        let updates = {};
        updates[path] = text;
        firebaseDB.ref().update(updates).then(console.log("successfully renamed project", nodeId, "to", text))
}
 