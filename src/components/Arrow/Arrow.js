import React, { useState } from "react";
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
const Arrow = (props) => {
    
    const [linePathDragging, setLinePathDragging] = useState(false);
    const store = useStore();
    if (props.id === "root") return null;
    const child = store.cards[props.id];

    if (child.parent === "root") return null;
    
    if(child.isCollapse) return null;

    const parent = store.cards[child.parent];

    const head = {
        x: parent.position.x + parent.size.width / 2,
        y: parent.position.y + parent.size.height + 9,
    }
    const tail = {
        x: child.position.x + child.size.width / 2,
        y: child.position.y - 7
    }
    const midPoint = {
        x: (tail.x + head.x) / 2,
        y: (tail.y + head.y) / 2
    }

    let path;

    if (linePathDragging?.tail) {
        path = updatePath(linePathDragging.x, linePathDragging.y, tail.x, tail.y)
    }
    else if (linePathDragging?.head) {
        path = updatePath(linePathDragging.x, linePathDragging.y, head.x, head.y)
    }
    else {
        path = updatePath(head.x, head.y, tail.x, tail.y - 5)
    }


    function updatePath(x1, y1, x4, y4) {
        // Amount to offset control points
        var bezierWeight = 0;
        var dx = Math.abs(x4 - x1) * bezierWeight;
        var x2 = x1 - dx;
        var x3 = x4 + dx;

        return `M${x1} ${y1} C ${x2} ${y1} ${x3} ${y4} ${x4} ${y4}`;
    }
    // console.log("ARROW ", linePathDragging)
    return (
        <div style={{ position: "absolute", overflow: "visible", zIndex: -1 }}>
            <svg style={{zIndex:-1, opacity: 0.4, position: "absolute", overflow: "visible" }}>
                <path
                    strokeWidth="5"
                    fill="none"
                    stroke={linePathDragging ? "blue" : "green"}
                    d={path} />
            </svg>
            <HeadArrow
                id={props.id}
                head={head}
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
                setLinePathDragging={setLinePathDragging}
            />
        </div>
    )
};

export default observer(Arrow)