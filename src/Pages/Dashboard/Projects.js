import React, { useState, useEffect } from "react"
import { firebaseDB } from "../../services/firebase"
import Card from "./Card"
import AddNew from "./AddNew"

export default function Projects(props) {
    let [cards, setCards] = useState(null);
    useEffect(
        () => {
            let ref = firebaseDB.ref("users/" + props.getUserID() + "/projects/");
            ref.on('value', (snapshot) => { console.log(snapshot.val()); setCards(snapshot.val()) })
            return () => ref.off('value')
        }
        , [props])

    var onAddNew = () => {
        console.log("clicked add new")
        firebaseDB.ref("users/" + props.getUserID() + "/projects/").push("rw").set("new node")
    }

    var onDelete = (id) => {
        console.log("about to delete project", id);
        firebaseDB.ref("users/" + props.getUserID() + "/projects/" + id + "/")
            .remove()
            .then(() => console.log("Remove succeeded for id: ", id))
            .catch((error) => console.log("Remove failed for id:", id, ". Reason: " + error.message));
    }

    return (
        <div id="project-card-container">
            <AddNew onAddNew={onAddNew} />
            {cards ?
                Object.entries(cards).map(
                    ([id, card]) => <Card key={id} id={id} card={card} onDelete={onDelete} />
                )
                : null
            }
        </div>
    )
}