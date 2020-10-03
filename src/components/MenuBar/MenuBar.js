import React from "react"
import Button from "../Button/Button"
import ShareLink from "./ShareLink"
import "../../styles/MenuBar.scss"
import { Link } from "react-router-dom"
export default function MenuBar(props) {
    const currentUser = props.currentUser()
    return (
        <div className="menu-bar topheader">
            <div className="menu-bar-panel menu-bar-panel-left">
                <img alt="" className="menu-bar-user-profile-picture" src={currentUser.photoURL} />
                <div className="menu-bar-user-name">
                    {currentUser.displayName}
                </div>
            </div>
            <div className="menu-bar-panel menu-bar-panel-center">
                <div className="menu-bar-site-title">
                    <Link to="/dashboard">
                        groupthink
                    </Link>
                </div>
            </div>
            <div className="menu-bar-panel menu-bar-panel-right">
                <Button className="menu-action-button" handleClick={props.onLogOut}>
                    Log Out
                </Button>
                {
                    props.document && props.document === "rw" ?
                        <ShareLink projectID={props.projectID} buttonClassName="menu-action-button" currentUser={currentUser} />
                        : null
                }
            </div>
        </div>
    );
}