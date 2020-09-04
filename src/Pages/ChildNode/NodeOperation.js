import { firebaseDB } from "../../services/firebase";

export const onDelete=(projectId,nodeId) =>{
    console.log("about to delete project", nodeId);
    let updates = {};
    updates["documents/" + projectId + "/nodes/"+nodeId] = null;
    firebaseDB.ref().update(updates).then(console.log("deleted", nodeId, "successfully"))
}
export const onMove = (projectId,nodeId,newPos) => {
    console.log("About to move",nodeId);
    let updates = {};
    updates["documents/"+projectId+"/nodes/"+nodeId+"/location-xy/"] = {x:newPos.x , y:newPos.y};
    updates["documents/"+projectId+"/nodes/"+nodeId+"/size-wh/"] = {width:newPos.width, height : newPos.height};
    firebaseDB.ref().update(updates).then(console.log(` ${nodeId} Moved to position ${newPos}`));
}
export const onResize = (projectId,nodeId,newSize) => {
    console.log("About to move",nodeId);
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