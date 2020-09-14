import React, { useState, useEffect } from "react";
import CardContainer from "./CardContainer";
import { firebaseDB, firebaseStoreRef, firbaseStorage } from "../../services/firebase";
import { auth } from "firebase";

export default function CardManager(props) {
    // store container-related state
    const [container, setContainer] = useState({ size: { width: 600, height: 800 }, cardOffset: {} });

    // everything to do with cards
    const [cards, setCards] = useState({});

    // position of the document center in the frame of local coords
    const [docCenter, setDocCenter] = useState({ x: 1000, y: 5000 })

    //State for Reparenting
    const [state,setState] = useState({})

    // project reference in firebase db
    const projectRef = firebaseDB.ref("documents/" + props.projectID + "/nodes");

    useEffect(() => {
        // TODO: split the nodes listener into separate ones for "child_added", 
        // "child_removed" and so on reduce size of snapshot received
        let projectRef = firebaseDB.ref("documents/" + props.projectID);
        projectRef.child("nodes").on("value", (snapshot) => {
            console.log("triggered node listener, received payload", snapshot.val());
            setCards(snapshot.val());
        });
        projectRef.child("center").on("value", (snapshot) => {
            console.log("triggered center location listener, received payload", snapshot.val());
            setDocCenter(snapshot.val());
        });
        projectRef.child("container").on("value", (snapshot) => {
            console.log("triggered container size listener, received payload", snapshot.val());
            setContainer(snapshot.val());
        });
        return () => {
            projectRef.child("nodes").off();
            projectRef.child("center").off();
            projectRef.child("container").off();
        }
    }, [props.projectID])

    //----Container Resize----
    const containeResize = (size) =>{
        //----- format    size:{width : 11 , height:12 } ----
        let updates = {};
        updates["documents/"+props.projectID+"/container/size"] = size
        firebaseDB.ref().update(updates).then(console.log("Resized to param ", size)).catch(err=>err)
    }
    //-------Card operations------------
    const onDelete = (id,parentId,children,type) => {
        let updates = {};
        console.log("OnDelete Params", id , parentId , children , type)
        if(props.projectID === parentId)
        {
            updates["documents/" + props.projectID + "/nodes/"+id] = null;
        }
        else
        {
            updates["documents/" + props.projectID + "/nodes/"+parentId+"/children/"+id] = null;
            updates["documents/" + props.projectID + "/nodes/"+id] = null;
        }
        //---Childrens Should be deleted---
        const ChildrenDelete = (children) => 
        {
            if(children!=null || children!=undefined)
            {Object.entries(children)
            .map((key,val)=>{
                //console.log("Children Key",key[0])
                updates["documents/"+props.projectID+"/nodes/"+key[0]] = null;
                FirebaseSearchPath(key[0])
            })}
        }
        const FirebaseSearchPath = (id) =>
        {
            firebaseDB.ref("documents/" + props.projectID + "/nodes/"+id+"/").on('value',snap=>{
                //console.log("Snapshot",snap.val()?.children)
                if(snap.val()?.children != null || snap.val()?.children != undefined)
                ChildrenDelete(snap.val().children)
            })
        }
        if(children != null || children !=undefined)
        {
            ChildrenDelete(children)
        }
        setCards({ ...cards, [id]: undefined });
        firebaseDB.ref().update(updates).then(console.log("deleted", id, "successfully"))
        //-----------If File is Uploaded -----------
        if(! (type === 'link' || type === 'blank')  )
        {
            const path = auth().currentUser?.uid+"/"+props.projectID+"/"+id+"/"+type+"/";
            const deleteFile = (pathToFile , fileName) => {
                const ref = firbaseStorage().ref(pathToFile);
                const childRef = ref.child(fileName);
                childRef.delete().then(console.log("File Deleted"))
            }
            const deleteFolderContents = (path) =>{
                var storageRef = firbaseStorage().ref(path);
                storageRef.listAll()
                .then((dir)=>{
                    //-------Files Exist-------
                    if(dir.items.length > 0)
                    {
                        dir.items.forEach((fileRef)=>{
                          deleteFile(storageRef.fullPath , fileRef.name)
                        })
                        dir.prefixes.forEach(folderRef => {
                            deleteFolderContents(folderRef.fullPath);
                        })
                    }
                    else
                    {
                        console.log("No Files Exist")
                    }
                })
                .catch(error => {
                    console.log(error);
                });
            }

            deleteFolderContents(path)
            //storageRef.delete().then(console.log("File Deleted Successfully")).catch((err)=>console.log(err))
        }
    }

    // update local state during card drag
    // if card crosses tripwires on any side, expand ccontainer
    // and adjust document center
    const localMove = (id, newPos, cardSize) => {

        setCards({ ...cards, [id]: { ...cards[id], position: newPos } });
    }

    const savePosition = (id, newPos) => {
        projectRef.child(id).child("position").set(newPos).then(console.log("set new position for", id, "to", newPos));
    }

    const onResize = (id, newSize) => {
        setCards({ ...cards, [id]: { ...cards[id], size: newSize } });
        projectRef.child(id).child("size").set(newSize).then(console.log("set new size for", id, "to", newSize));
    }

    // initially adds a blank card, type is inferred later
    let addCard = (type) => ()=> {
        if(type === undefined || type === null)
        {
            type = "blank"
        }
        const blankCard = {
            type: type,
            size: { width: 275, height: 375 },
            position: { x: 300, y: 300 },
            content: {
                text: `This is a ${type} Card`
            },
            parent: `${props.projectID}`
        }
        let newCardKey = projectRef.push().key;
        setCards({ ...cards, [newCardKey]: blankCard });
        projectRef.child(newCardKey).set(blankCard).then(console.log("added new card with key", newCardKey));
    }
    
    const changeType = (id, newType) => {
        setCards({ ...cards, [id]: { ...cards[id], type: newType } });
        projectRef.child(id).child("type").set(newType).then(console.log("set new type for", id, "to", newType));
    }

    // update card content locally for controlled rendering purposes
    const changeContent = (id, newContent) => {
        console.log("triggered content change on", id)
        setCards({ ...cards, [id]: { ...cards[id], content: newContent } });
    }

    // push card content to firebase
    const saveContent = (id, newContent) => {
        changeContent(id, newContent);
        console.log("hello")
        projectRef.child(id).child("content").set(cards[id]["content"])
            .then(console.log("saved new content for", id));
    }
    //-------Subnodes Operation------
    const addSubNodes = (parentId,type) =>{
        if(type === undefined || type === null)
        {
            type = "blank"
        }
        const blankCard = {
            type: type,
            size: { width: 275, height: 375 },
            position: { x: 300, y: 300 },
            content: {
                text: `This is a ${type} card`
            },
            parent: parentId
        }
        const newCardKey = projectRef.push().key;
        const childpath = "documents/"+props.projectID+"/nodes/"+parentId+"/children/"+newCardKey;
        let update={};
        update[childpath] = 1;
        firebaseDB.ref().update(update).then(console.log("successfully added a new Child in Parent"))
        setCards({ ...cards, [newCardKey]: blankCard });
        projectRef.child(newCardKey).set(blankCard).then(console.log("added new card with key", newCardKey));
    }
    //--------------Reparenting On DB-----------
    const reparentChild=(requestId, acquiredId)=>{
        let updates = {};
        let pastParentId;
        //---------add to new Parent and it's properties ------
        updates["documents/"+props.projectID+"/nodes/"+acquiredId+"/children/"+requestId] = 1
        updates["documents/"+props.projectID+"/nodes/"+requestId+"/parent"] = acquiredId
        firebaseDB.ref("documents/"+props.projectID+"/nodes/"+requestId+"/parent").once('value',snap=>{
                pastParentId=snap.val();
                console.log("Parent ID",pastParentId)
                updates["documents/"+props.projectID+"/nodes/"+pastParentId+"/children/"+requestId] = null
        });
        //------ Pat Parent Id should be null ------
        
        console.log("UPDATES",updates)
        firebaseDB.ref().update(updates)
        .then(console.log("successfully Changed Location of ",requestId, " To ", acquiredId))
        .catch(err=>{return err})
    }
    const acquireId =(acquiredId) =>
    {
        let flag=0;
        const CheckSubNodes = (id) =>
        {
            var path = "documents/"+props.projectID+"/nodes/"+id+"/";
                    firebaseDB.ref(path).on('value',snap=>{
                        const nodeCardDetail = snap.val();
                        if(nodeCardDetail?.children != undefined || nodeCardDetail?.children != null)
                        {
                            CheckReparenting(nodeCardDetail.children)
                        }
                    })
        }
        const CheckReparenting = (data) => {
            Object.entries(data)
            .map((key,val)=>{
                if(acquiredId == key[0])
                {flag=flag + 1;}
                else
                { 
                    //----------------Should Not Reparent the subnodes(No Cycles should be Formed)  ---------
                    CheckSubNodes(key[0])   
                }
            })
        }
        console.log("Acquire Called",acquiredId,state)
        
        //---------------- Reparent Should not Call itself Check------------------
        if( (state?.requestId!= undefined || state?.requestId!= null  ) && state?.requestId != acquiredId)
        {
            //----------Parent Shouldn't Reparent It's Own Child------------
            if(state.cardDetail?.children != null || state.cardDetail?.children != undefined)
            {
                console.log("Parent Shouldn't Reparent It's Own Child")
                
                CheckReparenting(state.cardDetail?.children)
                
            }
            if(flag==0)
            {
            console.log("Reparent",state.requestId);
            reparentChild(state.requestId,acquiredId)
            setState(null);
            }
        }
    }
    const reparentNodesT = (requestId,cardDetail) => 
    {
       console.log("Rreparent CAlled",requestId)
        setState({requestId:requestId , cardDetail:cardDetail})
    }
    // bundling card api methods for ease of transmission
    let cardAPI = {
        add: addCard,
        remove: onDelete,
        localMove: localMove,
        saveMove: savePosition,
        resize: onResize,
        type: changeType,
        change: changeContent,
        save: saveContent,
        addChild : addSubNodes,
        requestReparent:reparentNodesT,
        sendPath : acquireId
    }

    return (
        <CardContainer
            container={container}
            cards={cards}
            cardAPI={cardAPI}
            projectID={props.projectID}
        />
    )
}