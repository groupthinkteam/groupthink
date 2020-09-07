import React from "react"
import Button from "../Button/Button"

import "../../styles/MenuBar.scss"

export default function MenuBar(props) {
    const currentUser = props.currentUser()
    return (
        <div className="menu-bar">
            <div className="menu-bar-panel menu-bar-panel-left">
                <img alt="user avatar" className="menu-bar-user-profile-picture" src={currentUser.photoURL} />
                {currentUser.displayName}
            </div>
            <div className="menu-bar-panel menu-bar-panel-center">
                <div className="menu-bar-site-title">
                    groupthink
                </div>
            </div>
            <div className="menu-bar-panel menu-bar-panel-right">
                <Button className="logout-button" handleClick={props.onLogOut}>
                    log out
                </Button>
            </div>
        </div>
    );
}