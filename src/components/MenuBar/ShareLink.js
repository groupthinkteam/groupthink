import React, { useState, useRef, useEffect } from 'react'
import { observer } from "mobx-react-lite"
import CreatableSelect from 'react-select/creatable'

import { useStore } from "../../store/hook"
import Button from '../Button/Button'
import PopupMenu from "../PopupMenu/PopupMenu"

import '../../styles/ShareLink.scss'

const ShareLink = (props) => {
    const store = useStore();
    const [link, setLink] = useState(false)
    const [permission, setPermission] = useState();
    const [url, setURL] = useState();
    const buttonRef = useRef(null);
    const contentRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    const togglePopup = () => {
        setIsOpen(!isOpen);
    }

    //Stores the State for EMail-ID inputs.
    const [state, setState] = useState({
        inputValue: '',
        value: []
    });


    const handleClose = () => {
        setState({
            inputValue: '',
            value: []
        });
        setLink(false);
        setURL(null);
        setPermission(null);
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (buttonRef.current && contentRef.current && !buttonRef.current.contains(event.target) && !contentRef.current.contains(event.target)) {
                handleClose();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [buttonRef]);

    const checkLinks = async () => {
        var objKeys = {}
        var check = await store.checkKeys()
        console.log(check)
        if (check === true) {
            objKeys = await store.fetchKeys();
            //console.log("Object Keys", objKeys)
            var lastPerm = objKeys[Object.keys(objKeys)[Object.keys(objKeys).length - 1]]
            var lastKey = Object.keys(objKeys)[Object.keys(objKeys).length - 1]
            //console.log("obj", lastPerm, lastKey)
            setURL([String(window.location.origin), "shared", store.projectID, lastKey, lastPerm].join("/"));
            setLink(true)
        }
    }

    const sendInvite = async () => {
        var check = await store.checkKeys()
        if (permission !== undefined) {
            if (state.value.length > 0) {
                const updates = {};
                if (check === true) {
                    updates["link"] = url;
                }
                else {
                    const newKey = store.addKeyToShare(permission)
                    updates["link"] = [String(window.location.origin), "shared", store.projectID, newKey, permission].join("/");
                }
                Object.entries(state.value).forEach(([_, val]) => {
                    updates["emailId"] = val.value;
                    store.sendInviteEmail(updates);
                })
            }
            else
                console.log("EMPTY STRING");
        }
        else {
            alert("Please Select Permissions for link sharing.")
        }
    }

    const copyLink = () => {
        const el = document.createElement('textarea');
        el.value = url;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    }

    const changeRadio = (e) => {
        console.log(e.target.value)
        setPermission(e.target.value)
    }

    const components = {
        DropdownIndicator: null,
    };

    const createOption = (label) => ({
        label,
        value: label,
    });

    const openLink = () => {
        if (permission) {
            setLink(true)
            const newKey = store.addKeyToShare(permission)
            return setURL([String(window.location.origin), "shared", store.projectID, newKey, permission].join("/"));
        }
        else
            alert("Please set permissions")
        return setLink(false)

    }
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    const handleChange = (value, actionMeta) => {
        setState({ inputValue: state.inputValue, value: value });
    };

    const handleInputChange = (inputValue) => {
        setState({ inputValue: inputValue, value: state.value });
    };

    const handleKeyDown = (event) => {
        const { inputValue, value } = state;
        if (!inputValue) return;
        switch (event.key) {
            case 'Enter':
            case 'Tab':
                if (validateEmail(inputValue)) {
                    setState({
                        inputValue: '',
                        value: value ? [...value, createOption(inputValue)] : [createOption(inputValue)],
                    });
                }
                else alert(`Invalid Email Entered ${inputValue}`, setState(state))
                event.preventDefault();
                break;
            default: break;
        }
    }

    return (
        <div className="sharelink">
            <Button ref={buttonRef} className={props.buttonClassName} handleClick={() => { checkLinks(); togglePopup(); }}>
                Share
            </Button>
            {isOpen &&
                <PopupMenu handleClose={togglePopup}>
                    <div ref={contentRef} className="container">
                        <div className="heading">
                            <span className="share">
                                Share
                            </span>
                            <span className="project-title">
                                {store.projectName}
                            </span>
                        </div>
                        <span className="edit-warning">
                            Everyone who has access to this project will be able to edit.
                        </span>
                        <div className="section">
                            <span className="title">
                                Invite via email
                            </span>
                        </div>
                        {
                            link ?
                                <div>
                                    <Button className="custom_btn" handleClick={() => { setLink(false); setPermission(undefined); store.removeKey(); }}>
                                        Turn off Link Sharing
                                    </Button>
                                    <Button className="custom_btn" handleClick={copyLink}>
                                        Copy Link
                                    </Button>
                                </div>
                                :
                                <div>
                                    <select name="permission" id="permission" onChange={e => changeRadio(e)}>
                                        <option value={''}>
                                            Set Permission:
                                            </option>
                                        <option value="r">
                                            Read Only
                                            </option>
                                        <option value="rw">
                                            Read and Write
                                            </option>
                                    </select>
                                    <Button className="custom_btn" handleClick={openLink}>
                                        Get Shareable Link
                                    </Button>
                                </div>
                        }
                        <div>
                            <CreatableSelect
                                components={components}
                                inputValue={state.inputValue}
                                isClearable
                                isMulti
                                menuIsOpen={false}
                                onChange={handleChange.bind(this)}
                                onInputChange={e => handleInputChange(e)}
                                onKeyDown={e => handleKeyDown(e)}
                                placeholder="Type Email and press enter..."
                                value={state.value}
                            />
                            <Button className="custom_btn" handleClick={sendInvite}>
                                Send Invite
                            </Button>
                        </div>
                    </div>
                </PopupMenu>}
        </div>
    )
};

export default observer(ShareLink);