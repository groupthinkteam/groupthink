import React, { useEffect } from 'react';
import { gsap, Draggable } from "gsap/all";
import { useStore } from '../../store/hook';
import { observer } from 'mobx-react-lite';

gsap.registerPlugin(Draggable)

const TailArrow = (props) => {
    const { id, tail, setLinePathDragging, linePathDragging} = props;
    const store = useStore();
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
                    setLinePathDragging({ x: this.x, y: this.y, tail: true })
                },
                onDragEnd: function () {
                    console.log("TAIL DRAG END")
                    store.hitTestCards.forEach(cardID => {
                        console.log("CARDID ",cardID,tailPath[0].hitTest(`#${cardID}`))
                        if(tailPath[0].hitTest("#".concat(cardID))) {
                            console.log("i hit", cardID)
                            // call reparent
                            store.reparentCard(id, cardID)
                        }
                    });
                    tailPath[0].update();
                    setLinePathDragging(false);
                },
                onClick: () => {
                    //TODO :- Collapse Function
                }
            })
        return () => { if (tailPath[0]) tailPath[0].kill() }
    }, [id, tail.x, tail.y, setLinePathDragging, props.id ,store]);
    return (
        <>
            <svg style={{ display:linePathDragging?.head ? 'none':'' , position: "absolute", overflow: "visible" }}>
                <circle
                    style={{ position: "absolute" }}
                    id={"tailPath".concat(id)}
                    cx={linePathDragging ? linePathDragging.x : tail.x}
                    cy={linePathDragging ? linePathDragging.y : tail.y}
                    r="5"
                    stroke="black"
                    strokeWidth="2px"
                    fill={linePathDragging ? "blue" :"#0fa958"} />
            </svg>
        </>
    )
}
export default observer( TailArrow);