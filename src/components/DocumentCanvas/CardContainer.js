import React from "react";
import { useStore } from "../../store/hook";
import { observer } from "mobx-react-lite"

import ArrowList from "../Arrow/ArrowsList";
import CursorsList from "../Cursor/CursorsList";
import CardsList from "../Card/CardsList";

import "../../styles/CardContainer.scss";
import Zoom from "../Zoom/Zoom";
import '../Card/minimap.scss'
import Minimap from 'react-minimap';
function CardContainer(props) {
    const store = useStore();

    return (
        <>
        <div className="card-container" id="card-container"
            style={{ overflow: "scroll", position: "absolute", zIndex: 1, width: "100vw" }}>
            <Zoom />
            {
                Object.keys(store.cards).length < 2 ?
                    <div className="double-click">
                        double click anywhere to add a new card
                        </div>
                    : null
            }
            <Minimap selector=".generic-card" >
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
                        var y = Math.floor((e.clientY - 50 + e.target.offsetParent.scrollTop) / store.zoom);
                        console.log("double click at", x, ",", y, ",", store.zoom);
                        store.addCard({ x: x, y: y }, { width: 275, height: 45 }, "root", "blank")
                    }
                    else {
                        console.log("registered a double click on a card and did absolutely nothing about it")
                    }
                }}
                onClick={(e) => {
                    if (e.target.className === "container-filler") {
                        if (store.currentActive) {
                            store.removeUserEditing(store.currentActive, 'editing');
                            store.currentActive = null;
                        }
                        // leaving room for other side effects
                        store.currentContext = null;
                        store.editingCard = null;
                    }
                    // TODO - handle closing things when the user clicks on any regular card instead 
                    // of the bare canvas
                    else {
                        let className = e.target.className;
                        if (className === "")
                            store.currentContext = null;
                    }
                }}
                onMouseMove={(e) => {
                    e.persist();
                    var x = Math.floor((e.clientX + e.currentTarget.offsetParent.scrollLeft) / store.zoom);
                    var y = Math.floor((e.clientY - 50 + e.currentTarget.offsetParent.scrollTop) / store.zoom);
                    store.saveCursorPosition(
                        x, y
                    );
                }}
            >
                 
                <ArrowList />
                <CursorsList />
                
                <CardsList />
            </div>
            </Minimap>
        </div>
        </>
    )
}

export default observer(CardContainer)