import React, { useState, useCallback } from "react";
import { gsap, Draggable } from "gsap/all";
import { useStore } from "../../store/hook";
import { observer } from "mobx-react-lite";
import HeadArrow from "./HeadArrow";
import MidPointInArrow from "./MidPointInArrow";
import TailArrow from "./TailArrow";

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
    console.log("ARROW ", linePathDragging)
    return (
        <div style={{ position: "absolute", overflow: "visible", zIndex: -1 }}>
            <HeadArrow
                id={props.id}
                head={head}
                headPath={headPath}
                setLinePathDragging={setLinePathDragging}
            />
            <MidPointInArrow 
                id={props.id}
                midPoint={midPoint}
                linePathDragging={linePathDragging}
            />
            <TailArrow
                id={props.id}
                tail={tail}
                tailPath={tailPath}
                setLinePathDragging={setLinePathDragging}
                reparentCard={reparentCard}
            />
        </div>
    )
});

export default Arrow