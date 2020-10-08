import React, { useState , useEffect} from "react"
import Button from "../Button/Button"
import {DropdownButton, Modal, Dropdown } from "react-bootstrap"
import { firebaseDB, firebaseFunction, firebaseTIME } from "../../services/firebase"
import LinkSharing from "./LinkSharing"
import * as Crypto from 'crypto-js/aes';
import "../../styles/MenuBar.scss"


const ShareLink = (props) => {

    //Show Modal State
    const [show, setShow] = useState(false);

    //Show Generated Link State
    const [link, setLink] = useState(false);

    //Show Email State
    const [email , setEmail] = useState([]);
    const [emailShow , setEmailShow] = useState(false);

    //Type Link , Permission & URL State
    const [linkType, setLinkType] = useState();
    const [permission, setPermission] = useState();
    const [url, setURL] = useState();

    /**Users Information State inthe Room*/
    const [users, setUsers] = useState(null);

    useEffect(() => {
        firebaseDB.ref("documents/" + projectID + "/room/").on('value', snap => setUsers(snap.val()))
        return () => firebaseDB.ref("documents/" + projectID + "/room/").off()
    }, [])

    
    const title = "Groupthink Website";
    const projectID = props.projectID;

    const handleShow = () => setShow(true);
    //Function uSed in URL conversion 
    const replaceAll = (str, term, replacement) => {
        return str.replace(new RegExp(escapeRegExp(term), 'g'), replacement);
    }
    const escapeRegExp = (string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
    const isValidEmail = (text) =>
    {
        const regExForEMail = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
        return regExForEMail.test(text)
    }
    /**Open the Email Link or Generate Link*/
    const openLink = (operation) =>()=> {
        const encryptPermission = replaceAll(Crypto.encrypt(permission, "grpthink12!").toString(), '/', '$');
        const encryptName = replaceAll(Crypto.encrypt(props.currentUser.displayName, "grpthink12!").toString(), '/', '$');
        const encryptType = replaceAll(Crypto.encrypt(linkType, "grpthink12!").toString(), '/', '$');
        const customURL = String(window.location) + "/" + encryptPermission + "/" + encryptType + "/" + encryptName ;
        // ------- Used '/' to omit "/:permissionID"
        const showLog = {};
        showLog[permission]=encryptPermission;
        showLog[props.currentUser.displayName]=encryptName;
        showLog[linkType]=encryptType;
        showLog["customURL"]=customURL;
        console.log("Encryption Log \n",showLog)
        if(operation === 'emailLink' && (linkType != undefined && permission != undefined))
        {
            setEmailShow(true);
            console.log("This Operation \n",linkType , permission , url , emailShow)
            createRoom(props.projectID, props.currentUser.uid, 
                props.currentUser.displayName,permission , props.currentUser.email , 
                props.currentUser.photoURL
            )
            .then("Room & Cursor Made").catch(err => err)
            setURL(customURL)
            
        }
        else if (linkType != undefined && permission != undefined) {
            setLink(true)
            if (linkType === "private") {
                createRoom(props.projectID, props.currentUser.uid, 
                    props.currentUser.displayName,permission , props.currentUser.email , 
                    props.currentUser.photoURL
                )
                .then("Room & Cursor Made").catch(err => err)
            }
            else {
                createPublic(props.projectID, permission, props.currentUser.uid,
                    props.currentUser.displayName, props.currentUser.email , 
                    props.currentUser.photoURL
                )
            }
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
        setEmail([]);
        setEmailShow(false);
    }
    const onChangeEmails = (e) => 
    {
        console.log("Input is ",e.target.value);
        
        const text = e.target.value;
        const textParts = text.split(" ")
        console.log("textParts",textParts);
        if(textParts.length >1)
        Object.keys(textParts).map(item => {
            if(isValidEmail(item))
            {
                setEmail(...email,item)
            }
        })
        else if(isValidEmail(textParts[0]))
        setEmail([textParts[0]])
    }
    const sendEmails = () => 
    {
        console.log("Send Emails",email.length , url)
        if(email.length > 0)
        {
            const updates = {};
            for(var i = email.length-1;i>=0;i--)
            {
                updates["email"] = email[i];
                updates["link"] = url;
            }
            var addMsg = firebaseFunction.httpsCallable('sendLinkEmail')
            addMsg(updates).then((result) =>console.log("Sended Email", result,updates)).catch(err => console.log(err))
            
        }
    }
    const changePermission = (uid, permi) => () => {
        const updates = {};
        updates[`users/${uid}/projects/${projectID}/access`] = permi;
        updates[`documents/${projectID}/users/${uid}/`] = permi;
        updates[`documents/${projectID}/room/${uid}/permission`] = permi;
        var addMsg = firebaseFunction.httpsCallable('createNewProject')
        addMsg(updates).then(result => console.log("Updates Done", result, updates)).catch(err => console.log(err))
    }

    const makeOwner = (uid) => async () => {
        const inUsers = await firebaseDB.ref(`documents/${projectID}/users/`).once('value').then(snap => snap.hasChild(uid)).catch(err => err)
        const updates = {};
        updates[`users/${uid}/projects/${projectID}/shared`] = null;
        if (inUsers) {
            updates[`documents/${projectID}/users/${uid}/`] = "rw";
        }
        var addMsg = firebaseFunction.httpsCallable('createNewProject')
        addMsg(updates).then(result => console.log("Updates Done", result, updates)).catch(err => console.log(err))

    }
    console.log("EMALS",email)
    return (
        <>
            <Button className={props.buttonClassName} handleClick={handleShow}>
                Share
            </Button>
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
                            <input placeholder="Enter Email ID's" type="text" name="emails" onChange={e=>onChangeEmails(e)} required={true}/>
                            <input type="submit" onClick={sendEmails}/>
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
                        users && !props.isOwner ?
                        Object.entries(users).map(([key, val]) => {
                            return (
                                <div key={key}>
                                    <hr/>
                                    <img src={val?.photoURL} className="menu-bar-user-profile-picture" />
                                    <b>{val?.email}</b>-
                                    {
                                        !props.isOwner ?
                                            <>
                                                <span>{val.name}</span>
                                                <span>(Owner)</span>
                                            </>
                                            :
                                            <>
                                                <span>{val?.name}</span>
                                        &nbsp;
                                                <span>{val?.permission}</span>
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
//----Create "Public" in Database ----
const createPublic = (id, permission, uid, name,email,photoURL) => {
    const path = `documents/${id}/`;
    const updates = {};
    updates[path + "/users/public"] = permission;
    updates[path + "/room/" + uid] = {
        name: name,
        photoURL : photoURL,
        email: email,
        permission:permission
    }
    updates[`documents/${id}/cursors/${uid}`] = {
        x : 0,
        y : 0,
        time: firebaseTIME
    }
    firebaseDB.ref().update(updates).then(console.log("Created Public With Permission", permission))
}
//----Creates Room When Public Type is called---
const createRoom = async (child, uid, name,permission,email,photoURL) => {
    const updates = {};
    updates[`documents/${child}/cursors/${uid}`] = {
        x : 0,
        y : 0,
        time: firebaseTIME
    }
    updates[`documents/${child}/room/` + uid] = {
        name : name,
        photoURL : photoURL,
        email: email,
        permission:permission
    }
    await firebaseDB.ref().update(updates).then(console.log("Created ROOM")).catch(err => err)

}
export default React.memo(ShareLink);