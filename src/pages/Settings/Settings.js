import React, { useEffect, useRef, useState } from "react";
import "../../styles/Settings.scss"
import UserMenu from "../../components/UserMenu/UserMenu"
import { useHistory, useLocation } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../store/hook'

function Settings() {
    let store = useStore();
    const [showMenu, setShowMenu] = useState(false);
    const buttonRef = useRef(null);
    const history = useHistory();
    const location = useLocation();
    const signOut = () => {
        console.log("SIGNOUT ")
        store.signout();
        history.push('/login', { from: location });
      }
    return (
        <div className="settings-page">
            <div className="top-bar">
                <div className="site-title">
                    <img src={require("../../assets/dashboard/logo.svg")} alt="logo" />
                </div>
                <div className="user-welcome">
                    <div className="welcome-text">
                        <span className="welcome-bold">Welcome,</span>
                        <span className="user-name">{store.currentUser.displayName}</span>
                    </div>
                    <div className="profile-picture">
                        <img alt={store.currentUser.displayName} src={store.currentUser.photoURL} onClick={() => setShowMenu(!showMenu)} ref={buttonRef} />
                        {showMenu ?
                            <span className="user-menu">
                                <UserMenu signOut={signOut}/>
                            </span> : null}
                    </div>
                </div>
            </div>
            <div className="main-section">
                <div className="profile-picture">
                    <img alt={store.currentUser.displayName} src={store.currentUser.photoURL} />
                </div>
                <div className="name-heading">
                    <span className="name">{store.currentUser.displayName}</span>
                </div>
                <br />
                <div className="profile-section">
                    <div className="profile-sub-section">
                        <div className="content">
                            <div className="heading">
                                Profile
                            </div>
                            <hr />
                            <br />
                            <div className="subcontent">
                                <div className="field">
                                    <div className="field-name">
                                        Name
                                </div>
                                    <div className="field-content">
                                        <span className="name">{store.currentUser.displayName}</span>
                                    </div>
                                </div>
                                <div className="field">
                                    <div className="field-name">
                                        Email
                                </div>
                                    <div className="field-content">
                                        <span className="name">{store.currentUser.email}</span>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <br />
                    <br />
                    <div className="profile-sub-section">
                        <div className="content">
                            <div className="heading">
                                Account
                            </div>
                            <hr />
                            <br />
                            <div className="subcontent">
                                <div className="field">
                                    <div className="field-name">
                                        Plan
                                </div>
                                    <div className="field-content">
                                        Early Access
                                    </div>
                                </div>
                        
                            </div>
                        </div>
                    </div>
                    <br />
                    <br />
                    <div className="profile-sub-section">
                        <div className="content">
                            <div className="heading">
                                Display Settings
                            </div>
                            <hr />
                            <br />
                            <div className="subcontent">
                                <div className="field">
                                    <div className="field-name">
                                        Theme
                                </div>
                                    <div className="field-content">
                                        Default
                                    </div>
                                </div>
                        
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default observer(Settings);