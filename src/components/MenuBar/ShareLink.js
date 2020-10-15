import React, { useState , useEffect} from "react"
import Button from "../Button/Button"
import {DropdownButton, Modal, Dropdown } from "react-bootstrap"
import { firebaseDB, firebaseFunction, firebaseTIME } from "../../services/firebase"
import LinkSharing from "./LinkSharing"
import * as Crypto from 'crypto-js/aes';
import CreatableSelect from 'react-select/creatable';
import "../../styles/MenuBar.scss"

const ShareLink = (props) => {

    //Show Modal State
    const [show, setShow] = useState(false);

    //Show Generated Link State
    const [link, setLink] = useState(false);

    //Show Email State
    const [emailShow , setEmailShow] = useState(false);
    
    //Stores the State for EMail-ID inputs.
    const [state , setState] = useState({
        inputValue: '',
        value: []
    });

    //Type Link , Permission & URL State
    const [linkType, setLinkType] = useState();
    const [permission, setPermission] = useState();
    const [url, setURL] = useState();

    /**Users Information State inthe Room*/
    const [users, setUsers] = useState(null);
    
    useEffect(() => {
        firebaseDB.ref("documents/" + projectID + "/users/").on('value', snap => setUsers(snap.val()));
        return () => firebaseDB.ref("documents/" + projectID + "/users/").off('value')
    }, [])

    
    const title = "Groupthink Website";
    const projectID = props.projectID;

    /**
     * This Function Provides the path to the dezired operation.
     * @param {*} uid uid of the users 
     * @param {String} operation - 
     * The Following are Operation And It's corresponding Path.
     * "usersUnderDocument" : `documents/${projectID}/users/${uid}/`
     * "projectUnderUser" : `users/${uid}/projects/${projectID}/`
     * "cursorUnderDocument" : `documents/${projectID}/cursors/${uid}/`
     */
    const refPaths = (uid,operation) =>{
        switch(operation)
        {
            case "usersUnderDocument" :
                return `documents/${projectID}/users/${uid}/`;
            case "projectUnderUser" :
                return `users/${uid}/projects/${projectID}/`;
            case "cursorUnderDocument" :
                return `documents/${projectID}/cursors/${uid}/`;
            default :
                return undefined;
        }
    }
    const handleShow = () => setShow(true);
    //Function uSed in URL conversion 
    const replaceAll = (str, term, replacement) => {
        return str.replace(new RegExp(escapeRegExp(term), 'g'), replacement);
    }
    const escapeRegExp = (string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
    /**Open the Email Link or Generate Link*/
    const openLink = (operation) =>()=> {
        const encryptPermission = replaceAll(Crypto.encrypt(permission, "grpthink12!").toString(), '/', '$');
        const encryptName = replaceAll(Crypto.encrypt(props.currentUser.displayName, "grpthink12!").toString(), '/', '$');
        const encryptType = replaceAll(Crypto.encrypt(linkType, "grpthink12!").toString(), '/', '$');
        const customURL = String(window.location) + "/" + encryptPermission + "/" + encryptType + "/" + encryptName ;
        // ------- Used '/' to omit "/:permissionID"
        /**
         * To Show Encryption in Better Way
         */
        const showLog = {};
        showLog[permission]=encryptPermission;
        showLog[props.currentUser.displayName]=encryptName;
        showLog[linkType]=encryptType;
        showLog["customURL"]=customURL;
        console.log("Encryption Log \n",showLog)
        if(linkType != undefined && permission != undefined)
        {
            if(operation === 'emailLink')
            {
                setEmailShow(true);
                console.log("This Operation \n",linkType , permission , url , emailShow)
            }
            else
            {
                setLink(true)
            }
            createRoom(props.projectID, props.currentUser.uid, 
                props.currentUser.displayName,permission  ,linkType
            )
            .then("Room & Cursor Made").catch(err => err)
            setURL(customURL)
        }
        else
        {
            setEmailShow(false);
            setLink(false)
        }
    }
    const ChangeRadio = (e) => {
        setPermission(e.target.value)
    }
    const LinkType = (e) => {
        setLinkType(e.target.value)
    }
    /**While Closing Modal Everything Should be At Initial Level*/
    const handleClose = () => {
        setShow(false);
        setLink(false);
        setURL(null);
        setLinkType(null);
        setPermission(null);
        setState({
            inputValue: '',
            value: []
        });
        setEmailShow(false);
    }
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    /**
     * Function Exicutes the Cloud Function Call to Send Email to Entered values
     */
    const sendEmails = () => 
    {
        console.log("Send Emails",state.value )
        if(state.value.length>0)
        {
            var addMsg = firebaseFunction.httpsCallable('sendLinkEmail');
            Object.entries(state.value).map(([key,val])=>{
                const updates = {};
                console.log("ITEM",key,val)
                updates["emailId"]=val.value;
                updates["link"]=url;
                addMsg(updates).then((result) =>console.log("Sended Email", result,updates)).catch(err => console.log(err))
            })    
        }
        else
        console.log("EMPTY STRING");
    }

    /**
     * Changes the Permission on basis of UID
     * @param {*} uid 
     * @param {*} permi 
     */
    const changePermission = (uid, permi) => () => {
        var isLocked = true;
        if(permi === 'rw')
        {
            isLocked=false;
        }
        const updates = {};
        updates[refPaths(uid,"projectUnderUser")+"access"] = permi;
        updates[refPaths(uid,"projectUnderUser")+"isLocked"] = isLocked;
        updates[refPaths(uid,"usersUnderDocument")+"permission"] =permi;
        
        var addMsg = firebaseFunction.httpsCallable('createNewProject')
        addMsg(updates).then(result => console.log("Updates Done", result, updates)).catch(err => console.log(err))
    }
    /**
     * Makes The selected user the owner of project ;
     * Feature of Owner is : Owner can create the Owner but can change it's permission afterward
     * i.e. `One Way Operation`
     * @param {*} uid 
     */
    const makeOwner = (uid) => async () => {
        const updates = {};
        updates[refPaths(uid,"projectUnderUser")+`access`] = 'rw';
        updates[refPaths(uid,"projectUnderUser")+`shared`] = null;
        updates[refPaths(uid,"usersUnderDocument")+"permission"] ="rw";
        updates[refPaths(uid,"usersUnderDocument")+"isOwner"] =true;
        var addMsg = firebaseFunction.httpsCallable('createNewProject')
        addMsg(updates).then(result => console.log("Updates Done", result, updates)).catch(err => console.log(err))

    }
    /**
     * Deletes The User of corresponding uid
     * @param {*} uid 
     */
    const deleteUser = (uid) => () =>
    {
        const updates = {};
        updates[refPaths(uid,"projectUnderUser")] = null;
        updates[refPaths(uid,"usersUnderDocument")] = null;
        updates[refPaths(uid,"cursorUnderDocument")] = null;
        var addMsg = firebaseFunction.httpsCallable('createNewProject')
        addMsg(updates).then(result => console.log("Updates Done", result, updates)).catch(err => console.log(err))
    }
    //console.log("EMALS",state)
    const handleChange = (value, actionMeta) => {
        console.group('Value Changed');
        console.log(value);
        console.log(`action: ${actionMeta.action}`);
        console.groupEnd();
        setState({inputValue:state.inputValue, value:value });
    };
    const handleInputChange = (inputValue) => {
        setState({ inputValue:inputValue , value:state.value });
    };
    const handleKeyDown = (event) => {
        const { inputValue, value } = state;
        if (!inputValue) return;
        switch (event.key) {
          case 'Enter':
          case 'Tab':
            console.group('Value Added');
            console.log(value);
            console.groupEnd();
            if(validateEmail(inputValue))
            {setState({
              inputValue: '',
              value: [...value, createOption(inputValue)],
            });}
            else alert(`Invalid Email Entered ${inputValue}`,setState(state))
            event.preventDefault();
        }
    }
    return (
        <>
            {
                props.document && !props.isOwner ?
                <Button className={props.buttonClassName} handleClick={handleShow}>
                    Share
                </Button>
                :null
            }
            
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Share Your Project</Modal.Title>
                </Modal.Header>
                <Modal.Body>
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
                    
                    {
                        emailShow ?
                        <div>
                            <CreatableSelect
                                components={components}
                                inputValue={state.inputValue}
                                isClearable
                                isMulti
                                menuIsOpen={false}
                                onChange={handleChange.bind(this)}
                                onInputChange={e=>handleInputChange(e)}
                                onKeyDown={e=>handleKeyDown(e)}
                                placeholder="Type something and press enter..."
                                value={state.value}
                            />
                            <input type="submit" onClick={sendEmails} className="custom_btn"/>
                        </div>
                        :<Button className="custom_btn" handleClick={openLink("emailLink")}>Send Email </Button>
                    }
                    {
                        link ?
                            <div>
                                <br />
                            Copy Your Link :
                            <br />
                                <b style={{ display: "inline-flex" }}>{url}</b>
                                <br />
                                <LinkSharing url={url} title={title} size="2.5rem" />
                            </div>
                            : <Button className="custom_btn" handleClick={openLink()}>Generate Link</Button>
                    }
                    {
                        users ?
                        Object.entries(users).map(([key, val]) => {
                            return (
                                <div key={key}>
                                    <hr/>
                                    <img src={val?.photoURL} className="menu-bar-user-profile-picture" />
                                    <b>{val?.email}</b>-
                                    {
                                        val.isOwner?
                                        <>
                                            <span>{val.name}</span>
                                            <span>(Owner)</span>
                                        </>
                                        :
                                        <>
                                            <span>{val?.name}</span>
                                            &nbsp;
                                            <span><strong>{val?.permission}</strong></span>
                                            &nbsp; &nbsp;
                                            <span><Button handleClick={deleteUser(key)}>X</Button></span>
                                            <DropdownButton title={val?.permission} size="sm">
                                                <Dropdown.Item onClick={changePermission(key, "r")}>Read Only</Dropdown.Item>
                                                <Dropdown.Item onClick={changePermission(key, "rw")}>Read And Write</Dropdown.Item>
                                                <Dropdown.Divider />
                                                <Dropdown.Item onClick={makeOwner(key)} >Make Owner</Dropdown.Item>
                                            </DropdownButton>
                                        </>
                                    }
                                </div>
                            )
                        })
                        : <p><hr/>No Lists</p>        
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button className="custom_btn" handleClick={handleClose}>Close</Button>
                    <Button className="custom_btn" handleClick={handleClose}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
    const components = {
        DropdownIndicator: null,
    };
    
    const createOption = (label) => ({
        label,
        value: label,
    });
    //----Creates Room When Public Type is called---
    const createRoom = async (child, uid, name,permission,linkType) => {
        const path = `documents/${child}/`;
        const updates = {};
        if(linkType === 'public')
        {
            updates[path + "/users/public"] = permission; 
        }
        updates[`${path}/cursors/${uid}`] = {
            x : 0,
            y : 0
        }
        updates[`${path}/users/${uid}/lastUpdatedAt`] = firebaseTIME;
        updates[`${path}/lastActive/${uid}`]={time: firebaseTIME}
        await firebaseDB.ref().update(updates).then(console.log("Created ROOM")).catch(err => err)

    }

export default React.memo(ShareLink);