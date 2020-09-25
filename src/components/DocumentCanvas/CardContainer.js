import React from "react";
import GenericCard from "./Cards/GenericCard"

/**
 * props:
 * 
 * @param {*} props 
 * 
 */
export default function CardContainer(props) {
    const cardAPI = props.cardAPI; // for brevity
    return (
        <div className="card-container w-100 main_card"
            style={{ overflow: "scroll", position: "absolute", zIndex: 1 }}>
            <div className="container-filler"
                style={{ ...props.container, position: "absolute", backgroundColor: "grey", zIndex: -1 }}
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