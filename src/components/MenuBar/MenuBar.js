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
                {currentUser.displayName}
            </div>
            <div className="menu-bar-panel menu-bar-panel-center">
                <div className="menu-bar-site-title">
                    groupthink
                </div>
            </div>
            <div >
            <Link to='/dashboard' >Back</Link>
            </div>
            <div className="menu-bar-panel menu-bar-panel-right">
                <Button className="logout-button custom_btn" handleClick={props.onLogOut}>
                    log out
                </Button>
            </div>
            {
                props.document != undefined && props.document === "rw"?
                <ShareLink projectID ={props.projectID} className="custom_btn" currentUser={currentUser}/>
                :<div/>
            }
        </div>
    );
}