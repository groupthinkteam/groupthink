import React, { useCallback, useState } from 'react';
import { gsap, Draggable } from "gsap/all";
import { observer } from 'mobx-react-lite';
import { useStore } from '../../store/hook';

gsap.registerPlugin(Draggable)

const MidPointInArrow = (props) => {
    const [collapse, setCollapse] = useState(false);
    const { id, midPoint, slopeX, slopeY } = props;
    const store = useStore();

    const collapseChildren = useCallback((childrenId) => {
        const currentCard = store.cards[childrenId];

        if (childrenId === id)
            store.collapsedID[id] ?
                store.expandCard(id, 'main') : store.collapseCard(id, 'main')
        else if (!store.toggleArrows || store.toggleCollapse) {
            currentCard.isCollapse ? store.expandCard(childrenId) : store.collapseCard(childrenId)
        }
        else
            collapse ?
                store.expandCard(childrenId) : store.collapseCard(childrenId);

        if (currentCard?.children) {
            Object.keys(currentCard.children).map(childId => collapseChildren(childId))
        }

        setCollapse(!collapse)
    }, [id, store, collapse])

    let openEye = {
        x: slopeX - 8,
        y: slopeY - 5
    }
    let eye = {
        x: slopeX - 3,
        y: slopeY - 2
    }
    return (
        <>
            <svg onClick={() => { collapseChildren(id) }} style={{ cursor: 'pointer', position: "absolute", overflow: "visible", zIndex: -1 }} x={midPoint.x}
                y={midPoint.y - 15 / 1.8} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle
                    id={"mid".concat(id)}
                    cx={slopeX}
                    cy={slopeY}//2.15 On LEFT
                    // cx="12" cy="12" 
                    r="11.25" fill="#FCFBF9" stroke="#413D45" stroke-width="1.5" />

                {
                    store.collapsedID[id] ?
                        <>
                            <svg
                                x={slopeX - 8} y={slopeY - 6 / 1.8}
                                width="16" height="6" viewBox="0 0 16 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.58398 1C1.58398 1 3.91732 4.5 8.00065 4.5C12.084 4.5 14.4173 1 14.4173 1" stroke="#413D45" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <svg
                                x={slopeX - 10} y={slopeY - 4 / 1.8}
                                width="5" height="5" viewBox="0 0 5 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.33398 1.33203L1.58398 3.66536" stroke="#413D45" stroke-width="1.5" stroke-linecap="round" />
                            </svg>
                            <svg
                                x={slopeX - 5} y={slopeY}
                                width="5" height="5" viewBox="0 0 5 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.33398 1.33203L1.58398 3.66536" stroke="#413D45" stroke-width="1.5" stroke-linecap="round" />
                            </svg>
                            <svg
                                x={slopeX} y={slopeY}
                                width="4" height="5" viewBox="0 0 4 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.45898 1.50008L2.60471 4.18229" stroke="#413D45" stroke-width="1.5" stroke-linecap="round" />
                            </svg>
                            <svg
                                x={slopeX + 5} y={slopeY - 5 / 1.8}
                                width="4" height="5" viewBox="0 0 4 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.45898 1.50008L2.60471 4.18229" stroke="#413D45" stroke-width="1.5" stroke-linecap="round" />
                            </svg>
                        </> :
                        <>
                            <svg x={openEye.x} y={openEye.y}
                                width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0.873047 5.99911C0.873047 5.99911 3.46478 0.908203 8.00032 0.908203C12.5359 0.908203 15.1276 5.99911 15.1276 5.99911C15.1276 5.99911 12.5359 11.09 8.00032 11.09C3.46478 11.09 0.873047 5.99911 0.873047 5.99911Z" stroke="#413D45" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <svg x={eye.x} y={eye.y}
                                width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 5C4.10457 5 5 4.10457 5 3C5 1.89543 4.10457 1 3 1C1.89543 1 1 1.89543 1 3C1 4.10457 1.89543 5 3 5Z" fill="#413D45" stroke="#413D45" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </>

                }
            </svg>

        </>
    )
}
export default observer(MidPointInArrow);