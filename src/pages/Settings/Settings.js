import React, { useRef, useState } from 'react';
import UserMenu from "../../components/UserMenu/UserMenu"
import { useHistory, useLocation } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../store/hook'

import { ReactComponent as LogoSVG } from '../../assets/dashboard/logo.svg';
import { ReactComponent as EarlyAccessSVG } from '../../assets/menu/ealogo.svg';

import "../../styles/Settings.scss"

function Settings() {
    let store = useStore();
    const [profilePic, setProfilePic] = useState(store.currentUser.photoURL);
    const buttonRef = useRef(null);
    const history = useHistory();
    const location = useLocation();
    let inputFile = useRef(null);

    let [uploadState, setUploadState] = useState(false)
    const [showMenu, setShowMenu] = useState(false);

    const signOut = () => {
        store.signout();
        history.push('/login', { from: location });
    }

    const gotoDashboard = () => {
        history.push('/dashboard', { from: location });
    }

    function upload(files) {
        let file = files[0];
        if (!file) return;

        let typemeta = {
            contentType: file.type,
        };
        store.requestUpload(file.name, file, typemeta,
            (status) => {
                if (typeof status === "number") {
                    setUploadState(status);
                } else {
                    store.updateProfilePicture(laprofilePicProfilePicURL => {
                        setProfilePic(laprofilePicProfilePicURL)
                    });
                }
            }, "pfp");
    }

    if (uploadState === 100) {
        setUploadState(false)
    }

    return (
        <div className="settings-page">
            <div className="top-bar">
                <div className="site-title">
                    <LogoSVG onClick={() => gotoDashboard()} />
                </div>
                <div className="user-welcome">
                    <div className="welcome-text">
                        <span className="welcome-bold">Welcome,</span>
                        <span className="user-name">{store.currentUser.displayName}</span>
                    </div>
                    <div className="profile-picture">
                        <img alt='No Pic' src={profilePic} onClick={() => setShowMenu(!showMenu)} ref={buttonRef} />
                        {showMenu ?
                            <span className="user-menu">
                                <UserMenu signOut={signOut} />
                            </span> : null}
                    </div>
                </div>
            </div>
            <div className="main-section">
                <div className="profile-picture">
                    {uploadState ?
                        <div className="pfp-loader">
                            <div className="loader-text">
                                Uploading
                            </div>
                        </div>
                        :
                        <div className="picture-wrapper">
                            <img src={profilePic} alt={store.currentUser.displayName} />
                            <div className="upload-button" onClick={() => inputFile.current.click()}>
                                Change
                            </div>
                        </div>}

                </div>
                <input type="file"
                    onChange={(e) => upload(e.target.files)}
                    ref={inputFile}
                    style={{ display: 'none' }} />
                <div className="name-heading">
                    <span className="name">{store.currentUser.displayName}</span>
                </div>
                <div className="profile-section">
                    <div className="profile-sub-section">

                        <div className="heading">
                            Profile
                            </div>
                        <hr />
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


                    <div className="profile-sub-section">
                        <div className="heading">
                            Account
                        </div>
                        <hr />
                        <div className="subcontent">
                            <div className="field">
                                <div className="field-name">
                                    Plan
                                </div>
                                <div className="field-content">
                                    <EarlyAccessSVG className="field-content"/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="profile-sub-section">
                        <div className="heading">
                            Display Settings
                            </div>
                        <hr />
                        <div className="subcontent">
                            <div className="field">
                                <div className="field-name">
                                    Theme
                                </div>
                                <div className="field-content">
                                    Default (more coming soon!)
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