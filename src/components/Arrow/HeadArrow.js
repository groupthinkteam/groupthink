import React, { useEffect } from 'react';
import { gsap, Draggable } from "gsap/all";

gsap.registerPlugin(Draggable)

const HeadArrow = (props) => {
    const { id, head, setLinePathDragging,  linePathDragging } = props;
    useEffect(() => {
        const headPath = Draggable.create("#headPath".concat(id),
            {
                type: "top,left",
                cursor: 'pointer',
                activeCursor: "pointer",
                onDragStart: function () {
                    gsap.set("#headPath".concat(id), { top: head.y, left: head.x });
                    headPath[0].update()
                },
                onDrag: function () {
                    console.log("HEAD DRAG")
                    setLinePathDragging({ x: this.x, y: this.y, head: true })
                },
                onDragEnd: function () {
                    console.log("HEAD DRAG END")
                    headPath[0].update();
                    setLinePathDragging(false);
                },
                onClick: () => {
                    //TODO :- Collapse Function
                }
            })
        return () => { if (headPath[0]) headPath[0].kill() }
    }, [head.x, head.y, id, setLinePathDragging]);
    
      
    return (
        <>
            
            <svg style={{ display:linePathDragging?.tail ? 'none':'', position: "absolute", overflow: "visible" }} >
                <circle
                    style={{ position: "absolute" }}
                    id={"headPath".concat(id)}
                    cx={linePathDragging ? linePathDragging.x : head.x}
                    cy={linePathDragging ? linePathDragging.y : head.y}
                    r="5"
                    stroke="black"
                    strokeWidth="2px"
                    fill={linePathDragging ? "blue" :"#0fa958"}
                />
            </svg>
        </>
    )
}
export default HeadArrow;