import React from "react";
import { useStore } from "../../store/hook";
import { observer } from "mobx-react-lite"

import ArrowList from "../Arrow/ArrowsList";
import CursorsList from "../Cursor/CursorsList";
import CardsList from "../Card/CardsList";

import "../../styles/CardContainer.scss";
import Zoom from "../Zoom/Zoom";
function CardContainer(props) {
    let store = useStore()

    let containerElement = document.querySelector(".card-container")
    let transformOrigin = {
        x: window.innerWidth / 2 + containerElement?.scrollLeft,
        y: (window.innerHeight - 40) / 2 + containerElement?.scrollTop
    }

    return (
        <div className="card-container" id="card-container"
            style={{ overflow: "scroll", position: "absolute", zIndex: 1, width: "100vw" }}>
            <Zoom />
            <div className="container-filler" id="container-filler"
                style={{
                    ...store.container, position: "absolute", zIndex: 999, top: 0, left: 0,
                    transformOrigin: "0% 0%" //`${transformOrigin.x}px ${transformOrigin.y}px`
                    , transform: `scale(${store.zoom})`
                }}
                onDoubleClick={(e) => {
                    // gets the coordinates of the double click relative to "filler"
                    if (e.target.offsetParent && e.target.offsetParent.className === "card-container") {
                        var x = Math.floor((e.clientX + e.target.offsetParent.scrollLeft) / store.zoom);
                        var y = Math.floor((e.clientY - 40 + e.target.offsetParent.scrollTop) / store.zoom);
                        console.log("double click at", x, ",", y, ",", store.zoom);
                        store.addCard({ x: x, y: y }, { width: 275, height: 45 }, "root", "blank")
                    }
                    else {
                        console.log("registered a double click on a card and did absolutely nothing about it")
                    }
                }}
                onMouseMove={(e) => {
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