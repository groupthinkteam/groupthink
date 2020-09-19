import React,{useState} from "react"
import Button from "../Button/Button"
import { Modal } from "react-bootstrap"
import { firebaseDB } from "../../services/firebase"
import { auth } from "firebase"
import LinkSharing from "./LinkSharing"

import "../../styles/MenuBar.scss"

//----Create "Public" in Database ----
const createPublic = (id,permission) =>
{
    const path = `documents/${id}/users/` ;
    const updates = {};
    updates[path + "public"] = permission
    firebaseDB.ref().update(updates).then(console.log("Created Public With Permission",permission))
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
    const openLink = () => {
        if(linkType != undefined && permission !=undefined){ 
            setLink(true) 
            if(linkType === "private")
            {
                setURL(String(window.location)+"/"+auth().currentUser?.uid+"/"+linkType+"/"+permission)
                
            }
            else
            {
                createPublic(props.projectID,permission)
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
    //console.log("Link",link , "\n linkType ", linkType,"\n Permission",permission,"\n URL",url)
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