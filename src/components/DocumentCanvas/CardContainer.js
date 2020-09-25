import React from "react";
import GenericCard from "./Cards/GenericCard"

/**
 * props:
 * 
 * @param {*} props 
 * 
 */
export default function CardContainer(props) {
    return (
        <div className="card-container w-100 main_card"
            style={{ overflow: "scroll", position: "absolute", zIndex: 1 }}>
            <div className="container-filler"
                style={{ ...props.container, position: "absolute", backgroundColor: "grey", zIndex: 0 }}
                onDoubleClick={(e) => {
                    // gets the coordinates of the double click relative to "filler"
                    var rect = e.target.getBoundingClientRect();
                    var x = Math.floor(e.clientX - rect.left);
                    var y = Math.floor(e.clientY - rect.top);
                    console.log("double click at", x, ",", y);
                    props.genericAPI.addChild({ x: x, y: y }, { width: 200, height: 300 })
                }} />

            {
                props.cards ? Object.entries(props.cards).filter(([id, card]) => id != "undefined" ).map(
                    ([id, card]) => {
                        if(id != undefined )
                        return(
                            <GenericCard
                                id={id}
                                card={card}
                                genericAPI={props.genericAPI}
                                typeAPI={props.typeAPI}
                            />
                        )
                        else return(<div/>)
                    }
                ) : <p>Double Click to Add a Card</p>
            }
        </div >
    )
}