import React, { useState, useRef, useEffect } from 'react';
import { observer } from "mobx-react-lite";
import { useStore } from "../../store/hook";
import Button from '../Button/Button';
import '../../styles/UserMenu.scss'
import PopperMenu from '../PopperMenu/PopperMenu';
import CreatableSelect from 'react-select/creatable';
import { database } from '../../services/firebase'

const ShareLink = (props) => {
    const store = useStore();
    const [link, setLink] = useState(false)
    const [linkType, setLinkType] = useState();
    const [permission, setPermission] = useState();
    const [show, setShow] = useState(false);
    const [url, setURL] = useState();
    const buttonRef = useRef(null);
    const contentRef = useRef(null);
    //Stores the State for EMail-ID inputs.
    const [state, setState] = useState({
        inputValue: '',
        value: []
    });

    
    const handleClose = () => {
        setShow(false);
        setState({
            inputValue: '',
            value: []
        });
        setLink(false);
        setURL(null);
        setLinkType(null);
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

    const checkLinks = () => {
        var objKeys = {}
       if (store.checkKeys() == true) {
            objKeys = store.fetchKeys();
            var lastPerm = objKeys[Object.keys(objKeys)[Object.keys(objKeys).length - 1]]
            var lastKey = Object.keys(objKeys)[Object.keys(objKeys).length - 1]
            setURL([String(window.location.origin), "shared", store.projectID, lastKey, lastPerm].join("/"));
            setLink(true)
       }
    }

    const sendInvite = () => {
        if (state.value.length > 0) {
            Object.entries(state.value).forEach(([_, val]) => {
                const updates = {};
                updates["emailId"] = val.value;
                const newKey = store.addKeyToShare(permission || 'rw')
                updates["link"] = [String(window.location.origin), "shared", store.projectID, newKey, permission || 'rw'].join("/");
                store.sendInviteEmail(updates);
            })
        }
        else
            console.log("EMPTY STRING");
    }
    const ChangeRadio = (e) => {
        setPermission(e.target.value)
    }
    const LinkType = (e) => {
        setLinkType(e.target.value)
    }
    const components = {
        DropdownIndicator: null,
    };

    const createOption = (label) => ({
        label,
        value: label,
    });
    const openLink = () => {
        if (linkType !== undefined && permission !== undefined) {
            setLink(true)
            const newKey = store.addKeyToShare(permission)
            return setURL([String(window.location.origin), "shared", store.projectID, newKey, permission].join("/"));
        }
        else
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
                        value: [...value, createOption(inputValue)],
                    });
                }
                else alert(`Invalid Email Entered ${inputValue}`, setState(state))
                event.preventDefault();
                break;
            default: break;
        }
    }

    return (
        <>
            <Button ref={buttonRef} className={props.buttonClassName} handleClick={() => {setShow(!show); checkLinks();}}>Share</Button>
            <PopperMenu
                buttonref={buttonRef}
                position="bottom"
                offset={[0, 10]}
                tooltipclass="tooltips"
                arrowclass="arrowuser"
                showpopper={show}
            >
                <div ref={contentRef} style={{ width: '300px' }}>
                    Type Of Link To be Shared
                    <br />
                    <input type="radio" name="linkType" value="public" onChange={e => LinkType(e)} required={true} />
                    <label htmlFor="male">Public</label>
                    <input type="radio" name="linkType" value="private" onChange={e => LinkType(e)} required={true} />
                    <label htmlFor="male">Private </label>
                    <br />
                    <input type="radio" name="options" value="r" onChange={e => ChangeRadio(e)} required={true} />
                    <label htmlFor="male">Read Only</label>
                    <input type="radio" name="options" value="rw" onChange={e => ChangeRadio(e)} required={true} />
                    <label htmlFor="male">Read and Write </label>
                    <br />
                    <Button className="custom_btn" handleClick={openLink}>Get Shareable Link</Button>
                    {
                        link ?
                            <div style={{ flexDirection: 'row' }}>
                                <br />
                            Copy Your Link :
                            <br />
                                <b style={{ flexShrink: 1, flex: 1, flexWrap: 'wrap' }}>{url}</b>
                                <br />
                            </div>
                            : <div />
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
                        <Button className="custom_btn" handleClick={sendInvite}>Send Invite</Button>
                    </div>
                </div>
            </PopperMenu>
        </>
    )
};

export default observer(ShareLink);