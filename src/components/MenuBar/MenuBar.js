import React, { useState } from "react"
import ShareLink from "./ShareLink"
import "../../styles/MenuBar.scss"
import { Link } from "react-router-dom"
import RoomConnect from "../Voice/RoomConnect"
import SearchBar from "../Search/SearchBar"
import PersonaList from "../PersonaList/PersonaList"
import UserMenu from "./UserMenu"
import { useStore } from "../../store/hook"
import { observer } from "mobx-react-lite"
import ActionsMenu from "../Actions/ActionsMenu"
import Feedback from "../Feedback/Feedback"
import '../../styles/ShareLink.scss'

function MenuBar(props) {
    let store = useStore()
    let [isEditingTitle, setEditingTitle] = useState(false);

    return (
        <div className="menu-bar topheader" style={{ backgroundImage: `url(${require("../../assets/menu-clouds.svg")})` }}>
            <div className="menu-bar-panel menu-bar-panel-left">
                <div className="site-title">
                    <Link to="/dashboard">
                        <img className="logo" src={require("../../assets/menu/ealogo.svg")} alt="logo" />
                    </Link>
                </div>
                <div className="menu-bar-separator" />
                <Feedback />
                <div className="menu-bar-separator" />
                <ActionsMenu />
                <SearchBar document />
            </div>
            <div className="menu-bar-panel menu-bar-panel-center">
                {isEditingTitle ?
                    <input className="project-title edit"
                        type="text"
                        autoFocus
                        value={store.projectMetadata.name}
                        onChange={(e) => store.localRenameProject(e.target.value)}
                        onBlur={(e) => {
                            store.renameProject(store.projectID, e.target.value);
                            setEditingTitle(false);
                        }} />
                    : <span className="project-title display" onClick={() => setEditingTitle(true)}>
                        {store.projectMetadata.name}
                    </span>
                }
            </div>
            
            <div className="menu-bar-panel menu-bar-panel-right">
                <RoomConnect projectID={store.projectID} currentUser={store.currentUser} />
                <PersonaList />
                <div className="menu-bar-separator" />
                <ShareLink
                    projectID={store.projectID}
                    buttonClassName="menu-action-button highlight"
                    currentUser={store.currentUser}
                />
                <div className="menu-bar-separator" />
                <UserMenu
                    photoURL={store.currentUser.photoURL}
                    username={store.currentUser.displayName}
                    imageClass="menu-bar-user-profile-picture"
                    logOutClass="menu-action-button"
                    signOut={props.signOut}
                />
            </div>
        </div>
    );
}

export default observer(MenuBar);