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
import { SketchPicker, GithubPicker } from 'react-color'
function MenuBar(props) {
    const store = useStore()
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
            <div className="menu-bar-panel menu-bar-panel-center" data-delay-show='750' data-effect="solid" data-tip={store.cardGrouped.length > 0 ? "Change Card Color" : "Change Project Name"}>
                {
                    store.currentActive && store.cards[store.currentActive]?.type === 'text' ?
                        <div className={"toolbar"} id={"toolbar" + props.id}>
                            <button className="toolbar-button" onClick={() => store.formatText('bold')}>bold</button>
                            <button className="toolbar-button" onClick={() => store.formatText('italic')}>Italic</button>
                            <button className="toolbar-button" onClick={() => store.formatText('head')}>head1</button>
                            <button className="toolbar-button" onClick={() => store.formatText('underline')}>underline</button>
                        </div>
                        : null
                }
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
                            <button onClick={() => setDisplayColorPicker(!displayColorPicker)}>
                                Pick Color
                            <div className="colorPreview" style={{ background: store.cards[store.currentActive]?.color || "#32aaff" }} />
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