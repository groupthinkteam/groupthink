import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { firebaseDB, firebaseTIME, firebaseStorage, firebaseFunction } from "../../services/firebase";
import projectTemplates from "../../constants/projectTemplates";
import MiniSearch from 'minisearch';
import Card from "./Card";

import "../../styles/Projects.scss";
import { snap } from "gsap/all";
import { Modal } from "react-bootstrap";
import Button from "../../components/Button/Button";
/**
 * @component
 * This Component Deals with All Database & Storage Operation Required In DashBoard Page
 * @contains
 * @function `onAddNew()` Adds New Project To Database.
 * @function `onDelete(id)` Deletes the Corresponding ID from DB & Storage(if Exists) 
 * @function `onRename(id)` Rename The Projects of Given ID on Database .
 * @function `onOpen(id)` Redirects The Page to 'projects/`${id}`'
 * @function `onChange(id,text)` Store the text in Current Card State. 
 * @param {*} props The Props Passed is 'currentUser'
 */
export default function Projects(props) {
    const history = useHistory();
    const [cards, setCards] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const userRef = "users/" + props.currentUser().uid + "/projects/";
    const [show,setShow]= useState(true);
    const handleClose = () => setShow(false);
    useEffect(
        () => {
            const ref = firebaseDB.ref("users/" + props.currentUser().uid + "/projects/");
            
            ref.on('value', (snapshot) => {
                console.log("triggered listener and updated project list state, snapshot value was", snapshot.val());
                setCards(snapshot.val());
                setIsLoaded(true)
            })
            return () => ref.off('value');
        }
        , [props])
    /**Adds New Project To Database. */
    var onAddNew = () => {
        console.log("clicked add new")
        const refUsers = firebaseDB.ref().child(userRef);
        const projectID = refUsers.push().key;
        let updates = {};
        const thumbnails = [require("../../assets/1.webp"), require("../../assets/2.webp"), require("../../assets/3.webp"), require("../../assets/4.webp")]
        const thumbnailURL = thumbnails[Math.floor(Math.random() * thumbnails.length)]

        updates['creator/' + projectID] = props.currentUser().uid;
        updates[userRef + projectID] = {
            access: 'rw',
            name: "New Project",
            thumbnailURL: thumbnailURL,
            isLocked: false,
            createdAt : firebaseTIME,
            id:projectID
        };
        updates['documents/' + projectID] = {
            metadata: {
                name: "New Project",
                thumbnailURL: thumbnailURL,
                datecreated: firebaseTIME
            },
            lastActive : {
                [props.currentUser().uid]:firebaseTIME
            },
            users: { 
                [props.currentUser().uid]: { 
                    "permission":"rw" ,
                    "email" : props.currentUser().email , 
                    "photoURL":props.currentUser().photoURL,
                    "name" : props.currentUser().displayName,
                    "isOwner" : true,
                    "lastUpdatedAt" : firebaseTIME
                }
            },
            ...projectTemplates.tester
        }
        var addMsg = firebaseFunction.httpsCallable('createNewProject')
        addMsg(updates).then((result) => console.log(result)).catch(err => console.log(err))
    }
    /**
     * Deletes the Corresponding ID from DB & Storage(if Exists)
     * @param {String} id Project's ID
     */
    var onDelete = async (id) => {
        console.log("about to delete project", id);
        const uidDataKeys = firebaseDB.ref("documents/" + id + "/users").once('value').then(snap => { return snap.val() }).catch(err => console.log("onDelete Error", err))
        console.log("UID DATA KEYS", uidDataKeys);
        const updates = {};
        await uidDataKeys.then(result => {
            if (result)
                Object.keys(result)
                    .map((key) => {
                        if (key !== props.currentUser().uid)
                            updates["users/" + key + "/projects/" + id + "/"] = null;
                    })
        }).catch(err => console.log("Error While UID Fetch", err))
        updates["documents/" + id + "/"] = null;
        updates["creator/" + id + "/"] = null;
        updates[userRef + id] = null;
        console.log("UPDATES ", updates)
        //----Admin Update Method (Cloud Function)----
        var addMsg = firebaseFunction.httpsCallable('createNewProject')
        addMsg(updates).then((result) => console.log(result, updates)).catch(err => console.log("ERROR WHILE DELETE", err))
        // //--------------------Storage Deletion ------------
        const path = "root/" + id + "/";
        const deleteFile = (pathToFile, fileName) => {
            const ref = firebaseStorage().ref(pathToFile);
            const childRef = ref.child(fileName);
            childRef.delete().then(console.log("File Deleted")).catch(err => console.log("File Delete Error", err))
        }
        const deleteFolderContents = (path) => {
            console.log("Path TO Delete", path)
            var storageRef = firebaseStorage().ref(path);
            storageRef.listAll()
                .then((dir) => {
                    //-------Files Exist-------

                    if (dir.prefixes.length > 0 || dir.items.length > 0) {
                        if (dir.items.length > 0) {
                            dir.items.forEach((fileRef) => {
                                deleteFile(storageRef.fullPath, fileRef.name)
                            })
                        }
                        dir.prefixes.forEach(folderRef => {
                            deleteFolderContents(folderRef.fullPath);
                        })
                    }
                    else {
                        console.log("No Files Exist")
                    }
                })
                .catch(error => {
                    console.log("List All Error ", error);
                });
        }

        deleteFolderContents(path)
    }
    /**
     * Rename The Projects of Given ID on Database .
     * @param {String} id 
     */
    var onRename = async (id) => {
        const uidDataKeys =  firebaseDB.ref("documents/" + id + "/users").once('value').then(snap => { return snap.val() }).catch(err => console.log("on Rename Error", err))
        console.log("UID DATA KEYS", uidDataKeys,id);

        const text = cards[id].name;
        console.log("about to rename project", id, ", changing title to", text);
        const updates = {};
        await uidDataKeys.then(result => {
            console.log("ENTRIES ",result);
                Object.keys(result)
                    .map((key) => {
                        console.log("DATAKEYS Count", key)
                        if (key !== props.currentUser().uid)
                        updates["users/" + key + "/projects/" + id + "/name"] = text;
                    })
        }).catch(err => console.log("Error While UID Fetch", err))
        updates["documents/" + id + "/metadata/name"] = text;
        updates["users/"+props.currentUser().uid+"/projects/"+id+"/name/"] = text;
        var addMsg = firebaseFunction.httpsCallable('createNewProject')
        addMsg(updates)
            .then((result) => console.log("successfully renamed project", id, "to", text, "\n and Updates are \n ", result, updates))
            .catch(err => console.log(err))
    }
    /**
     * Redirects The Page to `projects/${id}`
     * @param {String} id 
     */
    var onOpen = (id) => {
        console.log("attempting to open project", id);
        history.push("/project/" + id)
    }
    /**
     * Store the text in Current Card State.
     * @param {String} id 
     * @param {String} text 
     */
    var onChange = (id, text) => {
        console.log("un-finalized text change in", id, ". new text:", text);
        console.log({ ...cards, [id]: { ...cards[id], name: text } })
        setCards({ ...cards, [id]: { ...cards[id], name: text } });
    }

    const searchEelemnt = (text) =>{
        const makeArrayofProject = [] ;
        let miniSearch = new MiniSearch({
            fields : ['name'],
            storeFields:['name']
        });
        let cnt = 0;
        Object.entries(cards).map(([key,val])=>{
            makeArrayofProject.push(val)
            cnt = cnt+1;
        })
        if(makeArrayofProject.length > 0 )
        miniSearch.addAll(makeArrayofProject)

        let results = miniSearch.search(text);
        console.log("THE SEARCH ELEMENTS ",results , text);
    }

    const sharedCardsToRender = cards ?
        Object.entries(cards).filter(([id, card]) => card.shared).map(
            ([id, card]) => {
                return <Card
                    key={id}
                    id={id}
                    card={card}
                    onChange={onChange}
                    onSave={onRename}
                    onDelete={onDelete}
                    onOpen={onOpen}
                    searchEelemnt={searchEelemnt}
                />
            }
        )
        : null

    const ownerCardsToRender = cards ?
        Object.entries(cards).filter(([id, card]) => !card.shared).map(
            ([id, card]) => {
                return <Card
                    key={id}
                    id={id}
                    card={card}
                    onChange={onChange}
                    onSave={onRename}
                    onDelete={onDelete}
                    onOpen={onOpen}
                    searchEelemnt={searchEelemnt}
                />
            }
        )
        : null

    console.log("owner", ownerCardsToRender, "shared", sharedCardsToRender)
    return (
        isLoaded ?
            <div className="project-view-container">
                <div className="project-container-title" > Your Projects</div >
                <div className="project-card-container">
                    <Card addNew onAddNew={onAddNew} />
                    {ownerCardsToRender 
                    // ||
                    //     <div className="project-container-nodata">
                    //         You have not created any projects yet. What are you waiting for? Click "Add a Project" to begin.
                    //     </div>
                    }
                </div>
                <div className="project-container-title">Shared With You</div>
                <div className="project-card-container">
                    {sharedCardsToRender && sharedCardsToRender.length > 0
                        ? sharedCardsToRender
                        : <div className="project-container-nodata">
                            No one has shared a project with you yet. SAD!
                        </div>
                    }
                </div>
                <Modal show={show}>
                    <Modal.Header closeButton>
                        <Modal.Title>Would You Like to Work on last Modified File</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                    </Modal.Body>
                    <Modal.Footer>
                    <Button className="custom_btn" handleClick={handleClose}>Close</Button>
                    <Button className="custom_btn" handleClick={handleClose}>Save Changes</Button>
                </Modal.Footer>
                </Modal>
            </div >
            : <div>
                Loading...
            </div>
    )
}