import React, { useState, useEffect, useCallback } from "react";
import { gsap, Draggable } from "gsap/all";
import { useStore } from "../../store/hook";
import { observer } from "mobx-react-lite";

gsap.registerPlugin(Draggable)

/**
 * connects a child and a parent. consts the user assign a new parent for the child.
 * @param {*} props - id, head, tail
 */
const Arrow = observer((props) => {

    if (props.id === "root") return null;

    const [linePathDragging, setLinePathDragging] = useState(false);
    const store = useStore();

    const child = store.cards[props.id];

    if (child.parent === "root") return null;

    const parent = store.cards[child.parent];

    const head = {
        x: parent.position.x + parent.size.width / 2,
        y: parent.position.y + parent.size.height + 5,
    }
    const tail = {
        x: child.position.x + child.size.width / 2,
        y: child.position.y
    }
    const midPoint = {
        x: (tail.x + head.x) / 2,
        y: (tail.y + head.y) / 2
    }

    const reparentCard = useCallback((tailId) => {
        store.hitTestCards.forEach(cardID => {
            if (tailId[0].hitTest("#".concat(cardID))) {
                console.log("i hit", cardID)
                // call reparent
                store.reparentCard(props.id, cardID)
            }
        });
    }, [props.id, store]);

    useEffect(() => {
        const mid = Draggable.create("#mid".concat(props.id),
            {
                type: "top,left",
                cursor: 'pointer',
                activeCursor: "pointer",
                onDragStart: function () {
                    gsap.set("#mid".concat(props.id), { top: midPoint.y, left: midPoint.x })
                    mid[0].update()
                }
            })
        return () => { if (mid[0]) mid[0].kill() }
    }, [store, props.id, midPoint.x, midPoint.y]);

    useEffect(() => {
        const tailPath = Draggable.create("#tailPath".concat(props.id),
            {
                type: "top,left",
                cursor: 'pointer',
                activeCursor: "pointer",
                onDragStart: function () {
                    gsap.set("#tailPath".concat(props.id), { top: tail.y, left: tail.x });
                    tailPath[0].update()
                },
                onDrag: function () {
                    setLinePathDragging({ x: this.x, y: this.y, path: 'tailPath' })
                },
                onDragEnd: function () {
                    reparentCard(tailPath);
                    tailPath[0].update();
                    setLinePathDragging(false);
                },
                onClick: () => {
                    //TODO :- Collapse Function
                }
            })
        return () => { if (tailPath[0]) tailPath[0].kill() }
    }, [props.id, tail.x, tail.y, reparentCard]);
    useEffect(() => {
        const headPath = Draggable.create("#headPath".concat(props.id),
            {
                type: "top,left",
                cursor: 'pointer',
                activeCursor: "pointer",
                onDragStart: function () {
                    gsap.set("#headPath".concat(props.id), { top: head.y, left: head.x });
                    headPath[0].update()
                },
                onDrag: function () {
                    setLinePathDragging({ x: this.x, y: this.y })
                },
                onDragEnd: function () {
                    headPath[0].update();
                    setLinePathDragging(false);
                },
                onClick: () => {
                    //TODO :- Collapse Function
                }
            })
        return () => { if (headPath[0]) headPath[0].kill() }
    }, [store, props.id, head.x, head.y]);

    let tailPath, headPath;

    if (linePathDragging) {
        headPath = updatePath(linePathDragging.x, linePathDragging.y, linePathDragging.path ? tail.x : head.x, linePathDragging.path ? tail.y : head.y, 'tail');
        tailPath = updatePath(linePathDragging.x, linePathDragging.y, linePathDragging.path ? tail.x : head.x, linePathDragging.path ? tail.y : head.y, 'tail');
    }
    else {
        headPath = updatePath(head.x, head.y, midPoint.x, midPoint.y, 'tail')
        tailPath = updatePath(midPoint.x, midPoint.y, tail.x, tail.y)
    }

    function updatePath(x1, y1, x4, y4, path) {
        // Amount to offset control points
        var bezierWeight = path ? 0 : 0.1;
        var dx = Math.abs(x4 - x1) * bezierWeight;
        var x2 = x1 - dx;
        var x3 = x4 + dx;

        return `M${x1} ${y1} C ${x2} ${y1} ${x3} ${y4} ${x4} ${y4}`;
    }

    return (
        <div style={{ position: "absolute", overflow: "visible", zIndex: -1 }}>
            <svg style={{ opacity: 0.4, position: "absolute", overflow: "visible" }}>
                <path
                    id={"headPath".concat(props.id)}
                    strokeWidth="5"
                    fill="none"
                    stroke="blue"
                    d={headPath} />
            </svg>
            <svg style={{ position: "absolute", overflow: "visible" }}>
                <circle
                    style={{ position: "absolute" }}
                    id={"mid".concat(props.id)}
                    cx={linePathDragging ? linePathDragging.x : midPoint.x}
                    cy={linePathDragging ? linePathDragging.y : midPoint.y}
                    r="5"
                    stroke="black"
                    strokeWidth="2px"
                    fill="#0fa958" />
            </svg>
            <svg style={{ opacity: 0.4, position: "absolute", overflow: "visible" }}>
                <path
                    id={"tailPath".concat(props.id)}
                    strokeWidth="5"
                    fill="none"
                    stroke="#ff8577"
                    d={tailPath} />
            </svg>
        </div>
    )
});
export default Arrow