import React from 'react';
import { gsap, Draggable } from "gsap/all";
import { useStore } from '../../store/hook';
import { observer } from 'mobx-react-lite';

gsap.registerPlugin(Draggable)

const TailArrow = (props) => {
    const { id, tail, linePathDragging } = props;
    const store = useStore();
    const bottomSVG = (
        <svg
            x={linePathDragging ? linePathDragging.x - 8 : tail.x - 8}
            id={"tail".concat(props.id)} y={linePathDragging ? linePathDragging.y - 20 : tail.y - 20} width="16" height="22" viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            {
                !linePathDragging ?
                    <path opacity="0.8" d="M0 1C9 0.447715 8.55228 -2.41411e-08 8 0C7.44772 2.41411e-08 7 0.447715 7 1L9 1ZM7.29289 21.7071C7.68342 22.0976 8.31658 22.0976 8.70711 21.7071L15.0711 15.3431C15.4616 14.9526 15.4616 14.3195 15.0711 13.9289C14.6805 13.5384 14.0474 13.5384 13.6569 13.9289L8 19.5858L2.34315 13.9289C1.95262 13.5384 1.31946 13.5384 0.928933 13.9289C0.538408 14.3195 0.538408 14.9526 0.928933 15.3431L7.29289 21.7071ZM7 1L7 21L9 21L9 1L7 1Z" fill="#5FA2F1" />
                    : null
            }
        </svg>
    )
    const leftSVG = (
        <svg id={"tail".concat(props.id)}
            x={linePathDragging ? linePathDragging.x - 27 : tail.x - 27}
            y={linePathDragging ? linePathDragging.y : tail.y - 25} width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            {
                !linePathDragging ?
                    <path opacity="0.8" d="M19 7C19.5523 7 20 7.44772 20 8C20 8.55228 19.5523 9 19 9V7ZM0.292892 8.70711C-0.0976315 8.31658 -0.0976315 7.68342 0.292892 7.29289L6.65685 0.928932C7.04738 0.538408 7.68054 0.538408 8.07107 0.928932C8.46159 1.31946 8.46159 1.95262 8.07107 2.34315L2.41421 8L8.07107 13.6569C8.46159 14.0474 8.46159 14.6805 8.07107 15.0711C7.68054 15.4616 7.04738 15.4616 6.65685 15.0711L0.292892 8.70711ZM19 9H1V7H19V9Z" fill="#5FA2F1" />
                    : null
            }
        </svg>
    )
    const rightSVG = (
        <svg id={"tail".concat(props.id)} x={linePathDragging ? linePathDragging.x - 8 : tail.x}
            y={linePathDragging ? linePathDragging.y : tail.y - 27} width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            {
                !linePathDragging ?
                    <path opacity="0.8" d="M1 7C0.447715 7 0 7.44772 0 8C0 8.55228 0.447715 9 1 9V7ZM19.7071 8.70711C20.0976 8.31658 20.0976 7.68342 19.7071 7.29289L13.3431 0.928932C12.9526 0.538408 12.3195 0.538408 11.9289 0.928932C11.5384 1.31946 11.5384 1.95262 11.9289 2.34315L17.5858 8L11.9289 13.6569C11.5384 14.0474 11.5384 14.6805 11.9289 15.0711C12.3195 15.4616 12.9526 15.4616 13.3431 15.0711L19.7071 8.70711ZM1 9H19V7H1V9Z" fill="#32AAFF" />
                    : null
            }
        </svg>
    )
    const topSVG = (
        <svg id={"tail".concat(props.id)} x={linePathDragging ? linePathDragging.x - 8 : tail.x}
            y={linePathDragging ? linePathDragging.y : tail.y - 27} width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            {
                !linePathDragging ?
                    <path opacity="0.8" d="M9 19C9 19.5523 8.55228 20 8 20C7.44772 20 7 19.5523 7 19H9ZM7.29289 0.292892C7.68342 -0.0976315 8.31658 -0.0976315 8.70711 0.292892L15.0711 6.65685C15.4616 7.04738 15.4616 7.68054 15.0711 8.07107C14.6805 8.46159 14.0474 8.46159 13.6569 8.07107L8 2.41421L2.34315 8.07107C1.95262 8.46159 1.31946 8.46159 0.928932 8.07107C0.538408 7.68054 0.538408 7.04738 0.928932 6.65685L7.29289 0.292892ZM7 19V1H9V19H7Z" fill="#5FA2F1" />
                    : null}
        </svg>
    )
    const displayTail = () => {
        switch (tail.position) {
            case "left":
                return leftSVG
            case "right":
                return rightSVG
            case "top":
                return topSVG
            default:
                return bottomSVG
        }
    }
    var topCircle = {
        x: linePathDragging ? linePathDragging.x - 8 : tail.x - 13,
        y: linePathDragging ? linePathDragging.y - 20 : tail.y - 40
    }
    var oneCross = {
        x: linePathDragging ? linePathDragging.x - 8 : tail.x - 7,
        y: linePathDragging ? linePathDragging.y - 20 : tail.y - 33
    }
    switch (tail.position) {
        case "right":
            topCircle = { x: topCircle.x - 10, y: topCircle.y + 10 }
            oneCross = { x: oneCross.x - 10, y: oneCross.y + 10 }
            break;
        case "left":
            topCircle = { x: topCircle.x + 5, y: topCircle.y + 10 }
            oneCross = { x: oneCross.x + 5, y: oneCross.y + 10 }
            break;
        case "top":
            topCircle = { x: topCircle.x + 8, y: topCircle.y + 33 }
            oneCross = { x: oneCross.x + 8, y: oneCross.y + 33 }
            break;
        default: break;
    }
    return (

        <svg style={{ zIndex: -1, position: "absolute", overflow: "visible" }}>
            {displayTail()}


            {
                props.showArrowButtons && !linePathDragging ?
                    <>
                        <svg
                            cursor="pointer" onClick={() => store.reparentCard(id, 'root')}
                            style={{ zIndex: -1, position: "absolute", overflow: "visible" }}
                        >
                            <svg
                                id={"tail".concat(props.id)}

                                x={topCircle.x}
                                y={topCircle.y}

                                width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="11.25" fill="#FCFBF9" stroke="#FC611E" stroke-width="1.5" />
                            </svg>
                            <svg
                                x={oneCross.x}
                                y={oneCross.y}
                                width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.5 1.5L1.5 10.5" stroke="#FC611E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <svg
                                x={oneCross.x}
                                y={oneCross.y}
                                width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.5 1.5L10.5 10.5" stroke="#FC611E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </svg>
                    </>
                    : null
            }
        </svg>

    )
}
export default observer(TailArrow);