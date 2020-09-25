import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { firebaseDB, firebaseTIME, firebaseStorage, firebaseFunction } from "../../services/firebase";
import projectTemplates from "../../constants/projectTemplates";

import Card from "./Card";

import "../../styles/Projects.scss";
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
    let [cards, setCards] = useState(null);

    let userRef = "users/" + props.currentUser().uid + "/projects/";

    useEffect(
        () => {
            let ref = firebaseDB.ref("users/" + props.currentUser().uid + "/projects/");
            ref.on('value', (snapshot) => {
                console.log("triggered listener and updated project list state, snapshot value was", snapshot.val());
                setCards(snapshot.val());
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
        updates['creator/'+projectID] = props.currentUser().uid;
        updates[userRef + projectID] = {
            access:'rw',
            name: "New Project",
            thumbnailURL: "https://picsum.photos/200?random=" + Math.floor(Math.random() * 100)
        };
        updates['documents/' + projectID] = {
            metadata: {
                name: "New Project",
                datecreated: firebaseTIME
            },
            users: { [props.currentUser().uid]: "rw" },
            ...projectTemplates.tester
        }
        var addMsg = firebaseFunction.httpsCallable('createNewProject')
        addMsg(updates).then((result)=>console.log(result)).catch(err=>console.log(err))
    }
    /**
     * Deletes the Corresponding ID from DB & Storage(if Exists)
     * @param {String} id Project's ID
     */
    var onDelete = (id) => {
        console.log("about to delete project", id);
        let updates = {};
        updates["users/" + props.currentUser().uid + "/projects/" + id + "/"] = null;
        updates["documents/" + id + "/"] = null;
        //----Admin Update Method (Cloud Function)----
        var addMsg = firebaseFunction.httpsCallable('createNewProject')
        addMsg(updates).then((result)=>console.log(result)).catch(err=>console.log(err))
        //--------------------Storage Deletion ------------
        const path = "root/"+id+"/";
            const deleteFile = (pathToFile , fileName) => {
                const ref = firebaseStorage().ref(pathToFile);
                const childRef = ref.child(fileName);
                childRef.delete().then(console.log("File Deleted"))
            }
            const deleteFolderContents = (path) =>{
                console.log("Path TO Delete",path)
                var storageRef = firebaseStorage().ref(path);
                storageRef.listAll()
                .then((dir)=>{
                    //-------Files Exist-------
                    
                    if(dir.prefixes.length > 0 || dir.items.length>0)
                    {
                        if(dir.items.length>0)
                        {
                            dir.items.forEach((fileRef)=>{
                                deleteFile(storageRef.fullPath , fileRef.name)
                            })
                        }
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
    }
    /**
     * Rename The Projects of Given ID on Database .
     * @param {String} id 
     */
    var onRename = (id) => {
        let text = cards[id].name;
        console.log("about to rename project", id, ", changing title to", text);
        let updates = {};
        updates[userRef + id + "/name"] = text;
        updates["documents/" + id + "/metadata/name"] = text;
        firebaseDB.ref().update(updates).then(console.log("successfully renamed project", id, "to", text))
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

    return (
        <div id="project-card-container">
            <Card addNew onAddNew={onAddNew} />
            {cards ?
                Object.entries(cards).map(
                    ([id, card]) => {
                        return <Card
                            key={id}
                            id={id}
                            card={card}
                            onChange={onChange}
                            onSave={onRename}
                            onDelete={onDelete}
                            onOpen={onOpen}
                        />
                    }
                )
                : null
            }
        </div>
    )
}