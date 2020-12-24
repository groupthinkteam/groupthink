import React, { useEffect, useRef, useState } from "react"
import ShareLink from "./ShareLink"
import "../../styles/MenuBar.scss"
import { Link } from "react-router-dom"
import RoomConnect from "../Voice/RoomConnect"
import SearchBar from "../Search/SearchBar"
import PersonaList from "../PersonaList/PersonaList"
import UserMenu from "../UserMenu/UserMenu"
import { useStore } from "../../store/hook"
import { useHistory, useLocation } from 'react-router-dom'
import { observer } from "mobx-react-lite"
import ActionsMenu from "../Actions/ActionsMenu"
import Feedback from "../Feedback/Feedback"
import '../../styles/ShareLink.scss'
import ReactTooltip from 'react-tooltip'
import MenuCard from "../DocumentCanvas/Cards/types/MenuCard"
function MenuBar(props) {
    const store = useStore()
    let [isEditingTitle, setEditingTitle] = useState(false);
    const buttonRef = useRef(null);
    const tooltipRef = useRef(null);
    const [tooltip, setTooltip] = useState(false)
    const [showMenu, setShowMenu] = useState(false);
    const history = useHistory();
    const location = useLocation();
    const signOut = () => {
        console.log("SIGNOUT ")
        store.signout();
        history.push('/login', { from: location });
    }

    useEffect(() => {
        if (showMenu && tooltip === buttonRef.current ) {
            setTooltip(false)
        }
        function handleClickOutside(event) {
            if (buttonRef.current && !buttonRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [buttonRef,showMenu,tooltip]);
    
    console.log("TOOLTIP ", tooltipRef?.current)
    return (
        <div className="menu-bar topheader" style={{ backgroundImage: `url(${require("../../assets/menu-clouds.svg")})` }}>
            <div className="menu-bar-panel menu-bar-panel-left">
                <div className="site-title"
                    ref={tooltipRef}
                    onMouseEnter={() => setTooltip(tooltipRef.current)}
                    onMouseLeave={() => setTooltip(false)}
                >
                    <Link to="/dashboard">
                        <img className="logo" src={require("../../assets/menu/ealogo.svg")} alt="logo" />
                    </Link>
                </div>
                {console.log(tooltip)}
                
                <ReactTooltip effect="solid"  place="bottom" />
                <div className="menu-bar-separator" />
                <Feedback />
                <div className="menu-bar-separator" />
                <ActionsMenu />
                <SearchBar document />
            </div>
            <div className="menu-bar-panel menu-bar-panel-center">
                {isEditingTitle ?
                    <input data-tip="Change Project Name" className="project-title edit"
                        type="text"
                        autoFocus
                        value={store.projectMetadata.name}
                        onChange={(e) => store.localRenameProject(e.target.value)}
                        onBlur={(e) => {
                            store.renameProject(store.projectID, e.target.value);
                            setEditingTitle(false);
                        }} />
                    : <span data-tip="Change Project Name" className="project-title display" onClick={() => setEditingTitle(true)}>
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
                <div className="menu-bar-user-profile-picture"
                    onMouseEnter={() => {setTooltip(buttonRef.current);console.log("Mouse Entered")}}
                    onMouseLeave={() => setTooltip(false)}
                    ref={buttonRef}
                >
                    <img id="main" alt={store.currentUser.displayName.concat("MAIN")}
                        src={store.currentUser.photoURL}
                        onClick={(e) => { setShowMenu(!showMenu); setTooltip(false) }}
                    />

                    {showMenu ?
                        <span className="user-menu" >
                            <img alt={store.currentUser.displayName} className="menu-thumbnail" src={store.currentUser.photoURL} />
                            <UserMenu signOut={signOut} />
                        </span> : null}
                </div>

            </div>
            {
                    
                    // tooltip ?
                    //     <MenuCard
                    //         buttonref={tooltip}
                    //         position="right-start"
                    //         offset={[40, tooltip === tooltipRef.current ? -50 : -30]}
                    //         tooltipclass="tooltips"
                    //         arrowclass="arrow"
                    //         showpopper={true}//{store.currentActive === props.id}
                    //         pos={{ x: 0, y: 0 }}
                    //         zIndex={1}
                    //     >
                    //         {tooltip === tooltipRef.current ? "Go To Dashboard" : "Your Profile"}
                    //     </MenuCard>
                    //     : null
                }
        </div>
    );
}

export default observer(MenuBar);