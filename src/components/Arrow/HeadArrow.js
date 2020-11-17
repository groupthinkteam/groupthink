import React, { useEffect } from 'react';
import { gsap, Draggable } from "gsap/all";
import { observer } from 'mobx-react-lite';
import { useStore } from '../../store/hook';

gsap.registerPlugin(Draggable)

const HeadArrow = (props) => {
    const { id, head, setLinePathDragging, linePathDragging } = props;
    const store = useStore();
    useEffect(() => {
        const headArrow = Draggable.create("#headArrow".concat(id),
            {
                type: "top,left",
                cursor: 'pointer',
                activeCursor: "pointer",
                onDragStart: function () {
                    gsap.set("#headArrow".concat(id), { top: head.y, left: head.x });
                    headArrow[0].update()
                },
                onDrag: function () {
                    console.log("HEAD DRAG")
                    setLinePathDragging({ x: this.x, y: this.y, head: true })
                },
                onDragEnd: function () {
                    console.log("HEAD DRAG END")
                    store.hitTestCards.every(cardID => {
                        console.log("CARDID ",cardID,headArrow[0].hitTest(`#${cardID}`))
                        if(this.hitTest("#".concat(cardID))) {
                            console.log("i hit", cardID)
                            // call reparent
                            store.reparentCard(id, cardID)
                            return false
                        }
                        return true
                    });
                    headArrow[0].update();
                    setLinePathDragging(false);
                },
                onClick: () => {
                    //TODO :- Collapse Function
                }
            })
        return () => { if (headArrow[0]) headArrow[0].kill() }
    }, [head.x, head.y, id, setLinePathDragging,store]);


    return (
        <>

            <svg style={{zIndex:-1, position: "absolute", overflow: "visible" }} >
                <circle
                    style={{ position: "absolute" }}
                    id={"headArrow".concat(id)}
                    cx={linePathDragging ? linePathDragging.x : head.x}
                    cy={linePathDragging ? linePathDragging.y : head.y}
                    r="5"
                    stroke="black"
                    strokeWidth="2px"
                    fill={linePathDragging ? "blue" : "#0fa958"}
                />
            </svg>
        </>
    )
}
export default observer( HeadArrow);