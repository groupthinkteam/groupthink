import React, { useState, useEffect } from "react";
import GenericCard from "./Cards/GenericCard"
import Cursor from "../Cursor/Cursor";
import Arrow from "../Arrow/Arrow";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

import "../../styles/CardContainer.scss";
import InlineTextEdit from "../InlineTextEdit/InlineTextEdit";
import { useStore } from "../../store/hook";
import ArrowList from "../Arrow/ArrowsList";
import CursorsList from "../Cursor/CursorsList";

/**
 * props:
 * 
 * @param {*} props 
 * 
 */
function CardContainer(props) {
    let store = useStore()
    const [zoom, setZoom] = useState(1);
    const [result, setResult] = useState();
    const dateTime = Date.now();
    const updateCursorPos = (event) => {
        if (props.lastActive && event.target.offsetParent != null) {
            var flag = false;
            Object.entries(props.lastActive)
                .map(([id, values]) => {
                    //console.log("TESTING ",id,values , "Diff", ((dateTime - Number(values) ) < 60000))
                    if (id !== props.currentUser().uid && (dateTime - Number(values) < 60000)) {
                        //console.log("TESTING ",id,values , "Diff", ((dateTime - Number(values) ) < 60000))
                        flag = true;
                    }
                })

            props.containerAPI.saveCursorPosition(
                event.clientX + event.target.offsetParent.scrollLeft,
                event.clientY + event.target.offsetParent.scrollTop
            );
        }

    }
    const onChangeSearch = (text) => {
        const result = props.containerAPI.searchElement(text);
        setResult(result);
    }
    return (
        <div className="card-container"
            style={{ overflow: "scroll", position: "absolute", zIndex: 1, width: "100vw" }}>
            {
                Object.keys(props.cards).length > 1 ?
                    <>
                        <input
                            className="zoom-slider"
                            style={{ position: "fixed", top: "60px", left: "10px", zIndex: 9999999999 }}
                            type="range"
                            min="0.5"
                            max="2.5"
                            defaultValue="1"
                            step="0.0001"
                            onChange={e => setZoom(e.target.value)}
                        />
                        <div
                            style={{ position: "fixed", top: "60px", left: "10px", zIndex: 9999999999 }}
                        >
                            <InlineTextEdit
                                onFocus={e => { console.log(e.target.select()); e.target.select() }}
                                borderColor='black'
                                onChange={(e) => onChangeSearch(e.target.value)}
                            />
                        </div>
                    </>
                    : null

            }
            <div className="container-filler"
                style={{ ...props.container, position: "absolute", zIndex: 9999999, top: 0, left: 0, transformOrigin: "0% 0%", transform: `scale(${zoom})` }}
                onDoubleClick={(e) => {
                    // gets the coordinates of the double click relative to "filler"
                    if (e.target.offsetParent && e.target.offsetParent.className === "card-container" && !props.isLocked) {
                        var x = Math.floor(e.clientX / zoom + e.target.offsetParent.scrollLeft);
                        var y = Math.floor(e.clientY / zoom + e.target.offsetParent.scrollTop - 60);
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
                    // props.cursors && Object.keys(props.cursors).length >1 )
                    updateCursorPos(event)
                }}
            >

                <ArrowList />
                <CursorsList />
                {
                    props.cards ? Object.entries(props.cards).filter(([id, card]) => id && id !== "root").map(
                        ([id, card]) => {
                            return (
                                <div key={"wrapperdiv".concat(id)}>
                                    <GenericCard
                                        key={id}
                                        id={id}
                                        card={card}
                                        genericAPI={props.genericAPI}
                                        typeAPI={props.typeAPI}
                                        isLocked={props.isLocked}
                                        currentUser={props.currentUser}
                                        activeUser={props.activeUser}
                                        result={result}
                                        userListDetail={props.userListDetail}
                                    />
                                        }

                                </div>
                            )
                        }
                    ) : <p>Double Click to Add a Card</p>
                }
            </div>
        </div>
    )
}
export default React.memo(CardContainer)