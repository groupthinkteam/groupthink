import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { firebaseDB, firebaseTIME, firbaseStorage } from "../../services/firebase";
import projectTemplates from "../../constants/projectTemplates";

import Card from "./Card";

import "../../styles/Projects.scss";

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

    var onAddNew = () => {
        console.log("clicked add new")
        let projectID = firebaseDB.ref().child(userRef).push().key;

        let updates = {};

        updates[userRef + projectID] = {
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

        firebaseDB.ref().update(updates).then(console.log("successfully added a new project with id", projectID))
    }
    var onDelete = (id) => {
        console.log("about to delete project", id);
        let updates = {};
        updates["users/" + props.currentUser().uid + "/projects/" + id + "/"] = null;
        updates["documents/" + id + "/"] = null;
        firebaseDB.ref().update(updates).then(console.log("deleted", id, "successfully"))
        //--------------------Storage Deletion ------------
        const path = props.currentUser().uid+"/"+id+"/";
            const deleteFile = (pathToFile , fileName) => {
                const ref = firbaseStorage().ref(pathToFile);
                const childRef = ref.child(fileName);
                childRef.delete().then(console.log("File Deleted"))
            }
            const deleteFolderContents = (path) =>{
                console.log("Path TO Delete",path)
                var storageRef = firbaseStorage().ref(path);
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

    var onRename = (id) => {
        let text = cards[id].name;
        console.log("about to rename project", id, ", changing title to", text);
        let updates = {};
        updates[userRef + id + "/name"] = text;
        updates["documents/" + id + "/metadata/name"] = text;
        firebaseDB.ref().update(updates).then(console.log("successfully renamed project", id, "to", text))
    }

    var onOpen = (id) => {
        console.log("attempting to open project", id);
        history.push("/project/" + id)
    }

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