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
                updates[newPath]= 1;
                //-------In the SubNodes ------
               /* updates[path+childID]={
                        title:"New Child Node",
                        content : "Content ...",
                        parent : parentId
                }*/
                //----------In Nodes
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
export const onReparenting = (projectId,requestId, acquiredId) =>
{
        console.log("On Reparenting ", requestId , " To " , acquiredId);
        let updates = {};
        let pastParentId;
        //---------add to new Parent and it's properties ------
        updates["documents/"+projectId+"/nodes/"+acquiredId+"/children/"+requestId] = 1
        updates["documents/"+projectId+"/nodes/"+requestId+"/parent"] = acquiredId
        firebaseDB.ref("documents/"+projectId+"/nodes/"+requestId+"/parent").once('value',snap=>{
                pastParentId=snap.val();
                console.log("Parent ID",pastParentId)
                updates["documents/"+projectId+"/nodes/"+pastParentId+"/children/"+requestId] = null
        });
        //---Pat Parent Id should be null ---
        
        console.log("UPDATES",updates)
        firebaseDB.ref().update(updates)
        .then(console.log("successfully Changed Location of ",requestId, " To ", acquiredId))
        .catch(err=>{return err})
}       
 