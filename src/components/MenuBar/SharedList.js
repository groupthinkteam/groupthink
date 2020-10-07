import React, { useEffect, useState } from 'react';
import Button from "../Button/Button"
import { DropdownButton, Modal, Dropdown } from "react-bootstrap"
import { firebaseDB, firebaseFunction } from '../../services/firebase';
/**
 * This Component Shows The List of Users to which project is Shared . 
 * Also features to access modification . 
 * @param {*} props 
 */
const SharedList = (props) => {
    const [show, setShow] = useState(false);
    const [users, setUsers] = useState(null);
    const handleClose = () => setShow(false);
    const handleShow = async () => {
        setShow(true);
        //const uidKey  = await retrieveusers(props.projectID)
        //setUsers(uidKey)
    }
    useEffect(() => {
        firebaseDB.ref("documents/" + projectID + "/room/").on('value', snap => setUsers(snap.val()))
        return () => firebaseDB.ref("documents/" + projectID + "/room/").off()
    }, [])

    console.log("users state", users)
    const projectID = props.projectID;

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

    return (
        <>
            <div>
                <Button className={props.buttonClassName} handleClick={handleShow}>
                    SharedList
                </Button>
                <Modal show={show} onHide={handleClose} >
                    <Modal.Header closeButton>
                        <Modal.Title>Shared List Of Users</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {
                            users && !props.isOwner ?
                                Object.entries(users).map(([key, val]) => {
                                    return (
                                        <div key={key}>
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
                                : <p>No Lists</p>
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="custom_btn" handleClick={handleClose}>Close</Button>
                        <Button className="custom_btn" handleClick={handleClose}>Save Changes</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    )
}

export default React.memo(SharedList);