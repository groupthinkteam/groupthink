import React from "react";
import { useStore } from "../../store/hook";
import { observer } from "mobx-react-lite"

import ArrowList from "../Arrow/ArrowsList";
import CursorsList from "../Cursor/CursorsList";
import CardsList from "../Card/CardsList";

import "../../styles/CardContainer.scss";

function CardContainer(props) {
    let store = useStore()
    console.log("CardContainer ", store.container.width, window.innerWidth)
    return (
        <div className="card-container" id="card-container"
            style={{ overflow: "scroll", position: "absolute", zIndex: 1, width: "100vw" }}>
            <input
                className="zoom-slider"
                style={{ position: "fixed", top: "40px", left: "10px", zIndex: 9999999999 }}
                type="range"
                min="0.5"
                max="2.5"
                defaultValue="1"
                step="0.0001"
                onChange={e => { store.zoom = e.target.value; console.log("ZOON  TEST ", store.zoom) }}
            />
            <div className="container-filler"
                style={{ ...store.container, position: "absolute", zIndex: 999, top: 0, left: 0, transformOrigin: "0% 0%", transform: `scale(${store.zoom})` }}
                onDoubleClick={(e) => {
                    // gets the coordinates of the double click relative to "filler"
                    if (e.target.offsetParent && e.target.offsetParent.className === "card-container") {
                        var x = Math.floor((e.clientX + e.target.offsetParent.scrollLeft) / store.zoom);
                        var y = Math.floor((e.clientY - 40 + e.target.offsetParent.scrollTop) / store.zoom);
                        console.log("double click at", x, ",", y, ",", store.zoom);
                        store.addCard({ x: x, y: y }, { width: 150, height: 50 }, "root", "blank")
                    }
                    else {
                        console.log("registered a double click on a card and did absolutely nothing about it")
                    }
                }}
                onMouseMove={(e) => {
                    console.log("triggered mouse move on")
                    e.persist();
                        var x = Math.floor((e.clientX + e.currentTarget.offsetParent.scrollLeft) / store.zoom);
                        var y = Math.floor((e.clientY - 40 + e.currentTarget.offsetParent.scrollTop) / store.zoom);
                        store.saveCursorPosition(
                            x, y
                        );
                }}
            >

                <ArrowList />
                <CursorsList />
                <CardsList />
            </div>
        </div>
    )
}

export default observer(CardContainer)