import React, { useState, useEffect, useRef, useCallback } from "react";
import CardContainer from "./CardContainer";
import throttle from 'lodash.throttle';
import { firebaseDB, firebaseStorage, firebaseTIME } from "../../services/firebase";
import cardTemplate from "../../constants/cardTemplates";
/**
 * Business logic for all canvas operations. Provides and implements the TypeAPI and GenericAPI
 * @property {state} cards - stores the local state information for all the cards
 * @property {state} container - stores the width and height of the container  
 * @param {*} props 
 */
export default function CardManager(props) {
    const [isLoaded, setIsLoaded] = useState(false);
    console.log("my name is", props.currentUser().uid)
    // store container-related state
    const [container, setContainer] = useState({ width: 600, height: 800 });
    const containerRef = useRef({});
    containerRef.current = container;

    //
    const [room, setRoom] = useState();
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
        projectRef.child("room").on("value", (snap) => {
            console.log("Room Details Triggered recieved payload", snap.val());
            snap.val() && setRoom(snap.val());
        })
        setIsLoaded(true)
        return () => {
            projectRef.child("nodes").off();
            projectRef.child("center").off();
            projectRef.child("container").off();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    /**
     * add a new card with the specified type, position, and parent
     * @param {{x: number, y: number}} position - the initial position of the card
     * @param {{width: number, height: number}} size - the initial size of the card
     * @param {string} newparent - (optional) the id of the parent card. default: "root"
     * @param {string} newtype - (optional) the card type (e.g. "audio", "image", "text"). default: "blank"
     */
    const addCard = (position, size, newparent, newtype) => {
        // schema for new card
        let parent = newparent || "root"
        let type = newtype || "blank"
        const newCard = {
            type: type,
            size: size,
            position: position,
            content: {
                text: `This is a ${type} Card`
            },
            parent: parent
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

    /**
     * remove a card or a subtree from the document
     * @param {string} id - the card on which to perform the operaiton
     * @param {string} strategy - the deletion strategy "recursive" or "reparent"
     * @param {string} newParent - !only used with the `reparent` strategy! the card 
     * that will now become the parent of the immediate descendents of the deleted card
     * @todo remove all storage files associated with the deleted cards
     */
    const removeCard = (id, strategy, newParent) => {
        const updates = {};
        updates[id] = null;
        updates[cards[id]["parent"] + "/children/" + id] = null;

        /**
         * do a depth-first traversal of the subtree rooted at `id` and add
         * every element to updates{} for removal
         * @param {Array} stack 
         */
        const depthFirstTraversal = (stack) => {
            while (stack.length > 0) {
                let poppedID = stack.pop();
                updates[poppedID] = null;
                if (cards[poppedID]["children"])
                    stack.concat(Object.keys(cards[poppedID]["children"]))
            }
        }

        switch (strategy) {
            case "recursive":
                if (cards[id]["children"])
                    depthFirstTraversal(Object.keys(cards[id]["children"]));
                break;
            case "reparent":
                Object.keys(cards[id]["children"])
                    .forEach(child => updates[child + "/parent"] = newParent);
                break;
            default:
                break;
        }


        const types = ["link", "blank", "VideoLink", "text"];
        console.log("Type Of Card ",cards[id].type,"\n Exists Storage Types ", !types.includes(cards[id].type, 0))
        //-----------If Type Contains Storage -----------
        if (!types.includes(cards[id].type, 0)) {
            const path = "root/" + props.projectID + "/" + id + "/";
            /**
             * This Function Delete A Particular File From Firebase Storage to given Path
             * @param {*} pathToFile The Path To Which Contents Should be delete
             * @param {*} fileName The FileName Which Has To be Delete
             */
            const deleteFile = (pathToFile, fileName) => {
                const ref = firebaseStorage().ref(pathToFile);
                const childRef = ref.child(fileName);
                childRef.delete().then(console.log("File Deleted")).catch(err => console.log("Error in Delete File", err))
            }
            /**
             * This Function Calls to Storage and List All Files Acc. to given Path .
             * And Then once a file is Got then Delete File Else No Files Exists.
             * @param {*} path The Path To Which Contents Should be delete
             */
            const deleteFolderContents = (path) => {
                var storageRef = firebaseStorage().ref(path);
                storageRef.listAll()
                    .then((dir) => {
                        //-------Files Exist-------
                        if (dir.items.length > 0) {
                            dir.items.forEach((fileRef) => {
                                deleteFile(storageRef.fullPath, fileRef.name)
                            })
                        }
                        else {
                            console.log("No Files Exist")
                        }
                    })
                    .catch(error => {
                        console.log("Error in List All", error);
                    });
            }
            //----Calls to Delete Folder Contents----
            deleteFolderContents(path)
        }
        else {
            console.log("Its a NOn Storage Card")
        }
        projectRef.update(updates).then(console.log("deleted", id, "successfully"))
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
        projectRef.child(id).child("content").update(newContent)
            .then(console.log("saved new content for", id))
            .catch(err => console.log("Save COntent Error \n", newContent, "\n saveContent", err));
    }
    /**
     * Changes the type of card to dzired type .  
     * @param {String} id - the card for which to perform the operation
     * @param {String} newType - the newType which is going to be changed.
     */
    const changeType = (id, newType, size) => {
        const newTypeCard = cardTemplate(newType, size); //type,size,content
        setCards({
            ...cards,
            [id]: {
                ...cards[id],
                type: newTypeCard.type,
                size: newTypeCard.size,
                content: newTypeCard.content
            }
        });
        const updates = {};
        updates[id + '/type'] = newTypeCard.type;
        updates[id + '/size'] = newTypeCard.size;
        updates[id + '/content'] = newTypeCard.content;
        projectRef.update(updates).then(console.log("Set new type for", id, "to \n", newTypeCard)).catch(err => err);
        //projectRef.child(id).child("type").set(newType).then(console.log("set new type for", id, "to", newType));
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
     * uploads `file` to `path` in the storage bucket
     * @param {string} uploadPath - a path relative to projectID/
     * @param {blob} file - the file to be uploaded
     * @param {object} metadata - the metadata object associated with the file
     * @param {function(number, function)} statusCallback - a callback that receives a number [0, 100] indicating upload progress, and `cancel` - a function that cancels the ongoing upload
     */
    const requestUpload = (uploadPath, file, metadata, statusCallback) => {
        let custom = {
            ...metadata,
            customMetadata: {
                [props.currentUser().uid]: props.permission
            }
        }

        console.log("metadata sent was", custom)
        const path = "root/" + props.projectID + "/" + uploadPath;
        let requestedPathRef = firebaseStorage().ref(path);
        let uploadTask = requestedPathRef.put(file, custom);
        let unsubscribe = uploadTask.on(firebaseStorage.TaskEvent.STATE_CHANGED,
            (nextSnapshot) => statusCallback(nextSnapshot.bytesTransferred / nextSnapshot.totalBytes * 100, uploadTask), // on upload progress
            null, // error handling -- nonexistent!
            () => { console.log(); statusCallback("complete"); unsubscribe(); } // on completion
        )
    }

    /**
     * get a file and associated metadata (sans permissions) from the storage bucket
     * @param {string} downloadPath - - a path relative to projectID/
     * @param {function(string, object)} callback - a function that takes (`downloadURL`, `metadata`) as arguments
     */
    const requestDownload = (downloadPath, callback) => {
        const path = "root/" + props.projectID + "/" + downloadPath;
        let requestedPathRef = firebaseStorage().ref(path)
        requestedPathRef.getDownloadURL()
            .then((url) => {
                requestedPathRef.getMetadata()
                    .then((metadata) => callback(url, JSON.parse(JSON.stringify(metadata))))
                    .catch((reason) => console.log("failed to fetch metadata for", path, "because", reason))
            })
            .catch((reason) => console.log("failed to fetch download URL for", path, "because", reason))
    }
    /**
     * This Function Updates Mouse X and Y Positions and Time to Database 
     */
    const sendToDatabase = useCallback(throttle(
        (event) => {
            if (room) {
                firebaseDB.ref("documents/" + props.projectID + "/room/").child(props.currentUser().uid)
                    .set({ x: event.clientX, y: event.clientY, time: firebaseTIME, name: props.currentUser().displayName })
            }
        },
        100), [room])
    /**
     * bundling card api methods for ease of transmission 
     */
    let genericAPI = {
        savePosition: savePosition,
        changePosition: changePosition,
        reparentCard: reparentCard,
        removeCard: removeCard,
        addChild: addCard,
        resize: resize
    }

    let typeAPI = {
        saveContent: saveContent,
        changeContent: changeContent,
        requestUpload: requestUpload,
        requestDownload: requestDownload,
        changeType: changeType,
        resize: resize
    }

    const containerAPI = {
        sendToDatabase: sendToDatabase
    }
    return (
        isLoaded ?
            <CardContainer
                container={container}
                cards={cards}
                genericAPI={genericAPI}
                typeAPI={typeAPI}
                permission={props.permission}
                currentUser={props.currentUser}
                containerAPI={containerAPI}
                room={room}
                projectID={props.projectID}
            />
            :
            <div>
                Loading...
            </div>

    )
}