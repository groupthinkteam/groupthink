import React, { useState, useRef } from "react";
import { usePopper } from "react-popper";
import '../../styles/PopperMenu.scss';

const PopperMenu = (props) => {
    const popperRef = useRef(null);
    const [arrowRef, setArrowRef] = useState(null);
    let [pos, setPos] = useState({ x: 0, y: 0 });

    const { styles, attributes, forceUpdate } = usePopper(
        props.buttonref,
        popperRef.current,
        {
            modifiers: [
                {
                    name: "arrow",
                    options: {
                        element: arrowRef
                    }
                },
                {
                    name: "offset",
                    options: {
                        offset: props.offset
                    }
                },
            ],
            placement: props.position
        }
    );
    if (props.pos) {
        if (props.pos.x !== pos.x || props.pos.y !== pos.y) {
            if (typeof forceUpdate === "function") {
                forceUpdate()
                setPos(props.pos)
            }
        }
    }

    return (
        <>

            {props.showpopper ?
                <div
                    ref={popperRef}
                    className={props.tooltipclass}
                    style={styles.popper}
                    {...attributes.popper}
                    onBlur={() => props.onBlur()}
                >
                    <div ref={setArrowRef} style={styles.arrow} id="arrow" className={props.arrowclass} />
                    {props.children}
                </div>
                : null
            }
        </>
    )
}
export default React.memo(PopperMenu);