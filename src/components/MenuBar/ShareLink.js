import React, { useState } from "react"
import Button from "../Button/Button"
import { Modal } from "react-bootstrap"
import { firebaseDB } from "../../services/firebase"
import LinkSharing from "./LinkSharing"
import * as Crypto from 'crypto-js/aes';
import "../../styles/MenuBar.scss"

//----Create "Public" in Database ----
const createPublic = (id, permission, uid, name) => {

    const path = `documents/${id}/`;
    const updates = {};
    updates[path + "/users/public"] = permission;
    updates[path + "/room/" + uid] = {
        name : name,
        X_POS: 0,
        Y_POS: 0
    }
    firebaseDB.ref().update(updates).then(console.log("Created Public With Permission", permission))
}
//----Creates Room When Public Type is called---
const createRoom = async (child, uid, name) => {
    const updates = {};
    updates[`documents/${child}/room/` + uid + "/name/"] = name
    updates[`documents/${child}/room/` + uid] = {
        X_POS: 0,
        Y_POS: 0
    }
    await firebaseDB.ref().update(updates).then(console.log("Created ROOM")).catch(err => err)

}
const ShareLink = (props) => {
    const [show, setShow] = useState(false);
    const [link, setLink] = useState(false)
    const [linkType, setLinkType] = useState();
    const [permission, setPermission] = useState();
    const [url, setURL] = useState();
    const handleShow = () => setShow(true);
    const title = "Groupthink Website"
    function replaceAll(str, term, replacement) {
        return str.replace(new RegExp(escapeRegExp(term), 'g'), replacement);
    }
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
    const openLink = () => {
        if (linkType != undefined && permission != undefined) {
            setLink(true)
            if (linkType === "private") {
                createRoom(props.projectID, props.currentUser.uid, props.currentUser.displayName)
                .then("Room Made").catch(err => err)
            }
            else {
                createPublic(props.projectID, permission, props.currentUser.uid, props.currentUser.displayName)
            }
            const encryptPermission = replaceAll(Crypto.encrypt(permission, "grpthink12!").toString(), '/', '$');
            const encryptName = replaceAll(Crypto.encrypt(props.currentUser.displayName , "grpthink12!").toString(), '/', '$');
            const encryptType = replaceAll(Crypto.encrypt(linkType,"grpthink12!").toString(),'/','$');
            // ------- Used '/' to omit "/:permissionID"
            console.log(encryptPermission, permission ,"\n Name ", encryptName ,"\n Type \n", encryptType)
            setURL(String(window.location) + "/" +encryptPermission+"/"+encryptType+"/"+encryptName)
        }
        else
            setLink(false)
    }
    const ChangeRadio = (e) => {
        setPermission(e.target.value)
    }
    const LinkType = (e) => {
        setLinkType(e.target.value)
    }
    //----------While Closing Set Everything As At Initial Level----------
    const handleClose = () => {
        setShow(false);
        setLink(false);
        setURL(null);
        setLinkType(null);
        setPermission(null);
    }
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
                    <Button className="custom_btn" handleClick={openLink}>Generate Link</Button>
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
                            : <div />
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
export default ShareLink;