import React, { useState } from "react";
import { gsap, Draggable } from "gsap/all";
import { useStore } from "../../store/hook";
import { observer } from "mobx-react-lite";
import HeadArrow from "./HeadArrow";
import MidPointInArrow from "./MidPointInArrow";
import TailArrow from "./TailArrow";

import "../../styles/Arrow.scss"
import PlaceArrowHead from "./PlaceArrowHead";

gsap.registerPlugin(Draggable)

/**
 * connects a child and a parent. consts the user assign a new parent for the child.
 * @param {*} props - id, head, tail
 */

const Arrow = (props) => {

    const [linePathDragging, setLinePathDragging] = useState(false);
    const [headPathDragging, setHeadPathDragging] = useState(false);
    const [showArrowButtons, setShowArrowButtons] = useState(false);
    const store = useStore();
    const child = store.cards[props.id];

    if (!child) return null

    const parent = store.cards[child.parent];

    if (!parent) return null;

    const PlaceArrow = (strategy) => {
        let path;
        const tailRoot = {
            x: child.position.x + child.size.width / 2,
            y: child.position.y + child.size.height + 10
        }
        if (headPathDragging?.head) {
            path = updatePath(headPathDragging.x, headPathDragging.y === tailRoot.y ? headPathDragging.y + 1 : headPathDragging.y, tailRoot.x, tailRoot.y)
        }
        return (
            <>
                <PlaceArrowHead
                    path={path}
                    id={props.id}
                    head={tailRoot}
                    strategy={strategy}
                    headPathDragging={headPathDragging}
                    setHeadPathDragging={setHeadPathDragging}
                />
            </>
        );
    }
    if (child.parent === "root") {
        if (store.currentActive !== props.id) return null;
        if (child.children) return null
        return PlaceArrow()
    }
    const head = {
        x: parent.position.x + parent.size.width / 2,
        y: parent.position.y + parent.size.height + 9,
    }
    var tail = {
        x: child.position.x + (store.collapsedID[props.id] ? child.size.width * 0.46 : child.size.width / 2),
        y: child.position.y - 7,
        position: 'top'
    }
    //TAIL POSITIONING
    if (parent.position.x > child.position.x + child.size.width) {
        console.log("Left")
        tail = {
            x: child.position.x + (store.collapsedID[props.id] ? 193 : child.size.width) + 35,
            y: child.position.y + child.size.height,
            position: 'left'
        }
    }
    else if (parent.position.x < child.position.x - child.size.width) {
        console.log("Right");
        tail = {
            x: child.position.x - 25 + (store.collapsedID[props.id] ? 63 : 0),
            y: child.position.y + (store.collapsedID[props.id] ? child.size.height : child.size.height),
            position: 'right'
        }
    }
    // if(parent.position.y > child.position.y)
    // console.log("TOP")
    // else
    // console.log("BOTTOM")

    const midPoint = {
        x: (tail.x + head.x) / 2,
        y: (tail.y + head.y) / 2
    }


    let path, childPath;
    if (linePathDragging?.tail) {
        let tempX, tempY;
        switch (tail.position) {
            case "right":
                tempX = tail.x + 25
                tempY = tail.y - (child.size.height / 2)
                break;
            case "left":
                tempX = tail.x - 33
                tempY = tail.y - (child.size.height / 2)
                break;
            default:
                tempX = tail.x
                tempY = tail.y
                break;
        }
        path = updatePath(linePathDragging.x, linePathDragging.y, tempX, tempY)
    }
    else if (linePathDragging?.head) {
        childPath = updatePath(head.x === tail.x ? head.x + 1 : head.x, head.y === tail.y - 19 ? head.y + 1 : head.y, tail.x, tail.y - 19)

        path = updatePath(linePathDragging.x, linePathDragging.y, head.x, linePathDragging.y === head.y ? head.y + 1 : head.y)
    }
    else {
        let tempX, tempY;
        switch (tail.position) {
            case "right":
                tempX = tail.x
                tempY = tail.y - 19
                break;
            case "left":
                tempX = tail.x - 7
                tempY = tail.y - 17
                break;
            default:
                tempX = tail.x
                tempY = tail.y - 18
                break;
        }
        path = updatePath(head.x === tail.x ? head.x + 1 : head.x, head.y === tail.y - 19 ? head.y + 1 : head.y, tempX, tempY)
    }
    var slopeX, slopeY;
    function updatePath(x1, y1, x4, y4) {
        // Amount to offset control points
        var bezierWeightX = x4 > x1 ? -0.8 : 1.1;
        if (tail && tail?.position === 'top')
            bezierWeightX = x4 > x1 ? 0.1 : -0.1
        var dx = Math.abs(x4 - x1) * bezierWeightX;
        var x2 = (x1 - dx);
        var x3 = (x4 + dx);
        var bezierWeightY = y1 > y4 ? -0.01 : 0.01;
        if (tail && tail?.position === 'top')
            bezierWeightY = y1 > y4 ? 1 : -1
        var dy = Math.abs(y4 - y1) * bezierWeightY;
        var y2 = (y1 - dy);
        var y3 = (y4 + dy);
        switch (tail?.position) {
            case "right":
                slopeX = ((x3 + midPoint.x) / 2) + (x4 > x1 ? 15 : -10);
                slopeY = ((y3 + midPoint.y) / 2) + (y1 > y4 ? -3 : -2);
                break;
            case "left":
                slopeX = ((x3 + midPoint.x) / 2) + (x4 > x1 ? 1 : -(x3 / 100));
                slopeY = ((y3 + midPoint.y) / 2) + (y1 > y4 ? -2 : -((y3 - 2) / 100));
                break;
            case "top":
                slopeX = (x4 + midPoint.x) / 2;
                slopeY = (y3 + midPoint.y) / 2;
                break;
            default: break;
        }
        return `M${x1} ${y1} C${x1} ${y1} ${x3} ${y3} ${x4} ${y4}`;
    }
    // console.log("ARROW ", linePathDragging)
    return (
        <div style={{ position: "absolute", overflow: "visible", zIndex: -1 }}
            onMouseEnter={() => setShowArrowButtons(true)}
            onMouseLeave={() => setShowArrowButtons(false)}
        >
            <svg style={{ zIndex: -1, opacity: 0.4, position: "absolute", overflow: "visible" }}>
                <defs>
                    <linearGradient id={"grad3".concat(props.id)} x1={head.x > tail.x ? "100%" : '0%'} y1="0%" x2={head.x > tail.x ? "0%" : "100%"} y2="0%">
                        <stop offset="0%" stopColor="#FF6B43" stopOpacity="1" />
                        <stop offset="100%" stopColor="#5FA2F1" stopOpacity="1" />
                    </linearGradient>
                </defs>
                <path
                    className="arrow-path"
                    strokeWidth="2"
                    fill="none"
                    stroke={`url(#grad3${props.id})`}
                    d={path} />
            </svg>
            {
                (!child.children && store.currentActive === props.id) ?
                    PlaceArrow("subChild")
                    : null
            }
            {
                linePathDragging?.head ?
                    <>
                        <svg style={{ zIndex: -1, opacity: 0.4, position: "absolute", overflow: "visible" }}>
                            <path
                                className="arrow-path"
                                strokeWidth="2"
                                fill="none"
                                stroke={`url(#grad3${props.id})`}
                                d={childPath} />
                        </svg>
                        <svg style={{ zIndex: -1, position: "absolute", overflow: "visible" }} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle style={{ position: "absolute" }}
                                id={"headArrowstatic".concat(props.id)}
                                cx={head.x}
                                cy={head.y}
                                r="11.25"
                                fill="#FCFBF9" stroke="#413D45" stroke-width="1.5" />
                            <svg x={head.x - 6}
                                y={head.y - 5} width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 1V11M6 11L11 7M6 11L1 7" stroke="#413D45" stroke-width="1.5" stroke-linecap="round" />
                            </svg>
                        </svg>
                        <MidPointInArrow
                            id={"k".concat(props.id)}
                            slopeX={-10}
                            slopeY={-10}
                            midPoint={midPoint}
                        />
                        <TailArrow
                            id={props.id}
                            tail={tail}
                            setLinePathDragging={setLinePathDragging}
                        />
                    </>
                    : null
            }
            <HeadArrow
                id={props.id}
                head={head}
                linePathDragging={linePathDragging}
                setLinePathDragging={setLinePathDragging}
            />
            {
                showArrowButtons ?
                    <MidPointInArrow
                        id={props.id}
                        slopeX={slopeX}
                        slopeY={slopeY}
                        midPoint={midPoint}
                        linePathDragging={linePathDragging}
                    />
                    : null
            }

            {
                linePathDragging?.tail || !linePathDragging ?
                    <TailArrow
                        id={props.id}
                        tail={tail}
                        showArrowButtons={showArrowButtons}
                        linePathDragging={linePathDragging}
                        setLinePathDragging={setLinePathDragging}
                    />
                    : null
            }

        </div>
    )
};

export default observer(Arrow)