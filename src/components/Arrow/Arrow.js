import React, { useState, useEffect } from "react";
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

    const [tailDragging, setTailDragging] = useState(false);
    const [headDragging, setHeadDragging] = useState(false);
    const [linePathDragging, setLinePathDragging] = useState(false);
    const store = useStore();

    const child = store.cards[props.id];

    if (child.parent === "root") return null;

    const parent = store.cards[child.parent];
    console.log(child.parent , parent,store.cards)
    const head = {
        x: parent.position.x + parent.size.width / 2,
        y: parent.position.y + parent.size.height+5,
    }
    const tail = {
        x: child.position.x + child.size.width / 2,
        y: child.position.y 
    }
    const midPoint = {
        x: (tail.x + head.x) / 2,
        y: (tail.y + head.y) / 2
    }

    useEffect(() => {
        const headId = Draggable.create("#head".concat(props.id),
            {
                type: "top,left",
                activeCursor: "grab",
                onDragStart: function () {
                    gsap.set("#head".concat(props.id), { top: head.y, left: head.x })
                    headId[0].update()
                },
                onDrag: function () {
                    setHeadDragging({ x: this.x, y: this.y })
                },
                onDragEnd: function () {
                    headId[0].update()
                    setHeadDragging(false)
                },
            });
        return () => { if(headId[0])headId[0].kill();}
    }, [store, props.id, head.x, head.y])
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
        return () => {if(mid[0]) mid[0].kill() }
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
                    store.hitTestCards.forEach(cardID => {
                        if (tailPath[0].hitTest("#".concat(cardID))) {
                            console.log("i hit", cardID)
                            // call reparent
                            store.reparentCard(props.id, cardID)
                        }
                    });
                    tailPath[0].update();
                    setLinePathDragging(false);
                },
                onClick: () => {
                    //TODO :- Collapse Function
                }
            })
        return () => {if(tailPath[0])tailPath[0].kill()  }
    }, [store, props.id, tail.x, tail.y]);
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
                    // store.hitTestCards.forEach(cardID => {
                    //     if (headPath[0].hitTest("#".concat(cardID))) {
                    //         console.log("i hit", cardID)
                    //         // call reparent
                    //         store.reparentCard(props.id, cardID)
                    //     }
                    // });
                    headPath[0].update();
                    setLinePathDragging(false);
                },
                onClick: () => {
                    //TODO :- Collapse Function
                }
            })
        return () => { if(headPath[0])headPath[0].kill()}
    }, [store, props.id, head.x, head.y]);

    useEffect(() => {
        const tailId = Draggable.create("#tail".concat(props.id),
            {
                type: "top,left",
                activeCursor: "grab",
                onDragStart: function () {
                    gsap.set("#tail".concat(props.id), { top: tail.y, left: tail.x })
                    tailId[0].update();
                },
                onDrag: function () {
                    setTailDragging({ x: this.x, y: this.y })
                },
                onDragEnd: function () {
                    // do a hittest
                    // if valid parent make the connection and update position
                    // if not valid, update position to previous
                    store.hitTestCards.forEach(cardID => {
                        if (tailId[0].hitTest("#".concat(cardID))) {
                            console.log("i hit", cardID)
                            // call reparent
                            store.reparentCard(props.id, cardID)
                        }
                    });
                    tailId[0].update();
                    setTailDragging(false)
                },
            })
        return () => {if(tailId[0])tailId[0].kill() }
    }, [store, props.id, tail.x, tail.y])

    let tailPath, headPath;

    if (tailDragging) {
        tailPath = updatePath(tailDragging.x, tailDragging.y, midPoint.x, midPoint.y, 'tail')
        headPath = updatePath(head.x, head.y, midPoint.x, midPoint.y - 5)
    }
    else if (headDragging) {
        headPath = updatePath(headDragging.x, headDragging.y, midPoint.x, midPoint.y);
        tailPath = updatePath(midPoint.x, midPoint.y, tail.x, tail.y - 5)
    }
    else if (linePathDragging) {
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
            <svg style={{ opacity: 0.4, position: "absolute", overflow: "visible" }}>
                <path
                    id={"tailPath".concat(props.id)}
                    strokeWidth="5"
                    fill="none"
                    stroke="#ff8577"
                    d={tailPath} />
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
        </div>
    )
})

export default Arrow