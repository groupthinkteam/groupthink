import React, { useState, useRef, useEffect } from "react";
import PopperMenu from '../PopperMenu/PopperMenu'
import '../../styles/UserMenu.scss'

const UserMenu = (props) => {

    const [showPopper, setShowPopper] = useState(false);
    const buttonRef = useRef(null);
    const contentRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
            if (buttonRef.current && contentRef.current && !buttonRef.current.contains(event.target) && !contentRef.current.contains(event.target)) {
                setShowPopper(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [buttonRef]);
    return (
        <>
            <img alt="" onClick={() => setShowPopper(!showPopper)} className={props.imageClass} src={props.photoURL} ref={buttonRef} />
            <PopperMenu
                buttonref={buttonRef}
                position="bottom"
                offset={[0, 12]}
                tooltipclass="tooltipsuser"
                arrowclass="arrowuser"
                showpopper={showPopper}
            >

                <div ref={contentRef}>
                    <div className="photo">
                        <img alt="" src={props.photoURL} className="profimage"></img>
                    </div>
                    <div className="info">
                        <h4>{props.username}</h4>
                    </div>
                    <div className="info">
                        <p className="colororange">Early Access</p>
                    </div>
                    <hr className="separator" />
                    <div className="options">
                        {/* <a href="true" target="blank" style={{ color: "black" }}>Profile</a> */}
                        <a href="/dashboard" className="colorblack">Dashboard</a>
                        <br />
                        {/* <a href="true" target="blank" style={{ color: "black" }}>Settings</a> */}
                        {/* <a href="true" target="blank" style={{ color: "black" }}>Help About</a> */}
                        <a href="true" onClick={props.signOut} className="colororange">Logout</a>
                    </div>
                </div>
            </PopperMenu>
        </>
    );
};

export default UserMenu;