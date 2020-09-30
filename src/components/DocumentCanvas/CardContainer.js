import React, { useState } from "react";
import GenericCard from "./Cards/GenericCard"
import Cursor from "./Cursor";
import { firebase } from "firebase";
/**
 * props:
 * 
 * @param {*} props 
 * 
 */
export default function CardContainer(props) {
    //console.log(props.currentUser().displayName)
    const dateTime = Date.now();
    return (
        <div className="card-container w-100 main_card"
            style={{ overflow: "scroll", position: "absolute", zIndex: 1 }}>
            <div className="container-filler"
                style={{ ...props.container, position: "absolute", zIndex: 9999999 }}
                onDoubleClick={(e) => {
                    // gets the coordinates of the double click relative to "filler"
                    var rect = e.target.getBoundingClientRect();
                    var x = Math.floor(e.clientX - rect.left);
                    var y = Math.floor(e.clientY - rect.top);
                    console.log("double click at", x, ",", y);
                    props.genericAPI.addChild({ x: x, y: y }, { width: 200, height: 300 })
                }}
                onMouseMove={(event) => {
                    console.log("triggered mouse move")
                    event.persist(); props.containerAPI.sendToDatabase(event);
                }}
            >
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
                {
                    props.room != undefined
                        ? Object.entries(props.room)
                            .filter(
                                ([id, values]) => id !== props.currentUser().uid && (dateTime - Number(values.time) < 60000))
                                /**
                                 * Check for the idle time of cursors in the room.
                                 * Change the comparison value to increase/decrease the timeout.
                                 */
                            .map(([id, position]) =>
                                <Cursor key={props.currentUser().uid}
                                    id={props.currentUser().uid}
                                    name={props.currentUser().displayName}
                                    x={position.x}
                                    y={position.y}
                                    projectID={props.projectID}
                                    room={props.room} />)
                        : null
                }
            </div>
        </div>
    )
}