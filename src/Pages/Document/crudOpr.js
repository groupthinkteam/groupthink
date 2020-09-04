import { firebaseDB } from "../../services/firebase";
export const readFROMDB = (refURL , callback  ) => {
        firebaseDB.ref(refURL).on('value' ,snap=>{
                callback(snap.val())
        });         
}
export const writeToDB = (path,projectId,parentId) =>
{
        console.log("clicked add new");
        let childID = firebaseDB.ref().child(path).push().key;
        let updates = {};
        if(parentId!=null)
        {
                let newPath = `documents/${projectId}/nodes/${parentId}/children/${childID}`
                updates[newPath]=1
                updates[path+childID]={
                        title:"New Child Node",
                        content : "Content ...",
                        parent : parentId
                }
                updates[`documents/${projectId}/nodes/`+childID]={
                        title:"New Child Node",
                        content : "Content ...",
                        parent : parentId
                }
        }//const thumbnail = "https://picsum.photos/200?random=" + Math.floor(Math.random() * 100) ;
        else
        {
                updates[path+childID]={
                        title:"New Child Node",
                        content : "Content ...",
                        parent : projectId
                }
        }       
        firebaseDB.ref().update(updates).then(console.log("successfully added a new project with id", childID))
}
export const onRename = (path,nodeId, text) => {
        console.log("about to rename project,  changing title from to", text);
        let updates = {};
        updates[path] = text;
        firebaseDB.ref().update(updates).then(console.log("successfully renamed project", nodeId, "to", text))
}
export const onReparenting = (pathFrom , data , pathTo) =>
{
        console.log("On Reparenting ", pathFrom , " To " , pathTo);
        let updates = {};
        //updates[pathFrom] = null;
        updates[pathTo] = data;
        firebaseDB.ref().update(updates)
        .then(console.log("successfully Changed Location From ",pathFrom, " To ", pathTo))
        .catch(err=>{return err})
}       
 