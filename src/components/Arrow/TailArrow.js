import React ,{useEffect} from 'react';
import { gsap, Draggable } from "gsap/all";

gsap.registerPlugin(Draggable)

const TailArrow = (props) => {
    const { id, tail, setLinePathDragging, tailPath, reparentCard } = props;
    useEffect(() => {
        const tailPath = Draggable.create("#tailPath".concat(id),
            {
                type: "top,left",
                cursor: 'pointer',
                activeCursor: "pointer",
                onDragStart: function () {
                    gsap.set("#tailPath".concat(id), { top: tail.y, left: tail.x });
                    tailPath[0].update()
                },
                onDrag: function () {
                    console.log("TAIL DRAG")
                    setLinePathDragging({ x: this.x, y: this.y, path: 'tailPath' })
                },
                onDragEnd: function () {
                    console.log("TAIL DRAG END")
                    reparentCard(tailPath);
                    tailPath[0].update();
                    setLinePathDragging(false);
                },
                onClick: () => {
                    //TODO :- Collapse Function
                }
            })
        return () => { if (tailPath[0]) tailPath[0].kill() }
    }, [id, tail.x, tail.y, setLinePathDragging, reparentCard]);
    return (
        <svg style={{ opacity: 0.4, position: "absolute", overflow: "visible" }}>
            <path
                id={"tailPath".concat(id)}
                strokeWidth="5"
                fill="none"
                stroke="#ff8577"
                d={tailPath} />
        </svg>
    )
}
export default TailArrow;