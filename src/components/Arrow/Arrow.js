import React, { useState, useEffect, useRef } from "react";
import { gsap, Draggable } from "gsap/all";

gsap.registerPlugin(Draggable)

/**
 * connects a child and a parent. lets the user assign a new parent for the child.
 * @param {*} props - id, head, tail
 */
function Arrow(props) {
    let [dragging, setDragging] = useState(false);

    useEffect(() => {
        let y = Draggable.create("#nub".concat(props.id),
            {
                type: "top,left",
                activeCursor: "grab",
                onDragStart: function () {
                    gsap.set("#nub".concat(props.id), { top: props.tail.y, left: props.tail.x })
                    y[0].update()
                },
                onDrag: function () {
                    setDragging({ x: this.x, y: this.y })
                },
                onDragEnd: function () {
                    // do a hittest
                    // if valid parent make the connection and update position
                    // if not valid, update position to previous
                    props.hits.forEach(cardID => {
                        if (y[0].hitTest("#".concat(cardID))) {
                            console.log("i hit", cardID)
                            // call reparent
                            props.arrowAPI.reparentCard(props.id, cardID)
                        }
                    });
                    y[0].update()
                    setDragging(false)
                },
            })
        return () => { console.log("about to kill a draggable"); y[0].kill() }
    }, [props.hits])

    let path;

    if (dragging) {
        path = updatePath(dragging.x, dragging.y, props.tail.x + 0, props.tail.y)
    }
    else {
        path = updatePath(props.head.x + 0, props.head.y + 0, props.tail.x + 0, props.tail.y - 5)
    }

    function updatePath(x1, y1, x4, y4) {
        // Amount to offset control points
        var bezierWeight = 0;

        var dx = Math.abs(x4 - x1) * bezierWeight;
        var x2 = x1 - dx;
        var x3 = x4 + dx;
        return `M${x1} ${y1} C ${x2} ${y1} ${x3} ${y4} ${x4} ${y4}`;
    }

    return (
        <div style={{ position: "absolute", height: 0, width: 0, top: 0, left: 0, overflow: "visible" }}>
            <svg style={{ position: "absolute", overflow: "visible" }}>
                <path
                    strokeWidth="3"
                    fill="none"
                    stroke="grey"
                    d={path} />
                <circle
                    id={"nub"}
                    cx={props.tail.x + 0}
                    cy={props.tail.y - 5}
                    r="5"
                    fill="whitesmoke" />
            </svg>
            <svg style={{ position: "absolute", overflow: "visible" }}>
                <circle
                    style={{ position: "absolute" }}
                    id={"nub".concat(props.id)}
                    cx={dragging ? dragging.x : props.tail.x + 0}
                    cy={dragging ? dragging.y : props.tail.y - 5}
                    r="5"
                    fill="grey" />
            </svg>
        </div>
    )
}

export default React.memo(Arrow)