import React, { useState, useEffect } from "react";
import CardContainer from "./CardContainer";
import { firebaseDB } from "../../services/firebase";

export default function CardManager(props) {
    // store container-related state
    let [container, setContainer] = useState({ size: { width: 600, height: 800 }, cardOffset: {} });

    // everything to do with cards
    let [cards, setCards] = useState({});

    // position of the document center in the frame of local coords
    let [docCenter, setDocCenter] = useState({ x: 1000, y: 5000 })

    // project reference in firebase db
    let projectRef = firebaseDB.ref("documents/" + props.projectID + "/nodes");

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

    // card operations
    let onDelete = (id) => {
        setCards({ ...cards, [id]: undefined });
        projectRef.child(id).remove().then(console.log("removed", id));
    }

    // update local state during card drag
    // if card crosses tripwires on any side, expand ccontainer
    // and adjust document center
    let localMove = (id, newPos, cardSize) => {

        setCards({ ...cards, [id]: { ...cards[id], position: newPos } });
    }

    let savePosition = (id, newPos) => {
        projectRef.child(id).child("position").set(newPos).then(console.log("set new position for", id, "to", newPos));
    }

    let onResize = (id, newSize) => {
        setCards({ ...cards, [id]: { ...cards[id], size: newSize } });
        projectRef.child(id).child("size").set(newSize).then(console.log("set new size for", id, "to", newSize));
    }

    // initially adds a blank card, type is inferred later
    let addCard = () => {
        let blankCard = {
            type: "blank",
            size: { width: 200, height: 300 },
            position: { x: 300, y: 300 },
            content: {
                text: "add some content here, this is a blank node"
            }
        }
        let newCardKey = projectRef.push().key;
        setCards({ ...cards, [newCardKey]: blankCard });
        projectRef.child(newCardKey).set(blankCard).then(console.log("added new card with key", newCardKey));
    }

    let changeType = (id, newType) => {
        setCards({ ...cards, [id]: { ...cards[id], type: newType } });
        projectRef.child(id).child("type").set(newType).then(console.log("set new type for", id, "to", newType));
    }

    // update card content locally for controlled rendering purposes
    let changeContent = (id, newContent) => {
        console.log("triggered content change on", id)
        setCards({ ...cards, [id]: { ...cards[id], content: newContent } });
    }

    // push card content to firebase
    let saveContent = (id, newContent) => {
        changeContent(id, newContent);
        console.log("hello")
        projectRef.child(id).child("content").set(cards[id]["content"])
            .then(console.log("saved new content for", id));
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
        save: saveContent
    }

    return (
        <CardContainer
            container={container}
            cards={cards}
            cardAPI={cardAPI}
        />
    )
}