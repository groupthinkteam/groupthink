import React,{useState} from "react"
import Button from "../Button/Button"
import { Modal } from "react-bootstrap"

import "../../styles/MenuBar.scss"
import { firebaseDB } from "../../services/firebase"
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
    const handleClose = () => setShow(false);
    const handleShow = () =>  setShow(true);
    const [link  , setLink] = useState(false)
    const [radioOpt , setRadio] = useState(true);
    const url = String(window.location)
    const title = "Groupthink Website"
    const openLink = () => {
        setLink(true)
        createPublic(props.projectID , radioOpt)
    }
    const ChangeRadio = (e) =>
    {
        setRadio(e.target.value)
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
                    <input type="radio" name="options" value="r" onChange={e=>ChangeRadio(e)} />
                    <label htmlFor="male">Read Only</label>
                    <input type="radio" name="options" value="rw" onChange={e=>ChangeRadio(e)} checked={true}/>
                    <label htmlFor="male">Read and Write </label>
                    <br/>
                    <Button handleClick={openLink}>Generate Link</Button>
                    {
                        link ?
                        <div>
                        <br/>
                            Copy Your Link : 
                        <br/>
                            <b>{url}</b>
                        </div>
                        :<div/>
                    }
                </Modal.Body>
                <Modal.Footer>
                <Button  handleClick={handleClose}>
                    Close
                </Button>
                <Button  handleClick={handleClose}>
                    Save Changes
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
export default function MenuBar(props) {
    const currentUser = props.currentUser()
    return (
        <div className="menu-bar topheader">
            <div className="menu-bar-panel menu-bar-panel-left">
                <img alt="user avatar" className="menu-bar-user-profile-picture" src={currentUser.photoURL} />
                {currentUser.displayName}
            </div>
            <div className="menu-bar-panel menu-bar-panel-center">
                <div className="menu-bar-site-title">
                    groupthink
                </div>
            </div>
            <div className="menu-bar-panel menu-bar-panel-right">
                <Button className="logout-button" handleClick={props.onLogOut}>
                    log out
                </Button>
            </div>
            {
                props.document != undefined ?
                <ShareLink projectID ={props.projectID}/>
                :<div/>
            }
        </div>
    );
}