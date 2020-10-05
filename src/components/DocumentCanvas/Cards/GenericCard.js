import React, { useEffect, useState } from "react";
import { gsap, Draggable } from "gsap/all";

import cardChooser from "./cardChooser";

import "../../../styles/Cards/GenericCard.scss";

/**
 * TODO :-
 * Check Multiple Uploaded File Renders in single card
 * Files Card Having Different Name ...Correction Needed
 */

// register gsap plugin so it doesn't get discarded during tree shake
gsap.registerPlugin(Draggable);

// wrapper for CardType that abstracts away some functionality common to all CardTypes
function GenericCard(props) {

    let CardType = cardChooser(props.card?.type, props.card.content);

    // if size changes, animate it
    useEffect(
        () => { gsap.to("#".concat(props.id), { ...props.card.size, duration: 0.3 }) },
        [props.card.size.height, props.card.size.width]
    )

    useEffect(
        () => { gsap.set("#".concat(props.id), { opacity: 1, ...props.card.position }) }
        , [props.id, props.card.position])
    useEffect(
        () => {
            // warning: can't use arrow functions here since that messes up the "this" binding
            function drag() {
                console.log("now that was a drag");
                this.update();
            }
            function dragStop() {
                props.genericAPI.savePosition(props.id, { x: this.x, y: this.y });
            }
            let y = Draggable.create(
                "#".concat(props.id),
                {
                    autoScroll: 1,
                    trigger: "#handle".concat(props.id),
                    onDrag: drag,
                    onDragEnd: dragStop
                })
            return () => y[0].kill()
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []
    )

    return (
        <div id={props.id} className="generic-card"
            style={{
                position: "absolute",
                opacity: 0
            }}>
            <div id={"handle".concat(props.id)} className="card-handle card-title-bar">
                <button className="card-control-button add"
                    onClick={() => props.genericAPI.addChild(
                        {
                            x: props.card.position.x + 100,
                            y: props.card.position.y + 100
                        },
                        {
                            width: props.card.size.width,
                            height: props.card.size.height,
                        },
                        props.id,
                        "blank"
                    )}>
                    +
                </button>
                <button className="card-control-button lock">
                    L
                </button>
                <button className="card-control-button delete"
                    onClick={() => props.genericAPI.removeCard(props.id, "recursive", props.card.parent)}>
                    X
                </button>
            </div>
            <CardType typeAPI={props.typeAPI} content={props.card.content} size={props.card.size} id={props.id} />
        </div>
    )
}

export default React.memo(GenericCard);