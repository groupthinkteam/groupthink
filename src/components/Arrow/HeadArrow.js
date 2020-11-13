import React ,{useEffect} from 'react';
import { gsap, Draggable } from "gsap/all";

gsap.registerPlugin(Draggable)

const HeadArrow = (props) => {
    const { id, head, setLinePathDragging, headPath } = props;
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
                    setLinePathDragging({ x: this.x, y: this.y })
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
        <svg style={{ opacity: 0.4, position: "absolute", overflow: "visible" }}>
            <path
                id={"headPath".concat(id)}
                strokeWidth="5"
                fill="none"
                stroke="blue"
                d={headPath} />
        </svg>
    )
}
export default HeadArrow;