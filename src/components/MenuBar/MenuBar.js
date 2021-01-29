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
import { SketchPicker, GithubPicker } from 'react-color';
import DisplayCardMenu from "./DisplayCardMenu"
function MenuBar(props) {
    const store = useStore();
    const me = store.currentActive && store.cards[store.currentActive];
    let [isEditingTitle, setEditingTitle] = useState(false);
    const buttonRef = useRef(null);
    const [showMenu, setShowMenu] = useState(false);
    const [displayColorPicker, setDisplayColorPicker] = useState(false);
    const history = useHistory();
    const location = useLocation();
    const signOut = () => {
        console.log("SIGNOUT ")
        store.signout();
        history.push('/login', { from: location });
    }
    useEffect(() => {
        function handleClickOutside(event) {
            if (buttonRef.current && !buttonRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [buttonRef]);
    return (
        <div className="menu-bar topheader" style={{ backgroundImage: `url(${require("../../assets/menu-clouds.svg")})` }}>
            <div className="menu-bar-panel menu-bar-panel-left">
                <div data-delay-show='750' data-offset="{'top': 6, 'left': -10}" data-place="bottom" data-effect="solid" data-tip="Go back" className="site-title">
                    <Link to="/dashboard">
                        <img className="logo" src={require("../../assets/menu/ealogo.svg")} alt="logo" />
                    </Link>
                </div>
                <ReactTooltip globalEventOff="click" eventOff="click" delayShow={200} delayUpdate={200} place="bottom" />
                <div className="menu-bar-separator" />
                <Feedback />
                <div className="menu-bar-separator" />
                <ActionsMenu />
                <SearchBar document />
            </div>
            <div className="menu-bar-panel menu-bar-panel-center" data-delay-show='750' data-effect="solid" data-tip={store.cardGrouped.length ? null : "Change Project Name"}>
                <DisplayCardMenu store={store} me={me} />
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
                    :
                    store.cardGrouped.length > 0 ?
                        <div>
                            <button className="colorPreview" onClick={() => setDisplayColorPicker(!displayColorPicker)}>
                                {/* <div className="colorPreview" style={{ display: "inline-block", height: '25px', width: '25px', border: 'white', background: store.cards[store.currentActive]?.color || "#32aaff" }} /> */}
                                <div>
                                    <svg width="56" height="41" viewBox="0 0 56 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0 3.51221C0 1.85535 1.34315 0.512207 3 0.512207H53C54.6569 0.512207 56 1.85535 56 3.51221V37.5122C56 39.1691 54.6569 40.5122 53 40.5122H3C1.34314 40.5122 0 39.1691 0 37.5122V3.51221Z" fill="#F6F6F6" />
                                        <g clip-path="url(#clip0)">
                                            <rect x="8" y="10.5122" width="20" height="20" rx="3" fill="#FCFBF9" />
                                            <line x1="8" y1="30.8051" x2="28.2929" y2="10.5122" stroke="#FC611E" stroke-linecap="round" />
                                        </g>
                                        <rect fill={store.cards[store.currentActive]?.color || "#32aaff"} x="8.5" y="11.0122" width="19" height="19" rx="2.5" stroke="#413D45" />
                                        <path d="M36 18.5122L40 22.5122L44 18.5122" stroke="#413D45" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        <defs>
                                            <clipPath id="clip0">
                                            </clipPath>
                                        </defs>
                                    </svg>

                                </div>
                            </button>
                            {
                                displayColorPicker ?
                                    <div className="colorPicker-popover" >
                                        <div className="colorPicker-cover" onClick={() => setDisplayColorPicker(false)} />
                                        <SketchPicker
                                            // <GithubPicker
                                            color={store.cards[store.currentActive]?.color || "#32aaff"}//{colorPick.hex}
                                            onChange={(color) => { store.saveCardColors(color.hex); }}
                                            onSwatchHover={(color, _) => {
                                                store.addColorsToCards(color.hex);
                                            }}
                                        />
                                    </div>
                                    : null
                            }
                        </div>
                        :
                        <span data-effect="solid" data-tip="Change Project Name" className="project-title display" onClick={() => setEditingTitle(true)}>
                            {store.projectMetadata.name}
                        </span>
                }

            </div>

            <div className="menu-bar-panel menu-bar-panel-right">
                <RoomConnect projectID={store.projectID} currentUser={store.currentUser} />
                <PersonaList />
                <div className="menu-bar-separator" />
                {
                    !store.users[store.userID].welcome || store.projectMetadata.name !== "Welcome! Start Here..." ?
                        <>
                            <ShareLink
                                projectID={store.projectID}
                                buttonClassName="menu-action-button highlight"
                                currentUser={store.currentUser}
                            />
                            <div className="menu-bar-separator" />
                        </>
                        : null
                }


                <div className="menu-bar-user-profile-picture">
                    <img data-place="bottom" data-multiline={true} data-delay-show='750' data-effect="solid" data-tip="Your <br/> Profile" alt={store.currentUser.displayName} src={store.currentUser.photoURL} onClick={(e) => { setShowMenu(!showMenu); e.stopPropagation(); }} ref={buttonRef} />

                    {showMenu ?
                        <span className="user-menu" ref={buttonRef}>
                            <img alt={store.currentUser.displayName} className="menu-thumbnail" src={store.currentUser.photoURL} />
                            <UserMenu
                                signOut={signOut} />
                        </span> : null}
                </div>

            </div>
        </div>
    );
}

export default observer(MenuBar);