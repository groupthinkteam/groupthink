import React, {  useEffect, useState } from 'react';
import { gsap, Draggable } from "gsap/all";
import { observer } from 'mobx-react-lite';
import { useStore } from '../../store/hook';

gsap.registerPlugin(Draggable)

const MidPointInArrow = (props) => {
    const [collapse, setCollapse] = useState(false);
    const { id, midPoint, linePathDragging } = props;
    const store = useStore();
    const childArray = [];

    const collapseChildren = (childrenId,startegy) => {
        if (childrenId) {
            childArray.push(childrenId);
            const children = store.cards[childrenId];
            startegy? store.expandCard(childrenId) : store.collapseCard(childrenId);
            if (children.children) {
                Object.keys(children.children).map(childId=>collapseChildren(childId))
            }
            else{
                return false
            }
        }
        else {
            return false
        }
    }
    
    if (collapse ) {
        collapseChildren(props.id);
    }
    else {
        //collapseChildren(props.id,'expand');
    }

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
                onClick: function () { console.log("MID CALLED"); setCollapse(!collapse); }
            })
        return () => { if (mid[0]) mid[0].kill() }
    }, [id, midPoint.x, midPoint.y, collapse]);
    return (
        <svg style={{ position: "absolute", overflow: "visible" }}>
            { collapse ? "-" : "+"}
            <circle
                style={{ position: "absolute" }}
                id={"mid".concat(id)}
                cx={linePathDragging ? linePathDragging.x : midPoint.x}
                cy={linePathDragging ? linePathDragging.y : midPoint.y}
                r="5"
                stroke="black"
                strokeWidth="2px"
                fill="#0fa958" />
        </svg>
    )
}
export default observer(MidPointInArrow);