import React, { useState, useEffect } from "react"
import { firebaseDB } from "../../services/firebase"
import Card from "./Card"
import AddNew from "./AddNew"

export default function Projects(props) {
    let [cards, setCards] = useState(null);
    useEffect(
        () => {
            firebaseDB.ref("users/" + props.getUserID() + "/projects/")
                .on('value', (snapshot) => { console.log(snapshot.val()); setCards(snapshot.val()) })
            return () => firebaseDB.ref("users/" + props.getUserID() + "/projects/").off('value')
        }
        , [props])

    var onAddNew = (event) => {
        console.log("clicked add new")
        firebaseDB.ref("users/" + props.getUserID() + "/projects/").push("rw").set("new node")
    }

    return (
        <div id="project-card-container">
            <AddNew onAddNew={onAddNew} />
            {cards ?
                Object.entries(cards).map(
                    ([id, card]) => <Card key={id} card={card} />
                )
                : null
            }
        </div>
    )
}