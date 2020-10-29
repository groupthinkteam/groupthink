import React from "react";
import { useStore } from "../../store/hook";
import { observer } from "mobx-react-lite"

import ArrowList from "../Arrow/ArrowsList";
import CursorsList from "../Cursor/CursorsList";
import CardsList from "../Card/CardsList";

import "../../styles/CardContainer.scss";

function CardContainer(props) {
    let store = useStore()
    console.log("CardContainer ", store.container)
    return (
        <div className="card-container"
            style={{ overflow: "scroll", position: "absolute", zIndex: 1, width: "100vw" }}>
            <input
                className="zoom-slider"
                style={{ position: "fixed", top: "60px", left: "10px", zIndex: 9999999999 }}
                type="range"
                min="0.5"
                max="2.5"
                defaultValue="1"
                step="0.0001"
                onChange={e => store.zoom = e.target.value}
            />
            <div className="container-filler"
                style={{ ...store.container, position: "absolute", zIndex: 9999999, top: 0, left: 0, transformOrigin: "0% 0%", transform: `scale(${store.zoom})` }}
                onDoubleClick={(e) => {
                    // gets the coordinates of the double click relative to "filler"
                    if (e.target.offsetParent && e.target.offsetParent.className === "card-container") {
                        var x = Math.floor(e.clientX / store.zoom + e.target.offsetParent.scrollLeft);
                        var y = Math.floor(e.clientY / store.zoom + e.target.offsetParent.scrollTop - 60);
                        console.log("double click at", x, ",", y);
                        store.addCard({ x: x, y: y }, { width: 310, height: 200 }, "root", "blank")
                    }
                    else {
                        console.log("registered a double click on a card and did absolutely nothing about it")
                    }
                }}
                onMouseMove={(event) => {
                    console.log("triggered mouse move")
                    event.persist();
                    if (event.target.offsetParent && event.target.offsetParent.className === "card-container") {
                        store.saveCursorPosition(
                            event.clientX + event.target.offsetParent.scrollLeft,
                            event.clientY + event.target.offsetParent.scrollTop - 60
                        );
                    }
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