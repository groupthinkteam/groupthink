import React, { useEffect } from 'react';
import { gsap, Draggable } from "gsap/all";
import { observer } from 'mobx-react-lite';
import { useStore } from '../../store/hook';

gsap.registerPlugin(Draggable)

const PlaceHeadArrow = (props) => {
    const { id, head, setHeadPathDragging, headPathDragging, strategy , path } = props;
    const store = useStore();
    useEffect(() => {
        const PlaceHeadArrow = Draggable.create("#PlaceHeadArrow".concat(id),
            {
                type: "top,left",
                cursor: 'pointer',
                activeCursor: "pointer",
                autoScroll: 1,
                onDragStart: function () {
                    gsap.set("#PlaceHeadArrow".concat(id), { top: head.y, left: head.x });
                    PlaceHeadArrow[0].update()
                },
                onDrag: function () {
                    console.log("HEAD DRAG")
                    setHeadPathDragging({ x: this.x, y: this.y, head: true })
                },
                onDragEnd: function () {
                    console.log("HEAD DRAG END",id)
                    store.hitTestCards.filter(cardID => cardID !== 'root' && cardID !== id && !store.cards[cardID]?.isCollapse).every(cardID => {
                        if (this.hitTest("#".concat(cardID))) {
                            console.log("i hit", cardID)
                            // call reparent
                            store.makeCardChild(id, cardID, strategy)
                            return false
                        }
                        return true
                    });
                    PlaceHeadArrow[0].update();
                    setHeadPathDragging(false);
                },
                onClick: () => {
                    //TODO :- Collapse Function
                }
            })
        return () => { if (PlaceHeadArrow[0]) PlaceHeadArrow[0].kill() }
    }, [head.x, head.y, id, setHeadPathDragging, store,strategy]);

    return (
        <>
            <svg style={{ zIndex: -1, opacity: 0.4, position: "absolute", overflow: "visible" }}>
                <defs>
                    <linearGradient id={"grad33".concat(props.id)} x1={'0%'} y1="0%" x2={"100%"} y2="0%">
                        <stop offset="0%" stopColor="#FF6B43" stopOpacity="1" />
                        <stop offset="100%" stopColor="#5FA2F1" stopOpacity="1" />
                    </linearGradient>
                </defs>
                <path
                    className="arrow-path"
                    strokeWidth="2"
                    fill="none"
                    stroke={`url(#grad33${props.id})`}
                    d={path} />
            </svg>
            <svg style={{ zIndex: -1, position: "absolute", overflow: "visible" }} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle style={{ position: "absolute" }}
                    id={"PlaceHeadArrow".concat(id)}
                    cx={headPathDragging ? headPathDragging.x : head.x}
                    cy={headPathDragging ? headPathDragging.y : head.y}
                    r="11.25"
                    fill="#FCFBF9" stroke="#413D45" stroke-width="1.5" />
                <svg x={headPathDragging ? headPathDragging.x - 6 : head.x - 6}
                    y={headPathDragging ? headPathDragging.y - 5 : head.y - 5} width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 1V11M6 11L11 7M6 11L1 7" stroke="#413D45" stroke-width="1.5" stroke-linecap="round" />
                </svg>

            </svg>
        </>
    )
}
export default observer(PlaceHeadArrow);