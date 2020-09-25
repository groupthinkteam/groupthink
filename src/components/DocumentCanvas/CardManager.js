import React, { useState, useEffect } from "react";
import CardContainer from "./CardContainer";
import { firebaseDB, firebaseStoreRef, firbaseStorage } from "../../services/firebase";
import { auth } from "firebase";

export default function CardManager(props) {
    // store container-related state
    const [container, setContainer] = useState({ size: { width: 600, height: 800 }, cardOffset: {} });

    // everything to do with cards
    const [cards, setCards] = useState({});

    /**  position of the document center in the frame of local coords*/
    const [docCenter, setDocCenter] = useState({ x: 1000, y: 5000 })

    /** Stores State for Reparenting*/
    const [reparentState,setReparentState] = useState({})

    /**project reference in firebase db */
    const projectRef = firebaseDB.ref("documents/" + props.projectID + "/nodes");

    /**Project Path In Storage 
     * 
     * `root/projectID/` To concate the Id*/
    const storageRef = "root/"+props.projectID+"/";

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

    /**
     * Function Updates the Size of Container Size to Database.
     * @param {*} size The Params Contains the updated Size of Container
     */
    const containeResize = (size) =>{
        //----- format    size:{width : 11 , height:12 } ----
        let updates = {};
        updates["documents/"+props.projectID+"/container/size"] = size
        firebaseDB.ref().update(updates).then(console.log("Resized to param ", size)).catch(err=>err)
    }
    /**
     * This Function Deletes the Given Id And Romove From:-
     * Storage ,
     * Database.
     * @param {*} id Id of Node That Has To be Delete 
     * @param {*} operation Operation is Optional Argument Which Contains the type of Operation is Going to Perform
     */
    const onDelete = (id,operation) => {
        const parentId = cards[id].parent;
        const children = cards[id].children;
        const type = cards[id].type;
        let updates = {} , flag=true;
        console.log("OnDelete Params", id , parentId , children , type , operation)
        if(props.projectID === parentId)
        {
            updates["documents/" + props.projectID + "/nodes/"+id] = null;
        }
        else
        {
            updates["documents/" + props.projectID + "/nodes/"+parentId+"/children/"+id] = null;
            updates["documents/" + props.projectID + "/nodes/"+id] = null;
        }
        /**
         * Function Separated The Children ID from Children Argument And 
         * Internally Calls the Database Function to Search Childs and Perform 
         * Operation According to Operation ID
         * @param {*} children 
         * @param {*} operationID 
         */
        const ChildrenDelete = (children,operationID) => 
        {
            if(children!=null || children!=undefined)
            {
                Object.entries(children)
                .map((key,val)=>{
                    //console.log("Children Key",key[0])
                    if(operationID === 1)
                    {
                        updates["documents/"+props.projectID+"/nodes/"+key[0]] = null;
                        
                    }
                    else if(operationID === 2)
                    {
                        updates["documents/"+props.projectID+"/nodes/"+key[0]+"/parent/"] = props.projectID;
                    }
                        
                    FirebaseSearchPath(key[0],operationID)
                })
            }
        }
        /**
         * Search Child Nodes Path in Database And If Child Is present 
         * Then Recursive Call to The method whose invoke it.
         * @param {*} id 
         * @param {*} operationID 
         */
        const FirebaseSearchPath = (id,operationID) =>
        {
            firebaseDB.ref("documents/" + props.projectID + "/nodes/"+id+"/").on('value',snap=>{
                if(snap.val()?.children != null || snap.val()?.children != undefined)
                ChildrenDelete(snap.val().children , operationID)
            })
        }
        if(operation === 'delete with child')
        {
            ChildrenDelete(children,1)
        }
        else if(operation === 'delete and Reparent Root')
        {
            ChildrenDelete(children,2)
            
        }
        else
        {
            //reparentNodes(id);
            console.log('Reparention Operation Before Deletion')
        }
        setCards({ ...cards, [id]: undefined });
        firebaseDB.ref().update(updates).then(console.log("deleted", id, "successfully"))
        
        //-----------If Type Contains Storage -----------
        if(! (type === 'link' || type === 'blank')  )
        {
            const path = auth().currentUser?.uid+"/"+props.projectID+"/"+id+"/"+type+"/";
            /**
             * This Function Delete A Particular File From Firebase Storage to given Path
             * @param {*} pathToFile The Path To Which Contents Should be delete
             * @param {*} fileName The FileName Which Has To be Delete
             */ 
            const deleteFile = (pathToFile , fileName) => {
                const ref = firbaseStorage().ref(pathToFile);
                const childRef = ref.child(fileName);
                childRef.delete().then(console.log("File Deleted"))
            }
            /**
             * This Function Calls to Storage and List All Files Acc. to given Path .
             * And Then once a file is Got then Delete File Else No Files Exists.
             * @param {*} path The Path To Which Contents Should be delete
             */
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
            //----Calls to Delete Folder Contents----
            deleteFolderContents(path)
        }
    }

    /**
     *  update local state during card drag
     * if card crosses tripwires on any side, expand ccontainer
     * and adjust document center
     * @param {*} id The ID to which operation is going to work
     * @param {*} newPos Contains New Position of given ID
     * @param {*} cardSize Contains the size of ID
     */
    const localMove = (id, newPos, cardSize) => {

        setCards({ ...cards, [id]: { ...cards[id], position: newPos } });
    }
    /**
     * This Function Saves the Position Of Card Id to Database
     * @param {*} id The ID to which operation is going to work
     * @param {*} newPos Contains New Position of given ID
     */
    const savePosition = (id, newPos) => {
        projectRef.child(id).child("position").set(newPos).then(console.log("set new position for", id, "to", newPos));
    }
    /**
     * This Function Updates the Size of Given Id to Database
     * @param {*} id The ID to which operation is going to work
     * @param {*} newSize Contains New Position of given ID
     */
    const onResize = (id, newSize) => {
        setCards({ ...cards, [id]: { ...cards[id], size: newSize } });
        projectRef.child(id).child("size").set(newSize).then(console.log("set new size for", id, "to", newSize));
    }

    /**
     * Initially adds a blank card, type is inferred later
     * @param {*} type The Type of Card Which has to be Add
     */
    let addCard = (type) => ()=> {
        
        const blankCard = {
            type: type || 'blank',
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

    /**
     * update card content locally for controlled rendering purposes
     * @param {*} id The ID to which we have to save the updated content
     * @param {*} newContent The Content that has to be Save locally
     */ 
    const changeContent = (id, newContent) => {
        console.log("triggered content change on", id)
        setCards({ ...cards, [id]: { ...cards[id], content: newContent } });
    }

    /**
     * This Operation Updates he content to Database
     * @param {*} id The ID to which we have to save the content
     * @param {*} newContent The Content that has to be Save
     */ 
    const saveContent = (id, newContent) => {
        changeContent(id, newContent);
        console.log("hello")
        projectRef.child(id).child("content").set(cards[id]["content"])
            .then(console.log("saved new content for", id));
    }
    /**
     * This Function Add The Child Under it's Parent ID in Database 
     * @param {*} parentId 
     * The Parent Id is what , whose type of card is going to build and under this ID
     */
    const addSubNodes = (parentId) =>{
        const type = cards[parentId].type;
        const blankCard = {
            type: type || 'blank',
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
    /**
     * This Function Perform Reparent With the Following Checks :
     * 
     * 1. Requested Id and Acquired ID are Not Same .
     * 
     * 2. Acquired Id Should Not be the Children of Requested Id
     * 
     * 3. In Case of Any Operation Only Childrens of Requested ID Should be Reparent To Acquired ID 
     * Not the SubChildrens. 
     * @param {*} acquiredId It is the Id on which reparent is going to perform 
     * @param {*} operation Optional Param When Any Specific Operation Needs to perform
     *  @customfunction
     */
    const acquireId =(acquiredId,operation) =>
    {
        let flag=0;
        //--------------Reparenting On DB-----------
        /**
         * This Function Takes The Below 2 Arguments & 
         * Perform Reparent and Updates to the Database
         * @param {*} requestId 
         * The Id that want's to reparent it's current parent 
         * @param {*} acquiredId 
         * The Id to which RequestID want's to be Parent of.
         */
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
        /**This Function Checks in Database the CHildren's of given ID 
         * And if There is Children Found then Recursive Call's  to method that invoke it.*/
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
        /**Function Checks that Parent Shouldn't Reparent It's Own Child
         * By Checking The Acquired Id to the Given Data With it's Children
         */
        const CheckReparenting = (data) => {
            Object.entries(data)
            .map((key,val)=>{
                if(acquiredId == key[0])
                {flag=flag + 1;}
                else
                { 
                    CheckSubNodes(key[0])   
                }
            })
        }
        /**Appending Acquired to Given id's parent and Appending Childrens to AcquiredID Within Database */
        const reparentWhenDelete = (id) =>
        {
            let updates = {};
            updates["documents/"+props.projectID+"/nodes/"+id+"/parent/"] = acquiredId;
            updates["documents/"+props.projectID+"/nodes/"+acquiredId+"/children/"+id] =1 
            firebaseDB.ref().update(updates).
            then(console.log("Reparent When Delete",id ,"\n to \n",acquiredId ))//onDelete(reparentState.requestId))
        }
        console.log("Acquire Called",acquiredId,reparentState)
        //----------When Reparent Is Called Before Delete Operation------------
        if(operation != undefined)
        {
            const children = cards[reparentState.requestId].children;
            console.log("childere",children.length)
            if(children != undefined || children != null)
            Object.keys(children)
            .map((keys)=>{
                reparentWhenDelete(keys)
            })
            onDelete(reparentState.requestId);
        }
        //---------------- Reparent Should not Call itself Check------------------
        else if( (reparentState?.requestId!= undefined || reparentState?.requestId!= null  ) && reparentState?.requestId != acquiredId)
        {
            //----------Parent Shouldn't Reparent It's Own Child------------
            if(reparentState.cardDetail?.children != null || reparentState.cardDetail?.children != undefined)
            {
                //----Pass The Requested Id's Children Which is Stored in Reparent State ----------
                CheckReparenting(reparentState.cardDetail?.children)
                
            }
            //---- If Everything is fine then it Calls to DB Method for Reparenting Operation-----
            if(flag==0)
            {
                console.log("Reparent Requested to DB",reparentState.requestId);
                reparentChild(reparentState.requestId,acquiredId);
                setReparentState(null);
            }
        }
        
    }
    /**The RequestId Params is Updated to ReparentState for the use in Reparenting Operation in AcquireId Method */
    const reparentNodes = (requestId) => 
    {
        const cardDetail = cards[requestId];
        console.log("Rreparent CAlled",requestId,cardDetail)
        setReparentState({requestId:requestId , cardDetail:cardDetail})
    }
    /**
     * Function Uploads File to Firebase Storage 
     * @param {*} id The Id Under Which File is Stored
     * @param {*} file File Which is going to be store.
     * @param {*} metadata Metadata 0f File 
     * @param {*} callback Callbacks the URL when File is Uploaded 
     */
    
    const StoreFileToStorage = (id, file, metadata, callback) => {
        const type = cards[id].type;
        const path = storageRef + id + "/"  + file.name
        const customizedData = {
            contentType: metadata.contentType,
            customMetadata:{
                [auth().currentUser.uid] : props.permission
            }
        } 
        console.log('Metadata Got',customizedData)
        var spaceRef = firbaseStorage().ref(path).put(file, customizedData);
        spaceRef.on(firbaseStorage.TaskEvent.STATE_CHANGED,
            function (snapshot) {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case firbaseStorage.TaskState.SUCCESS:
                        console.log("Upload is Success")
                        break;
                    case firbaseStorage.TaskState.PAUSED: // or 'paused'
                        console.log('Upload is paused');
                        break;
                    case firbaseStorage.TaskState.RUNNING: // or 'running'
                        console.log('Upload is running');
                        break;
                    default:
                        break;
                }
            },
            function (error) {
                switch (error.code) {
                    case 'storage/unauthorized':
                        console.log(" User doesn't have permission to access the object")
                        break;
    
                    case 'storage/canceled':
                        console.log("Storage Cancelled")
                        break;
    
    
                    case 'storage/unknown':
                        console.log(" Unknown error occurred, inspect \n", error.serverResponse)
                        break;
                }
            }, // or 'state_changed'
            () => {
                spaceRef.snapshot.ref.getDownloadURL()
                    .then((url) =>
                        spaceRef.snapshot.ref.getMetadata()
                            .then((data) => {
                                callback({ url: url, metadata: data })
                            })
                            .catch((err) => console.log("Error in Metadata", err))
                    )
                    .catch((err) => console.log("Error in DownLoadURL", err))
            }
        );
    }
    /**
     * Returns the list of Files & Download URL Associated to its path
     * @param {*} id The ID of Files in Storage that we want
     * @param {*} callback Stores The File , URL  , Metadata
     */
    const GetFileFromStorage = (id, callback) => {
        const type = cards[id].type;
        const path = storageRef + id + "/" 
        var spaceRef = firbaseStorage().ref(path)
        spaceRef.listAll()
            .then((dir) => {
                //-------Files Exist-------
                if (dir.items.length > 0) {
                    dir.items.forEach((fileRef, index) => {
                        fileRef.getMetadata()
                            .then((data) => {
                                fileRef.getDownloadURL()
                                    .then((url) => {
                                        callback(prev => ([
                                            ...prev,
                                            { metadata: data, url: url }]
                                        ))
                                    })
                            })
                    })
                }
                else {
                    console.log("No Files Exist")
                }
            })
            .catch(error => {
                console.log(error);
            });
    }
    /**
     * @exports bundling card api methods for ease of transmission
     */ 
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
        requestReparent:reparentNodes,
        sendPath : acquireId,
        storeFile : StoreFileToStorage,
        displayFile : GetFileFromStorage
    }

    return (
        <CardContainer
            container={container}
            cards={cards}
            cardAPI={cardAPI}
            projectID={props.projectID}
            permission = {props.permission}
        />
    )
}