import React,{useState} from "react"
import Button from "../Button/Button"
import { Modal } from "react-bootstrap"
import { firebaseDB } from "../../services/firebase"
import { auth } from "firebase"
import LinkSharing from "./LinkSharing"
import * as Crypto from 'crypto-js/aes';
import "../../styles/MenuBar.scss"

//----Create "Public" in Database ----
const createPublic = (id,permission,uid) =>
{
    
    const path = `documents/${id}/` ;
    const updates = {};
    updates[path + "/users/public"] = permission;
    updates[path+"/room/"+uid] =  {
        X_POS : 0 ,
        Y_POS : 0
    }
    firebaseDB.ref().update(updates).then(console.log("Created Public With Permission",permission))
}
const createRoom = async(child,uid) =>
{
    const updates = {};
    updates[`documents/${child}/room/`+uid] ={
        X_POS : 0 ,
        Y_POS : 0
    } 
    await firebaseDB.ref().update(updates).then(console.log("Created ROOM")).catch(err=>err)
    
}
const ShareLink = (props) =>
{
    const [show, setShow] = useState(false);
    const [link  , setLink] = useState(false)
    const [linkType , setLinkType] = useState();
    const [permission , setPermission] = useState();
    const [url , setURL] =useState();
    const handleShow = () =>  setShow(true);
    const title = "Groupthink Website"
    function replaceAll(str, term, replacement) {
        return str.replace(new RegExp(escapeRegExp(term), 'g'), replacement);
    }
    function escapeRegExp(string){
        return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }  
    const openLink = () => {
        if(linkType != undefined && permission !=undefined){ 
            setLink(true) 
            if(linkType === "private")
            {
                createRoom(props.projectID,props.currentUser.uid).then("Room Made").catch(err=>err)
                //-----Encryption-------
                const encryptPermission = Crypto.encrypt(permission,"grpthink12!").toString();
                // ------- Used '/' to omit "/:permissionID"
                const custom = replaceAll(encryptPermission,'/','$')
                console.log(encryptPermission,permission , custom)
                setURL(String(window.location)+"/"+custom)
                
            }
            else
            {
                createPublic(props.projectID,permission,props.currentUser.uid)
                setURL(String(window.location))
            }
        }
        else
        setLink(false)
    }
    const ChangeRadio = (e) =>
    {
        setPermission(e.target.value)
    }
    const LinkType = (e) =>
    {
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
    return(
        <>
            <Button  handleClick={handleShow}>
                Share
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Share Your Project</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Type Of Link To be Shared 
                    <br/>
                    <input type="radio" name="linkType" value="public" onChange={e=> LinkType(e)} required={true}/>
                    <label htmlFor="male">Public</label>
                    <input type="radio" name="linkType" value="private" onChange={e=>LinkType(e)} required={true} />
                    <label htmlFor="male">Private </label>
                    <br/>
                    <input type="radio" name="options" value="r" onChange={e=>ChangeRadio(e)} required={true} />
                    <label htmlFor="male">Read Only</label>
                    <input type="radio" name="options" value="rw" onChange={e=>ChangeRadio(e)} required={true}/>
                    <label htmlFor="male">Read and Write </label>
                    <br/>
                    <Button className="custom_btn" handleClick={openLink}>Generate Link</Button>
                    {
                        link ?
                        <div>
                        <br/>
                            Copy Your Link : 
                        <br/>
                            <b style={{display:"inline-flex"}}>{url}</b>
                        <br/>
                            <LinkSharing url={url} title={title} size = "2.5rem"/>
                        </div>
                        :<div/>
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