import React, { useState, useEffect } from "react";
import { gsap, Draggable } from "gsap/all";
import { useStore } from "../../store/hook";

gsap.registerPlugin(Draggable)

/**
 * connects a child and a parent. lets the user assign a new parent for the child.
 * @param {*} props - id, head, tail
 */
function Arrow(props) {
    let [dragging, setDragging] = useState(false);

    let store = useStore();

    let child = store.cards[props.id]
    let parent = store.cards[child.parent];

    let head = {
        x: parent.position.x + parent.size.width / 2,
        y: parent.position.y + parent.size.height / 2,
    }
    let tail = {
        x: child.position.x + child.size.width / 2,
        y: child.position.y - 5
    }

    useEffect(() => {
        let y = Draggable.create("#nub".concat(props.id),
            {
                type: "top,left",
                activeCursor: "grab",
                onDragStart: function () {
                    gsap.set("#nub".concat(props.id), { top: tail.y, left: tail.x })
                    y[0].update()
                },
                onDrag: function () {
                    setDragging({ x: this.x, y: this.y })
                },
                onDragEnd: function () {
                    // do a hittest
                    // if valid parent make the connection and update position
                    // if not valid, update position to previous
                    store.hitTestCards.forEach(cardID => {
                        if (y[0].hitTest("#".concat(cardID))) {
                            console.log("i hit", cardID)
                            // call reparent
                            store.reparentCard(props.id, cardID)
                        }
                    });
                    y[0].update()
                    setDragging(false)
                },
            })
        return () => { console.log("about to kill a draggable"); y[0].kill() }
    }, [store,props.id, tail.x,tail.y])

    let path;

    if (dragging) {
        path = updatePath(dragging.x, dragging.y, tail.x, tail.y)
    }
    else {
        path = updatePath(head.x, head.y, tail.x, tail.y - 5)
    }

    function updatePath(x1, y1, x4, y4) {
        // Amount to offset control points
        var bezierWeight = 0.1;

        var dx = Math.abs(x4 - x1) * bezierWeight;
        var x2 = x1 - dx;
        var x3 = x4 + dx;
        return `M${x1} ${y1} C ${x2} ${y1} ${x3} ${y4} ${x4} ${y4}`;
    }

    return (
        <div style={{ position: "absolute", height: 0, width: 0, top: 0, left: 0, overflow: "visible", zIndex: -1 }}>
            <svg style={{ position: "absolute", width: 0, height: 0, overflow: "visible" }}>
                <path
                    strokeWidth="3"
                    fill="none"
                    stroke="#ff8577"
                    d={path} />
            </svg>
            <svg style={{ position: "absolute", overflow: "visible", width: 0, height: 0 }}>
                <circle
                    style={{ position: "absolute" }}
                    id={"nub".concat(props.id)}
                    // cx={dragging ? dragging.x : (tail.x + head.x) / 2}
                    // cy={dragging ? dragging.y : (tail.y + head.y) / 2}
                    cx={dragging ? dragging.x : tail.x}
                    cy={dragging ? dragging.y : tail.y}
                    r="5"
                    stroke="black"
                    strokeWidth="2px"
                    fill="#0fa958" />
            </svg>
        </div>
    )
}

export default Arrow