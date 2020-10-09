import React, { useState } from "react";
import GenericCard from "./Cards/GenericCard"
import Cursor from "./Cursor";
import Arrow from "../Arrow/Arrow";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

import "../../styles/CardContainer.scss";

/**
 * props:
 * 
 * @param {*} props 
 * 
 */
export default function CardContainer(props) {
    const [zoom, setZoom] = useState(1)
    const dateTime = Date.now();
    return (
        <div className="card-container"
            style={{ overflow: "scroll", position: "absolute", zIndex: 1, width: "100vw" }}>
            {
                Object.keys(props.cards).length > 1 ?
                    <input type="range" min="0.5" max="2.5" defaultValue="1" step="0.1" onChange={e => setZoom(e.target.value)} />
                    : null
            }
            <div className="container-filler"
                style={{ ...props.container, position: "absolute", zIndex: 9999999, top: 0, left: 0, transformOrigin: "0% 0%", transform: `scale(${zoom})` }}
                onDoubleClick={(e) => {
                    // gets the coordinates of the double click relative to "filler"
                    if (e.target.offsetParent.className === "card-container" && !props.isLocked) {
                        var x = Math.floor(e.clientX + e.target.offsetParent.scrollLeft);
                        var y = Math.floor(e.clientY + e.target.offsetParent.scrollTop);
                        console.log("double click at", x, ",", y);
                        props.genericAPI.addChild({ x: x, y: y }, { width: 310, height: 200 })
                    }
                    else {
                        console.log("registered a double click on a card and did absolutely nothing about it")
                    }
                }}
                onMouseMove={(event) => {
                    console.log("triggered mouse move")
                    event.persist();
                    props.containerAPI.saveCursorPosition(event);
                }}
            >
                {
                    props.cards ? Object.entries(props.cards).filter(([id, card]) => id && id !== "root").map(
                        ([id, card]) => {
                            return (
                                <div key={"wrapperdiv".concat(id)}>
                                    <ContextMenuTrigger id={"contextmenu".concat(id)} >
                                        {
                                            props.isLocked && card?.type === "blank" ? null :
                                            <GenericCard
                                                key={id}
                                                id={id}
                                                card={card}
                                                genericAPI={props.genericAPI}
                                                typeAPI={props.typeAPI}
                                                isLocked={props.isLocked}
                                            />
                                        }
                                    </ContextMenuTrigger>
                                    <ContextMenu id={"contextmenu".concat(id)} className="card-context-menu">
                                        <MenuItem onClick={() => !props.isLocked ?
                                            props.genericAPI.addChild(
                                                {
                                                    x: card.position.x + 100,
                                                    y: card.position.y + 100
                                                },
                                                {
                                                    width: card.size.width,
                                                    height: card.size.height,
                                                },
                                                id,
                                                "blank"
                                            )
                                            :null
                                        }
                                        >
                                            add child
                                        </MenuItem>
                                        <MenuItem onClick={() =>!props.isLocked ? props.genericAPI.removeCard(id, "recursive", card.parent) :null}>
                                            delete
                                        </MenuItem>
                                    </ContextMenu>
                                    {
                                        card.parent && card.parent !== "root" &&
                                        <Arrow
                                            key={"arrow".concat(id)}
                                            id={"".concat(id)}
                                            arrowAPI={props.arrowAPI}
                                            hits={Object.keys(props.cards)}
                                            head={{
                                                x: props.cards[card.parent]["position"].x + props.cards[card.parent]["size"].width / 2,
                                                y: props.cards[card.parent]["position"].y + props.cards[card.parent]["size"].height / 2,
                                            }}
                                            tail={{
                                                x: card.position.x + card.size.width / 2,
                                                y: card.position.y - 5
                                                // x: card.position.x + card.size.width / 2,
                                                // y: card.position.y + card.size.height / 2
                                            }}
                                        />
                                    }
                                </div>
                            )
                        }
                    ) : <p>Double Click to Add a Card</p>
                }
                {
                    props.cursors
                        ? Object.entries(props.cursors)
                            .filter(
                                ([id, values]) => id !== props.currentUser().uid && (dateTime - Number(values.time) < 60000))
                            .map(([id, values]) =>
                                <Cursor key={id}
                                    id={id}
                                    name={values.name}
                                    x={values.x}
                                    y={values.y}
                                    projectID={props.projectID}
                                />)
                        : null
                }
            </div>
        </div >
    )
}