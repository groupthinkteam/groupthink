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


        <div>
            <img alt="" onClick={() => setShowPopper(!showPopper)} className={props.imageClass} src={props.photoURL} ref={buttonRef} />


            <PopperMenu
                buttonref={buttonRef}
                position="bottom"
                offset={[0, 12]}
                tooltipclass="tooltipsuser"
                arrowclass="arrowuser"
                showpopper={showPopper}
            >

                <div>
                    <img alt="" src={props.photoURL} className="profimage"></img>
                    <h4>{props.username}</h4>
                    <p className="colororange">Early Access</p>
                    <hr />
                    {/* <a href="true" target="blank" style={{ color: "black" }}>Profile</a> */}
                    <a href="/dashboard" className="colorblack">Dashboard</a>
                    <br />
                    {/* <a href="true" target="blank" style={{ color: "black" }}>Settings</a> */}
                    {/* <a href="true" target="blank" style={{ color: "black" }}>Help About</a> */}

                    <a href="true" onClick={props.signOut} className="colororange">Logout</a>
                </div>
            </PopperMenu>



        </div>
    );
};

export default UserMenu;