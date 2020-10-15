import React from "react"
import Button from "../Button/Button"
import ShareLink from "./ShareLink"
import "../../styles/MenuBar.scss"
import { Link } from "react-router-dom"
import SearchBar from "./SearchBar"
import ProfileAttachedToDoc from "./ProfileAttachedToDoc"
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
                
                <ProfileAttachedToDoc 
                    document={props.document} currentUser={currentUser} isOwner={props.isOwner}
                />
                
                <Button className="menu-action-button" handleClick={props.onLogOut}>
                    Log Out
                </Button>
                
                <ShareLink projectID={props.projectID} buttonClassName="menu-action-button highlight" 
                    currentUser={currentUser} isOwner={props.isOwner} document={props.document}
                />
                
                <SearchBar projectID={props.projectID} buttonClassName="menu-action-button highlight" 
                    currentUser={currentUser} isOwner={props.isOwner} dashboard={props.dashboard} 
                    document={props.document}
                />
            </div>
        </div>
    );
}