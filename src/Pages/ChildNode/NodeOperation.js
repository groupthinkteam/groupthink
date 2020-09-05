import { firebaseDB } from "../../services/firebase";

export const onDelete=(projectId,nodeId,parentId,children) =>{
    console.log("about to delete project", nodeId);
    let updates = {};
    let details ;
    //----If Parent Delete ---
    if(projectId == parentId)
    {
        updates["documents/" + projectId + "/nodes/"+nodeId] = null;
    }
    //-------Child Node Delete ---
    else
    {
        updates["documents/" + projectId + "/nodes/"+parentId+"/children/"+nodeId] = null;
        updates["documents/" + projectId + "/nodes/"+nodeId] = null;
    }
    //---Childrens Should be deleted---
    const ChildrenDelete = (children) => 
    {
        Object.entries(children)
        .map((key,val)=>{
            //console.log("Children Key",key[0])
            updates["documents/"+projectId+"/nodes/"+key[0]] = null;
            FirebaseSearchPath(key[0])
        })
    }
    const FirebaseSearchPath = (id) =>
    {
        firebaseDB.ref("documents/" + projectId + "/nodes/"+id+"/").on('value',snap=>{
            //console.log("Snapshot",snap.val()?.children)
            if(snap.val()?.children != null || snap.val()?.children != undefined)
            ChildrenDelete(snap.val().children)
        })
    }
    if(children != null || children !=undefined)
    {
        ChildrenDelete(children)
    }
    firebaseDB.ref().update(updates).then(console.log("deleted", nodeId, "successfully"))
}
export const onMove = (projectId,nodeId,newPos) => {
    //console.log("About to move",nodeId);
    let updates = {};
    updates["documents/"+projectId+"/nodes/"+nodeId+"/location-xy/"] = {x:newPos.x , y:newPos.y};
    updates["documents/"+projectId+"/nodes/"+nodeId+"/size-wh/"] = {width:newPos.width, height : newPos.height};
    firebaseDB.ref().update(updates).then(console.log(` ${nodeId} Moved to position ${newPos}`));
}
export const onResize = (projectId,nodeId,newSize) => {
    //console.log("About to move",nodeId);
    let updates = {};
    updates["documents/"+projectId+"/nodes/"+nodeId+"/size-wh/"] = {width:newSize.width, height : newSize.height};
    firebaseDB.ref().update(updates).then(console.log(` ${nodeId} Moved to position ${newSize}`));
}
export const onContentChange = (projectId,nodeId , content) => {
    console.log("Avout ot Content change of ID",nodeId);
    let updates = {};
    updates["documents/"+projectId+"/nodes/"+nodeId+"/content/"] = {content : content};
    firebaseDB.ref().update(updates).then(console.log(`Content changed of ${nodeId} to ${content}`));
}