import React, { useEffect } from "react";
import { gsap, Draggable } from "gsap/all";

import cardChooser from "./cardChooser";

import "../../../styles/Cards/GenericCard.scss";

// register gsap plugin so it doesn't get discarded during tree shake
gsap.registerPlugin(Draggable);

// wrapper for CardType that abstracts away some functionality common to all CardTypes
export default function GenericCard(props) {
    let CardType = cardChooser(props.card.type);
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
                    onDrag: drag,
                    onDragEnd: dragStop
                })
            console.log(y)
            return () => y[0].kill()
        }, []
    )

    return (
        <div id={props.id} className="card custom_card border-0" style={{ width: 350, height: 200, position: "absolute" }}>
            <div className="card-handle card-title-bar">
                <button className="absolute delete_btn wh-20p rounded-circle"
                    onClick={() => props.cardAPI.removeCard(props.id, "reparent", props.card.parent)}>
                    X
                </button>
                <button className="absolute lock_btn wh-20p rounded-circle">
                    <i className="fa fa-lock" aria-hidden="true"></i>
                </button>
                <button className="absolute add_btn wh-20p"
                    onClick={() => props.genericAPI.addChild(
                        {
                            x: props.card.position.x + 100,
                            y: props.card.position.y + 100
                        })}>
                    <span className="rounded-circle">+</span>
                </button>
            </div>
            <CardType typeAPI={props.typeAPI} content={props.card.content} />
        </div>
    )
}