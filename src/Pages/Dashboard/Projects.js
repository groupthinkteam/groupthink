import React, { useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import { firebaseDB, firebaseTIME } from "../../services/firebase"
import Card from "./Card"

import "../../styles/Projects.scss"

export default function Projects(props) {
    const history = useHistory();
    let [cards, setCards] = useState(null);

    let userRef = "users/" + props.getUserID() + "/projects/";

    useEffect(
        () => {
            let ref = firebaseDB.ref("users/" + props.getUserID() + "/projects/");
            ref.on('value', (snapshot) => {
                console.log("triggered listener and updated state, snapshot value was", snapshot.val());
                setCards(snapshot.val())
            })
            return () => ref.off('value')
        }
        , [props])

    var onAddNew = () => {
        console.log("clicked add new")
        let projectID = firebaseDB.ref().child(userRef).push().key;

        let updates = {};
        const thumbnail = "https://picsum.photos/200?random=" + Math.floor(Math.random() * 100) ;
        updates[userRef + projectID] = {
            name: "New Project",
            thumbnailURL: thumbnail
        };
        updates['documents/' + projectID] = {
            metadata: {
                thumbnailURL : thumbnail,
                name: "New Project",
                datecreated: firebaseTIME
            },
            users: { [props.getUserID()]: "rw" }
        }

        firebaseDB.ref().update(updates).then(console.log("successfully added a new project with id", projectID))
    }
    var onDelete = (id) => {
        console.log("about to delete project", id);
        let updates = {};
        updates["users/" + props.getUserID() + "/projects/" + id + "/"] = null;
        updates["documents/" + id + "/"] = null;
        firebaseDB.ref().update(updates).then(console.log("deleted", id, "successfully"))
    }

    var onRename = (id, text) => {
        console.log("about to rename project", id, ", changing title from", cards[id].name, "to", text);
        let updates = {};
        updates[userRef + id + "/name"] = text;
        updates["documents/" + id + "/metadata/name"] = text;
        firebaseDB.ref().update(updates).then(console.log("successfully renamed project", id, "to", text))
    }

    var onOpen = (id,thumbnailURL) => {
        console.log("attempting to open project", id);
        history.push(`/project/${id}`,thumbnailURL)
    }

    return (
        <div id="project-card-container">
            <Card addNew onAddNew={onAddNew} />
            {cards ?
                Object.entries(cards).map(
                    ([id, card]) =>
                        <Card
                            key={id}
                            id={id}
                            card={card}
                            onSave={onRename}
                            onDelete={onDelete}
                            onOpen={onOpen}
                        />
                )
                : null
            }
        </div>
    )
}