import React from "react"
import Button from "../Button/Button"
//import ShareLink from "./ShareLink"
import "../../styles/MenuBar.scss"
import { Link } from "react-router-dom"
import RoomConnect from "../Voice/RoomConnect"
import SearchBar from "./SearchBar"

export default function MenuBar(props) {
    const currentUser = props.currentUser

    return (
        <div className="menu-bar topheader">
            <div className="menu-bar-panel menu-bar-panel-left">
                <div className="site-title">
                    <Link to="/dashboard">
                        groupthink
                    </Link>
                </div>
            </div>
            <div className="menu-bar-panel menu-bar-panel-center">
                {props.documentName ?
                    <div className="menu-bar-project-title">
                        {("" + props.documentName).length > 40 ? ("" + props.documentName).substring(0, 37).concat("...") : props.documentName}
                    </div>
                    : null
                }
                <div className="menu-center-vertical-filler" >
                    <SearchBar/>
                </div>
            </div>
            <div className="menu-bar-panel menu-bar-panel-right">

                {
                    props.document ?
                        <>
                            <RoomConnect currentUser={currentUser} />
                            {/* <ShareLink projectID={props.projectID} buttonClassName="menu-action-button highlight"
                                currentUser={currentUser} isOwner={props.isOwner}
                            /> */}
                        </>
                        : null
                }
                <Button className="menu-action-button" handleClick={props.signOut}>
                    Log Out
                </Button>
                <img alt="" className="menu-bar-user-profile-picture" src={currentUser.photoURL} />
                {/* <div className="menu-bar-user-name">
                </div> */}
            </div>
        </div>
    );
}