import React, { useState, useRef } from "react";
import PopperMenu from '../PopperMenu/PopperMenu'
import '../../styles/UserMenu.scss'

const UserMenu = (props) => {

    const [showPopper, setShowPopper] = useState(false);
    const buttonRef = useRef(null);

    return (


        <div>
            <img alt="" onClick={() => setShowPopper(!showPopper)} className={props.imageClass} src={props.photoURL} ref={buttonRef} />


            <PopperMenu 
                buttonref={buttonRef}
                position="bottom"
                offset={[0, 10]} 
                tooltipclass="tooltips"
                arrowclass="arrowuser"
                showpopper={showPopper}
            >
                <img alt="" src={props.photoURL} className="profimage"></img>
                <h4>{props.username}</h4>
                <p style={{ color: "orange" }}>groupthink <b>pro</b></p>
                <hr />
                <a href="true" target="blank" style={{ color: "black" }}>Profile</a>
                <br />
                <a href="/dashboard" style={{ color: "black" }}>Dashboard</a>
                <br />
                <a href="true" target="blank" style={{ color: "black" }}>Settings</a>
                <hr />
                <a href="true" target="blank" style={{ color: "black" }}>Help About</a>
                <hr />
                <a href="true" onClick={props.signOut} style={{ color: "orange" }}>Logout</a>
            </PopperMenu>



        </div>
    );
};

export default UserMenu;