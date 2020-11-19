import React, { useEffect } from 'react';
import { gsap, Draggable } from "gsap/all";
import { useStore } from '../../store/hook';
import { observer } from 'mobx-react-lite';

gsap.registerPlugin(Draggable)

const TailArrow = (props) => {
    const { id, tail, setLinePathDragging, linePathDragging } = props;
    const store = useStore();
    useEffect(() => {
        const tailArrows = Draggable.create("#tail".concat(id),
            {
                type: "top,left",
                cursor: 'pointer',
                autoScroll:1,
                activeCursor: "pointer",
                onDragStart: function () {
                    gsap.set("#tail".concat(id), { top: tail.y, left: tail.x });
                    tailArrows[0].update()
                },
                onDrag: function () {
                    tailArrows[0].update();
                    console.log("TAIL DRAG",id)
                    setLinePathDragging({ x: this.x, y: this.y, tail: true })
                },
                onDragEnd: function () {
                    console.log("TAIL DRAG END")
                    store.hitTestCards.filter(cardID=>cardID!==id && !store.cards[cardID]?.isCollapse).every(cardID => {
                        if (this.hitTest("#".concat(cardID))) {
                            console.log("i hit", cardID)
                            // call reparent
                            store.reparentCard(id, cardID)
                            return false
                        }
                            return true
                    });
                    // tailArrows[0].update();
                    setLinePathDragging(false);
                },
                onClick: () => {
                    //TODO :- Collapse Function
                }
            })
        return () => { if (tailArrows[0]) tailArrows[0].kill() }
    }, [id, tail.x, tail.y, setLinePathDragging, store]);
    return (
        
            <svg style={{ zIndex: -1, position: "absolute", overflow: "visible" }}>
                <circle
                    id={"tail".concat(props.id)}
                    style={{ position: "absolute" }}
                    cx={linePathDragging ? linePathDragging.x : tail.x}
                    cy={linePathDragging ? linePathDragging.y : tail.y}
                    r="5"
                    stroke="black"
                    strokeWidth="2px"
                    fill={linePathDragging ? "blue" : "#0fa958"} />
            </svg>
        
    )
}
export default observer(TailArrow);