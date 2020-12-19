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
                autoScroll: 1,
                activeCursor: "pointer",
                onDragStart: function () {
                    gsap.set("#tail".concat(id), { top: tail.y, left: tail.x });
                    tailArrows[0].update()
                },
                onDrag: function () {
                    tailArrows[0].update();
                    console.log("TAIL DRAG", id)
                    setLinePathDragging({ x: this.x, y: this.y, tail: true })
                },
                onDragEnd: function () {
                    console.log("TAIL DRAG END")
                    store.hitTestCards.filter(cardID => cardID !== id && !store.cards[cardID]?.isCollapse).every(cardID => {
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
            <svg
                x={linePathDragging ? linePathDragging.x - 8 : tail.x - 8}
                id={"tail".concat(props.id)} y={linePathDragging ? linePathDragging.y - 20 : tail.y - 20} width="16" height="22" viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                {
                    !linePathDragging ?
                        <path opacity="0.8" d="M0 1C9 0.447715 8.55228 -2.41411e-08 8 0C7.44772 2.41411e-08 7 0.447715 7 1L9 1ZM7.29289 21.7071C7.68342 22.0976 8.31658 22.0976 8.70711 21.7071L15.0711 15.3431C15.4616 14.9526 15.4616 14.3195 15.0711 13.9289C14.6805 13.5384 14.0474 13.5384 13.6569 13.9289L8 19.5858L2.34315 13.9289C1.95262 13.5384 1.31946 13.5384 0.928933 13.9289C0.538408 14.3195 0.538408 14.9526 0.928933 15.3431L7.29289 21.7071ZM7 1L7 21L9 21L9 1L7 1Z" fill="#5FA2F1" />

                        : null
                }
            </svg>
            {
                !linePathDragging ?
                    <>
                        <svg
                            x={linePathDragging ? linePathDragging.x - 8 : tail.x - 13}
                            y={linePathDragging ? linePathDragging.y - 20 : tail.y - 40}
                            width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="11.25" fill="#FCFBF9" stroke="#FC611E" stroke-width="1.5" />
                        </svg>
                        <svg
                            x={linePathDragging ? linePathDragging.x - 8 : tail.x - 7}
                            y={linePathDragging ? linePathDragging.y - 20 : tail.y - 34}
                            width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.5 1.5L1.5 10.5" stroke="#FC611E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <svg
                            x={linePathDragging ? linePathDragging.x - 8 : tail.x - 7}
                            y={linePathDragging ? linePathDragging.y - 20 : tail.y - 34}
                            width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.5 1.5L10.5 10.5" stroke="#FC611E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </>
                    : null
            }
        </svg>

    )
}
export default observer(TailArrow);