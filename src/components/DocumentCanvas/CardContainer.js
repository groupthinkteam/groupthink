import React from "react";
import GenericCard from "./Cards/GenericCard"
import Button from "../Button/Button"
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

/**
 * props layout:
 * 
 * @param {*} props 
 * 
 */

// props:
// 1. cards: an object containing cardID: card_info entries
// 2. cardAPI: methods that set card params/other card stuff
// 3. projectID: firebase id of the current project
// 3. //TODO: container resizing
export default function CardContainer(props) {
    const cardAPI = props.cardAPI; // for brevity
    //console.log("Card API \n ",url);
    return (
        <div className="card-container w-100 main_card"
            style={{ overflow: "scroll", position: "absolute" }}>
            <div className="container-filler"
                style={{ ...props.container, position: "absolute", backgroundColor: "grey", zIndex: 0 }}
                onDoubleClick={(e) => {
                    // gets the coordinates of the double click relative to "filler"
                    var rect = e.target.getBoundingClientRect();
                    var x = Math.floor(e.clientX - rect.left);
                    var y = Math.floor(e.clientY - rect.top);
                    console.log("double click at", x, ",", y);
                    props.cardAPI.add("blank", { x: x, y: y })
                }} />

            {
                props.cards ? Object.entries(props.cards).filter(([id, card]) => id != null).map(
                    ([id, card]) => {
                        return (
                            <GenericCard
                                id={id}
                                type={card.type}
                                content={card.content}
                                cardAPI={cardAPI}
                            />
                        )
                    }
                ) : <p>Container is Empty!!</p>
            }
        </div >
    )
}