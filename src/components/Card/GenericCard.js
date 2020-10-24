import React, { useEffect, useRef } from "react";
import { gsap, Draggable } from "gsap/all";

import cardChooser from "./cardChooser";

import "../../../styles/Cards/GenericCard.scss";
import { useStore } from "../../store/hook";

/**
 * TODO :-
 * Check Multiple Uploaded File Renders in single card
 * Files Card Having Different Name ...Correction Needed
 */

// register gsap plugin so it doesn't get discarded during tree shake
gsap.registerPlugin(Draggable);

// wrapper for CardType that abstracts away some functionality common to all CardTypes
function GenericCard(props) {
    let store = useStore();
    let me = store.cards[props.id];
    const CardType = cardChooser(me.type);
    const cardRef = useRef(null);

    // if size changes, animate it
    useEffect(() => { gsap.set("#".concat(props.id), me.size) }, [me, props.id])

    // update position
    useEffect(
        () => { gsap.set("#".concat(props.id), { opacity: 1, ...me.position, boxShadow: "0px 0px 0px 0px white" }) }
        , [props.id, me.position])
    useEffect(
        () => {
            // warning: can't use arrow functions here since that messes up the "this" binding
            function drag() {
                console.log("now that was a drag");
                me.position = { x: this.x, y: this.y }
            }
            function dragStop() {
                gsap.to("#".concat(props.id), {
                    boxShadow: "none",
                    duration: 0.5
                })
                store.savePosition(props.id, { x: this.x, y: this.y });
            }
            function dragStart() {
                gsap.to("#".concat(props.id), {
                    boxShadow: "0 11px 15px -7px rgba(51, 61, 78, 0.2), 0 9px 46px 8px rgba(51, 61, 78, 0.12), 0 24px 38px 3px rgba(51, 61, 78, 0.14)",
                    duration: 0.5
                })
            }
            let y = Draggable.create(
                "#".concat(props.id),
                {
                    autoScroll: 1,
                    trigger: "#".concat(props.id),
                    dragClickables: false,
                    onClick: () => { cardRef.current.focus() },
                    onDragStart: dragStart,
                    onDrag: drag,
                    onDragEnd: dragStop,
                    cursor: "grab",
                    activeCursor: "grabbing"
                })
            return () => y[0].kill()
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []
    )
    // console.log("USER INFO",isActive)
    return (
        <>
            <div id={props.id} tabIndex={0}
                className="generic-card"
                ref={cardRef}
                onKeyDown={(e) => {
                    console.log("pressed ", e.key);
                    if (e.key === "Delete" || e.key === "Backspace") {
                        props.genericAPI.removeCard(props.id, "recursive")
                    }
                }}
                style={{
                    position: "absolute",
                    opacity: 0
                }}>
                <div style={{ width: me.size.width, height: me.size.height, position: "absolute", top: 0, boxShadow: "0 1px 2px 0 rgba(51,61,78,0.25)" }}>
                    <CardType typeAPI={props.typeAPI} content={me.content} size={me.size} id={props.id} />
                </div>
            </div>
        </>
    )
}

export default React.memo(GenericCard);