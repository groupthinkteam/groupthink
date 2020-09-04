import React from "react"

import "./MenuBar.scss"

function MenuBar(props) {
    return (
        <div className="menu-bar">
            {/* <div className="menu-bar-panel menu-bar-panel-left">
                <img className="menu-bar-user-profile-picture" src={firebase.auth().currentUser.photoURL} />
                {firebase.auth().currentUser.displayName} */}
            {/* </div> */}
            <div className="menu-bar-panel menu-bar-panel-center">
                <div className="menu-bar-site-title">
                    groupthink
                </div>
            </div>
            <div className="menu-bar-panel menu-bar-panel-right">
                {/* <Button className="logout-button" onClick={() => props.dispatch({ type: "LOGOUT" })} >
                    log out <LogoutOutlined />
                </Button> */}
            </div>
        </div>
    );
}

export default MenuBar;