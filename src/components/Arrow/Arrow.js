import React, { useState, useEffect } from "react";
import { gsap, Draggable } from "gsap/all";

gsap.registerPlugin(Draggable)

/**
 * connects a child and a parent. lets the user assign a new parent for the child.
 * @param {*} props - id, head, tail, childID, parentID
 */
export default function Arrow(props) {
    let [dragging, setDragging] = useState(false);

    useEffect(() => {
        Draggable.create("#nub".concat(props.id),
            {
                type: "x,y",
                onDrag: function () {
                    setDragging({ x: this.x, y: this.y })
                },
                onDragEnd: function () {
                    setDragging(false)
                },
            })
    }, [])

    let path = ["M", props.head.x, props.head.y, props.tail.x, props.tail.y].join(" ");

    return (
        <div id={props.id} position="absolute">
            <div id={"nub" + props.id} className="arrow-draggable-nub"
                style={{ position: "relative", height: 30, width: 30, border: "1px solid black", borderRadius: 15 }} />
            <svg>
                <path d={path} />
            </svg>
        </div>
    )
}