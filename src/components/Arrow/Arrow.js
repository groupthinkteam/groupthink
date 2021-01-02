import React, { useEffect, useState } from "react";
import { gsap, Draggable } from "gsap/all";
import { useStore } from "../../store/hook";
import { observer } from "mobx-react-lite";
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

    const [headPathDragging, setHeadPathDragging] = useState(false);
    const [showArrowButtons, setShowArrowButtons] = useState(false);

    const store = useStore();
    const child = store.cards[props.id];
    useEffect(() => {
        if (headPathDragging && store.currentActive === props.id) {
            setShowArrowButtons(false);
        }
    }, [headPathDragging, props.id, store.currentActive])
    if (!child) return null

    const parent = store.cards[child.parent];

    if (!parent) return null;

    const PlaceArrow = (strategy) => {
        let path;
        const tailRoot = {
            x: child.position.x + child.size.width / 2 ,
            y: child.position.y + child.size.height + 5
        }
        if (store.collapsedID[props.id]) return null
        if (headPathDragging?.head) {
            path = updatePath(headPathDragging.x, headPathDragging.y === tailRoot.y ? headPathDragging.y + 1 : headPathDragging.y, tailRoot.x, tailRoot.y - 7)
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
        return PlaceArrow()
    }
    var head = {
        x: parent.position.x + parent.size.width / 2,
        y: parent.position.y + parent.size.height,
    }
    var tail = {
        x: child.position.x + (store.collapsedID[props.id] ?( 135 /2 ) : child.size.width / 2),
        y: child.position.y - 7,
        position: 'bottom'
    }
    //TAIL POSITIONING
    if(store.collapsedID[props.id] && parent.position.x > child.position.x +130 ){
        console.log("COLLAPSED LEFT")
        tail = {
            x: child.position.x + (store.collapsedID[props.id] ? 135 : child.size.width) + 35,
            y: child.position.y + 17 + (store.collapsedID[props.id] ? 28 : (child.size.height / 2)),
            position: 'left'
        }
    }
    else if (parent.position.x > child.position.x + child.size.width) {
        console.log("Left")
        tail = {
            x: child.position.x + (store.collapsedID[props.id] ? 135 : child.size.width) + 35,
            y: child.position.y + 17 + (store.collapsedID[props.id] ? 28 : (child.size.height / 2)),
            position: 'left'
        }
    }
    else if (parent.position.x +parent.size.width< child.position.x ) {
        console.log("Right");
        tail = {
            x: child.position.x - 25 + (store.collapsedID[props.id] ? (0) : 0),
            y: child.position.y + 17 + (store.collapsedID[props.id] ? 28 : child.size.height / 2),
            position: 'right'
        }
    }
    else if (parent.position.y + parent.size.height > child.position.y) {
        console.log("TOP");
        tail = {
            x: child.position.x + (store.collapsedID[props.id] ? (135/2): child.size.width / 2),
            y: child.position.y + child.size.height + 35,
            position: 'top'
        }
    }
    let path;

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
        case "top":
            tempX = tail.x + 8
            tempY = tail.y - 10
            break;
        default:
            tempX = tail.x
            tempY = tail.y - 18
            break;
    }
    path = updatePath(
        head.x === tempX ? head.x + 1 : head.x,
        head.y === tempY ? head.y + 1 : head.y
        , tempX, tempY
    )

    var slopeX, slopeY;
    function updatePath(x1, y1, x4, y4) {
        // Amount to offset control points
        var bezierWeightX = x4 > x1 ? -0.8 : 1.1;
        if (tail && (tail?.position === 'bottom' || tail?.position === 'top'))
            bezierWeightX = x4 > x1 ? 0.1 : -0.1
        var dx = Math.abs(x4 - x1) * bezierWeightX;
        // var x2 = (x1 - dx);
        var x3 = (x4 + dx);
        var bezierWeightY = y1 > y4 ? -0.01 : 0.01;
        if (tail && (tail?.position === 'bottom' || tail?.position === 'top'))
            bezierWeightY = y1 > y4 ? 1 : -1
        var dy = Math.abs(y4 - y1) * bezierWeightY;
        // var y2 = (y1 - dy);
        var y3 = (y4 + dy);
        switch (tail?.position) {
            case "right":
                slopeX = tail.x-38;
                slopeY = tail.y-18;
                break;
            case "left":
                slopeX = tail.x+32;
                slopeY = tail.y -18;
                break;
            case "bottom":
                slopeX = tail.x-2;
                slopeY = tail.y-55;
                break;
            case "top":
                slopeX = tail.x+8;
                slopeY = tail.y+32;
                break;
            default:
                break;
        }
        return `M${x1} ${y1} C${x1} ${y1} ${x3} ${y3} ${x4} ${y4}`;
    }
    return (
        <div style={{ position: "absolute", overflow: "visible", zIndex: store.currentActive === props.id && !headPathDragging? 90000 : -1 }}
            onMouseEnter={() => headPathDragging ? null : setShowArrowButtons(true)}
            onMouseLeave={() => setShowArrowButtons(false)}
        >
            <svg style={{ zIndex: -1, opacity: 0.4, position: "absolute", overflow: "visible" }}>
                <defs>
                    <linearGradient id={"grad3".concat(props.id)} x1={head.x > tail.x ? "100%" : '0%'} y1="0%" x2={head.x > tail.x ? "0%" : "100%"} y2="0%">
                        <stop offset="0%" stopColor="#FF6B43" stopOpacity="1" />
                        <stop offset="100%" stopColor="#5FA2F1" stopOpacity="1" />
                    </linearGradient>
                </defs>
                {/* Duplicated for extra width on hover */}
                <path
                    className="arrow-path"
                    strokeWidth="25"
                    fill="none"
                    stroke={`transparent`}
                    d={path} />
                <path
                    className="arrow-path"
                    strokeWidth="2"
                    fill="none"
                    stroke={`url(#grad3${props.id})`}
                    d={path} />
            </svg>
            {
                store.currentActive === props.id ?
                    PlaceArrow("subChild")
                    : null
            }

            {
                showArrowButtons && !store.collapsedID[props.id] ?
                    <MidPointInArrow
                        id={props.id}
                        slopeX={slopeX}
                        slopeY={slopeY}
                        midPoint={tail}
                    />
                    : null
            }

            <TailArrow
                id={props.id}
                tail={tail}
                showArrowButtons={showArrowButtons}
            />

        </div>
    )
};

export default observer(Arrow)