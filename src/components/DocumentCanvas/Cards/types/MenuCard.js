import React, { useState, useRef } from "react";
import { usePopper } from "react-popper";
import '../../../../styles/UserMenu.scss';

const MenuCard = (props) => {
    const [showPopper, setShowPopper] = useState(false);
    const popperRef = useRef(null);
    const [arrowRef, setArrowRef] = useState(null);
    const { styles, attributes } = usePopper(
        props.reference.current,
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
                        offset: [0, 4]
                    }
                },
                {
                    name: "flip",
                    enabled: false,
                    options: {
                        rootBoundary: "viewport",
                        fallbackPlacements: ['right-start'],
                    }
                },
            ],
            placement: "right-start"
        }
    );
    return (
        <>
            <div  style={{ position: "absolute", padding: '10px', right: '20px' }} onClick={() => setShowPopper(!showPopper)}>
                <div className="barmenu"></div>
                <div className="barmenu"></div>
                <div className="barmenu"></div>
            </div>
            {showPopper ?
                <div
                    ref={popperRef}
                    className="tooltips"
                    style={styles.popper}
                    {...attributes.popper}
                >
                    <div ref={setArrowRef} style={styles.arrow} id="arrow" className="arrow" />
                    {props.children}
                </div>
                : null
            }
        </>
    )
}
export default React.memo(MenuCard);