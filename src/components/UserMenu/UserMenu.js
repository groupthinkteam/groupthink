import React, { useState, useRef } from "react";
import { usePopper } from "react-popper";
import '../../styles/UserMenu.scss'

const UserMenu = (props) => {

    const [showPopper, setShowPopper] = useState(false);
    const buttonRef = useRef(null);
    const popperRef = useRef(null);
    const [arrowRef, setArrowRef] = useState(null);

    const { styles, attributes } = usePopper(
        buttonRef.current,
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
                        offset: [0, 10]
                    }
                }
            ]
        }
    );
    return (


        <div>
            <img alt="" onClick={() => setShowPopper(!showPopper)} className={props.imageClass} src={props.photoURL} ref={buttonRef} />

            {showPopper
                ? (<div
                    ref={popperRef}
                    className="tooltips"
                    style={styles.popper}
                    {...attributes.popper}
                >
                    <div ref={setArrowRef} style={styles.arrow} id="arrow" className="arrow" />
                    <img alt="" src={props.photoURL} className="profimage"></img>
                    <h4>{props.username}</h4>
                    <p style={{ color: "orange" }}>groupthink <b>pro</b></p>
                    <hr />
                    <a href target="blank" style={{ color: "black" }}>Profile</a>
                    <br />
                    <a href="/dashboard" style={{ color: "black" }}>Dashboard</a>
                    <br />
                    <a href target="blank" style={{ color: "black" }}>Settings</a>
                    <hr />
                    <a href target="blank" style={{ color: "black" }}>Help About</a>
                    <hr />
                    <a href onClick={props.signOut} style={{ color: "orange" }}>Logout</a>


                </div>) : null}
        </div>
    );
};

export default UserMenu;