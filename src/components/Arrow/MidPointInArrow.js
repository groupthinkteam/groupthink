import React, { useCallback, useEffect, useState } from 'react';
import { gsap, Draggable } from "gsap/all";
import { observer } from 'mobx-react-lite';
import { useStore } from '../../store/hook';

gsap.registerPlugin(Draggable)

const MidPointInArrow = (props) => {
    const [collapse, setCollapse] = useState(false);
    const { id, midPoint, linePathDragging } = props;
    const store = useStore();

    const collapseChildren = useCallback((childrenId) => {
        const currentCard = store.cards[childrenId];

        if (childrenId === id)
            store.collapsedID[id] ?
                store.expandCard(id, 'main') : store.collapseCard(id, 'main')
        else
            collapse ?
                store.expandCard(childrenId) : store.collapseCard(childrenId);

        if (currentCard?.children) {
            Object.keys(currentCard.children).map(childId => collapseChildren(childId))
        }

        setCollapse(!collapse)
    }, [id, store, collapse])

    useEffect(() => {
        const mid = Draggable.create("#mid".concat(id),
            {
                type: "top,left",
                cursor: 'pointer',
                activeCursor: "pointer",
                onDragStart: function () {
                    gsap.set("#mid".concat(id), { top: midPoint.y, left: midPoint.x })
                    mid[0].update()
                },
                onClick: function () { collapseChildren(id) }
            })
        return () => { if (mid[0]) mid[0].kill() }
    }, [id, midPoint.x, midPoint.y, collapseChildren]);
    return (
        <svg style={{ position: "absolute", overflow: "visible", zIndex: -1 }}>
            <circle
                style={{ position: "absolute" }}
                id={"mid".concat(id)}
                cx={linePathDragging ? linePathDragging.x : midPoint.x}
                cy={linePathDragging ? linePathDragging.y : midPoint.y}
                r="3"
                stroke="black"
                strokeWidth="0px"
                fill={"#FF6B43"} />
        </svg>
    )
}
export default observer(MidPointInArrow);