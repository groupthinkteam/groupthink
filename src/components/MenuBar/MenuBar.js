import React from "react"
import ShareLink from "./ShareLink"
import "../../styles/MenuBar.scss"
import { Link } from "react-router-dom"
import RoomConnect from "../Voice/RoomConnect"
import SearchBar from "../Search/SearchBar"
import PersonaList from "../PersonaList/PersonaList"
import UserMenu from "./UserMenu"


export default function MenuBar(props) {
    const currentUser = props.currentUser

    return (
        <div className="menu-bar topheader">
            <div className="menu-bar-panel menu-bar-panel-left">
                <div className="site-title">
                    <Link to="/dashboard">
                        g
                    </Link>
                </div>
                <SearchBar document={props?.document} dashboard={props?.dashboard} />
            </div>
            <div className="menu-bar-panel menu-bar-panel-center">
                {props.documentName ?
                    <span className="menu-bar-project-title">
                        {props.documentName}
                    </span>
                    : null
                }
            </div>
            <div className="menu-bar-panel menu-bar-panel-right">
                {
                    props.document ?
                        <>
                            <RoomConnect projectID={props.projectID} currentUser={currentUser} />
                            <PersonaList />
                            <div className="menu-bar-separator" />
                            <ShareLink projectID={props.projectID} buttonClassName="menu-action-button highlight"
                                currentUser={currentUser}
                            />
                        </>
                        : null
                }
                <div className="menu-bar-separator" />
                <UserMenu photoURL={currentUser.photoURL}
                    username={currentUser.displayName}
                    imageClass="menu-bar-user-profile-picture"
                    logOutClass="menu-action-button"
                    signOut={props.signOut}
                />

            </div>
        </div>
    );
}