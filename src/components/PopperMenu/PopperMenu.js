import React, { useState, useRef } from "react";
import { usePopper } from "react-popper";
import '../../styles/PopperMenu.scss';

const PopperMenu = (props) => {
    const popperRef = useRef(null);
    const [arrowRef, setArrowRef] = useState(null);
    const { styles, attributes } = usePopper(
        props.buttonref.current,
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

    return (
        <>

            {props.showpopper ?
                <div
                    ref={popperRef}
                    className={props.tooltipclass}
                    style={styles.popper}
                    {...attributes.popper}
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