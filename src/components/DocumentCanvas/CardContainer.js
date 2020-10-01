import React, { useState } from "react";
import GenericCard from "./Cards/GenericCard"
import Cursor from "./Cursor";
import Arrow from "../Arrow/Arrow";
/**
 * props:
 * 
 * @param {*} props 
 * 
 */
export default function CardContainer(props) {
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
                    props.genericAPI.addChild({ x: x, y: y }, { width: 310, height: 360 })
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
                                <div>
                                    <GenericCard
                                        key={id}
                                        id={id}
                                        card={card}
                                        genericAPI={props.genericAPI}
                                        typeAPI={props.typeAPI}
                                    />
                                    {card.parent && card.parent !== "root" &&
                                        <Arrow id={"arrow".concat(id)} hits={Object.keys(props.cards)} head={props.cards[card.parent]["position"]} tail={card.position} />
                                    }
                                </div>
                            )
                        }
                    ) : <p>Double Click to Add a Card</p>
                }
                {
                    props.room != null || props.room != undefined
                        ? Object.entries(props.room)
                            .filter(
                                ([id, values]) => id !== props.currentUser().uid && (dateTime - Number(values.time) < 60000))
                            /**
                             * Check for the idle time of cursors in the room.
                             * Change the comparison value to increase/decrease the timeout.
                             */
                            .map(([id, values]) =>
                                <Cursor key={id}
                                    id={id}
                                    name={values.name}
                                    x={values.x}
                                    y={values.y}
                                    projectID={props.projectID}
                                    room={props.room} />)
                        : null
                }
            </div>
        </div>
    )
}