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
                autoScroll: 1,
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
                    store.hitTestCards.filter(cardID =>cardID!=='root' && cardID !== id && !store.cards[cardID]?.isCollapse).every(cardID => {
                        if (this.hitTest("#".concat(cardID))) {
                            console.log("i hit", cardID)
                            // call reparent
                            store.makeCardChild(id, cardID)
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
    }, [head.x, head.y, id, setLinePathDragging, store]);


    return (
        <>
            <svg style={{ zIndex: -1, position: "absolute", overflow: "visible" }} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle style={{ position: "absolute" }}
                    id={"headArrow".concat(id)}
                    cx={linePathDragging ? linePathDragging.x : head.x}
                    cy={linePathDragging ? linePathDragging.y : head.y}
                    r="11.25"
                    fill="#FCFBF9" stroke="#413D45" stroke-width="1.5" />
                <svg x={linePathDragging ? linePathDragging.x - 6 : head.x - 6}
                    y={linePathDragging ? linePathDragging.y - 5 : head.y - 5} width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 1V11M6 11L11 7M6 11L1 7" stroke="#413D45" stroke-width="1.5" stroke-linecap="round" />
                </svg>

            </svg>
        </>
    )
}
export default observer(HeadArrow);