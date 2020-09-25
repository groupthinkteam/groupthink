import React, { useState, useEffect, useRef } from "react";
import CardContainer from "./CardContainer";
import { firebaseDB, firbaseStorage } from "../../services/firebase";
import { auth } from "firebase";

/**
 * Business logic for all canvas operations. Provides and implements the TypeAPI and GenericAPI
 * @property {state} cards - stores the local state information for all the cards
 * @property {state} container - stores the width and height of the container  
 * @param {*} props 
 */
export default function CardManager(props) {
    // store container-related state
    const [container, setContainer] = useState({ width: 600, height: 800 });
    const containerRef = useRef({});
    containerRef.current = container;

    // store card-related state
    const [cards, setCards] = useState({});

    // "root/documents/projectID/nodes" reference in firebase db
    const projectRef = firebaseDB.ref("documents/" + props.projectID + "/nodes");

    // get initial firebase state and subscribe to changes
    // unsubscribe before unmount
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
            // setDocCenter(snapshot.val());
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
    }, [])

    /**
     * add a new card with the specified type, position, and parent
     * @param {{width: number, height: number}} position - the initial position of the card
     * @param {{x: number, y: number}} size - the initial size of the card
     * @param {string} parent - (optional) the id of the parent card. default: "root"
     * @param {string} type - (optional) the card type (e.g. "audio", "image", "text"). default: "blank"
     */
    const addCard = (position, size, parent, type) => {
        // schema for new card
        const newCard = {
            type: type || "blank",
            size: size,
            position: position,
            content: {
                text: `This is a ${type} Card`
            },
            parent: parent || "root"
        }

        // create new key for child in ".../nodes"
        let newCardKey = projectRef.push().key;

        // use that key to 
        // a) push the new card schema 
        // b) update the "children" property of parent
        let updates = {};
        updates[parent + "/children/" + newCardKey] = 1;
        updates[newCardKey] = newCard;
        projectRef.update(updates).then(console.log("Added a new child", newCardKey, "under", parent));

        // update local state
        setCards({
            ...cards,
            [newCardKey]: newCard,
            [parent]: {
                ...cards[parent],
                children: {
                    ...cards[parent]["children"],
                    [newCardKey]: 1
                }
            }
        });
    }

    const removeCard = (id, parentId, children, type) => {
        let updates = {};
        console.log("removeCard Params", id, parentId, children, type)
        if (props.projectID === parentId) {
            updates["documents/" + props.projectID + "/nodes/" + id] = null;
        }
        else {
            updates["documents/" + props.projectID + "/nodes/" + parentId + "/children/" + id] = null;
            updates["documents/" + props.projectID + "/nodes/" + id] = null;
        }
        //---Childrens Should be deleted---
        const ChildrenDelete = (children) => {
            if (children != null || children != undefined) {
                Object.entries(children)
                    .map((key, val) => {
                        //console.log("Children Key",key[0])
                        updates["documents/" + props.projectID + "/nodes/" + key[0]] = null;
                        FirebaseSearchPath(key[0])
                    })
            }
        }
        const FirebaseSearchPath = (id) => {
            firebaseDB.ref("documents/" + props.projectID + "/nodes/" + id + "/").on('value', snap => {
                //console.log("Snapshot",snap.val()?.children)
                if (snap.val()?.children != null || snap.val()?.children != undefined)
                    ChildrenDelete(snap.val().children)
            })
        }
        if (children != null || children != undefined) {
            ChildrenDelete(children)
        }
        setCards({ ...cards, [id]: undefined });
        firebaseDB.ref().update(updates).then(console.log("deleted", id, "successfully"))
        //-----------If File is Uploaded -----------
        if (!(type === 'link' || type === 'blank')) {
            const path = auth().currentUser?.uid + "/" + props.projectID + "/" + id + "/" + type + "/";
            const deleteFile = (pathToFile, fileName) => {
                const ref = firbaseStorage().ref(pathToFile);
                const childRef = ref.child(fileName);
                childRef.delete().then(console.log("File Deleted"))
            }
            const deleteFolderContents = (path) => {
                var storageRef = firbaseStorage().ref(path);
                storageRef.listAll()
                    .then((dir) => {
                        //-------Files Exist-------
                        if (dir.items.length > 0) {
                            dir.items.forEach((fileRef) => {
                                deleteFile(storageRef.fullPath, fileRef.name)
                            })
                            dir.prefixes.forEach(folderRef => {
                                deleteFolderContents(folderRef.fullPath);
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

            deleteFolderContents(path)
            //storageRef.delete().then(console.log("File Deleted Successfully")).catch((err)=>console.log(err))
        }
    }

    /**
     * update local state during card drag
     * @param {string} id - the card for which to perform the operation
     * @param {{x: number, y: number}} newPos - the new position
     */
    const changePosition = (id, newPos) => {
        setCards({ ...cards, [id]: { ...cards[id], position: newPos } });
    }

    /**
     * update firebase state after drag end. increase container size if needed.
     * @param {string} id - the card for which to perform the operation
     * @param {{x: number, y: number}} newPos - the new position
     * @todo take card size into account when increasing container size
     */
    const savePosition = (id, newPos) => {
        let updates = {};
        let newContainer = { width: containerRef.current.width, height: containerRef.current.height }

        let projectRef = firebaseDB.ref("documents/" + props.projectID);
        if (newPos.x > containerRef.current.width) {
            console.log("x", newPos.x, "was greater than width", containerRef.current)
            newContainer.width = newPos.x + 300;
        }
        if (newPos.y > containerRef.current.height) {
            console.log("y", newPos.y, "was greater than height", container.current)
            newContainer.height = newPos.y + 300;
        }
        updates["nodes/" + id + "/position/"] = newPos;
        if (newContainer) {
            updates["container/"] = newContainer
        }

        console.log("newcontainer: ", newContainer, "old container: ", containerRef.current)

        projectRef.update(updates)
            .then(console.log("set new position for", id, "to", newPos, "\nresized container to", newContainer));
    }

    /**
     * update card size locally and in firebase
     * @param {string} id - the card for which to perform the operation 
     * @param {{width: number, height: number}} newSize - the new size
     * @todo split into local and remote versions (change/save)
     */
    const resize = (id, newSize) => {
        setCards({ ...cards, [id]: { ...cards[id], size: newSize } });
        projectRef.child(id).child("size").set(newSize).then(console.log("set new size for", id, "to", newSize));
    }

    /**
     * update card content locally
     * @param {string} id - the card for which to perform the operation 
     * @param {object} newContent - the new content to push to local state
     */
    const changeContent = (id, newContent) => {
        console.log("triggered local content change on", id)
        setCards({ ...cards, [id]: { ...cards[id], content: newContent } });
    }

    /** 
     * push card content to firebase (replaces any currently existing content for that card)
     * @param {string} id - the card for which to perform the operation 
     * @param {object} newContent - the new content to push to database
    */
    const saveContent = (id, newContent) => {
        changeContent(id, newContent);
        projectRef.child(id).child("content").set(cards[id]["content"])
            .then(console.log("saved new content for", id));
    }

    /** 
     * change the parent of card id to card newParent
     * @param {string} id - the card for which to perform the operation 
     * @param {string} newParent - the id of the card's new parent
     * @todo implement local state change in addition to firebase change
     * */
    const reparentCard = (id, newParent) => {
        let updates = {};
        let currentParent = cards[id]["parent"];
        updates[id + "/parent"] = newParent;
        updates[currentParent + "/children/" + id] = null;
        updates[newParent + "/children/" + id] = 1;
        projectRef.update(updates)
            .then(console.log("successfully changed the parent of", id, "from", currentParent, "to", newParent))
            .catch(console.log("error reparenting"));
    }

    /**
     * --------------- Storage Operation Function ---------------*/
    const StoreFileToStorage = (path, file, metadata, callback) => {
        var spaceRef = firbaseStorage().ref(path).put(file, metadata);
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
                    default:
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
     * used to get a file and associated metadata from the storage bucket
     * @param {string} path - the relative path of the requested file (starting from card id)
     * @param {function} callback - a function that takes (file, metadata) as arguments
     */
    const requestDownload = (path, callback) => {
        var spaceRef = firbaseStorage().ref().child(props.projectID)
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

    /**bundling card api methods for ease of transmission */
    let cardAPI = {
        add: addCard,
        remove: removeCard,
        changePosition: changePosition,
        savePosition: savePosition,
        resize: resize,
        change: changeContent,
        save: saveContent,
        storeFile: StoreFileToStorage,
        displayFile: GetFileFromStorage
    }

    let genericAPI = {
        savePosition: changePosition,
        changePosition: savePosition,
        reparent: "todo",
        remove: removeCard,
        addChild: "todo"
    }

    let typeAPI = {
        meta: ["id", "type", "parent", "children[]", "content{}", "size", "position"],
        saveContent: "todo",
        changeContent: "todo",
        requestFilePick: "todo",
        requestUpload: "todo",
        requestDownload: "todo"
    }

    return (
        <CardContainer
            container={container}
            cards={cards}
            cardAPI={cardAPI}
            projectID={props.projectID}
            permission={props.permission}
        />
    )
}