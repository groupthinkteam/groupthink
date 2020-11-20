import React from "react";
import { useStore } from "../../store/hook";
import { observer } from "mobx-react-lite"

import ArrowList from "../Arrow/ArrowsList";
import CursorsList from "../Cursor/CursorsList";
import CardsList from "../Card/CardsList";

import "../../styles/CardContainer.scss";
//on FUll Zoom TEST OFFSET PARENT  1563 1643 triggered mouse move 214 530
//on Zoom OUT TEST OFFSET PARENT  0 35 triggered mouse move 353 429
function CardContainer(props) {
    let store = useStore()
    console.log("CardContainer ", store.container.width,window.innerWidth)
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
                onChange={e => {store.zoom = e.target.value;console.log("ZOON  TEST ",store.zoom)}}
            />
            <div className="container-filler"
                style={{ ...store.container, position: "absolute", zIndex: 999, top: 0, left: 0 , transformOrigin: "0% 0%", transform: `scale(${store.zoom})`}}
                onDoubleClick={(e) => {
                    // gets the coordinates of the double click relative to "filler"
                    if (e.target.offsetParent && e.target.offsetParent.className === "card-container") {
                        var x = Math.floor(e.clientX / store.zoom + e.target.offsetParent.scrollLeft/store.zoom);
                        var y = Math.floor(e.clientY / store.zoom + e.target.offsetParent.scrollTop/store.zoom - 40);
                        console.log("double click at", x, ",", y,",",store.zoom);
                        if(store.zoom ===1 )
                        store.addCard({ x:x,y:y}, { width: 310, height: 200 }, "root", "blank");
                        else
                        store.addCard({ x:x, y:store.zoom>1 ? y+(store.zoom*40 - 80) : y+Math.floor(store.zoom*40-60) }, { width: 310, height: 200 }, "root", "blank")
                    }
                    else {
                        console.log("registered a double click on a card and did absolutely nothing about it")
                    }
                }}

                onMouseMove={(event) => {
                    //console.log("triggered mouse move",event.clientX,event.clientY )
                    event.persist();
                    // var cardContainerElement = document.querySelector('.card-container');
                    // console.log("TEST OFFSET PARENT " ,cardContainerElement.scrollLeft,cardContainerElement.scrollTop);
                    // console.log("Compared to ZOOM ",store.zoom>=1 ?cardContainerElement.scrollLeft/store.zoom :cardContainerElement.scrollLeft*store.zoom)
                    if (event.target.offsetParent && event.target.offsetParent.className === "card-container") {
                        var x = Math.floor(event.clientX / store.zoom + event.target.offsetParent.scrollLeft/ store.zoom);
                        var y = Math.floor(event.clientY / store.zoom + event.target.offsetParent.scrollTop/ store.zoom - 40);
                        store.saveCursorPosition(
                            x,y
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