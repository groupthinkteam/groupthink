import React,{useState} from "react";
import GenericCard from "./Cards/GenericCard"
import Cursor from "./Cursor";
/**
 * props:
 * 
 * @param {*} props 
 * 
 */
export default function CardContainer(props) {
    //console.log(props.currentUser().displayName)
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
                props.cards ? Object.entries(props.cards).filter(([id, card]) => id && id !== "root").map(
                    ([id, card]) => {
                        return (
                            <GenericCard
                                key={id}
                                id={id}
                                card={card}
                                genericAPI={props.genericAPI}
                                typeAPI={props.typeAPI}
                            />
                        )
                    }
                ) : <p>Double Click to Add a Card</p>
            }
            <div className="container"
                style={{ position: "absolute", height: "100vh", width: "100vw" }}
                onMouseMove={(event) => {
                    event.persist(); props.containerAPI.sendToDatabase(event);
                }}
            >
                {
                    props.room != undefined?
                    Object.entries(props.room)
                    .filter(([id, position]) => id !== props.currentUser().uid)
                    .map(([id, position]) => <Cursor key={props.currentUser().uid} id={props.currentUser().uid} name={props.currentUser().displayName} x={position.x} y={position.y} />)
                    : null
                }
          </div>
        </div >
    )
}