import React,{useEffect, useState} from 'react';
import Button from "../Button/Button"
import { DropdownButton, Modal , Dropdown } from "react-bootstrap"
import { firebaseDB, firebaseFunction } from '../../services/firebase';
//Todo :- Check For Re-render
const SharedList = (props) =>
{
    const [show, setShow] = useState(false);
    const [uidFromRoom , setUIDFromRoom] = useState();
    const [isLoaded , setLoaded] = useState();
    const handleShow = async() => {
        setShow(true);
        //const uidKey  = await retrieveUIDFromRoom(props.projectID)
        //setUIDFromRoom(uidKey)
    }
    useEffect(()=>{
        firebaseDB.ref("documents/"+projectID+"/room/").on('value',snap=>setUIDFromRoom(snap.val()))
        return ()=>firebaseDB.ref("documents/"+projectID+"/room/").off()
    },[])
    console.log("UIDS",uidFromRoom)
    const handleClose = () => setShow(false);
    const projectID = props.projectID;
    
    const changePermission =(uid,permi) =>()=>
    {
        const updates = {};
        updates[`users/${uid}/projects/${projectID}/access`] = permi;
        updates[`documents/${projectID}/users/${uid}/`] = permi;
        updates[`documents/${projectID}/room/${uid}/permission`] = permi;
        var addMsg = firebaseFunction.httpsCallable('createNewProject')
        addMsg(updates).then(result =>console.log("Updates Done", result,updates)).catch(err => console.log(err))
    }
    const makeOwner = (uid) =>async() =>
    {
        const inUsers = await firebaseDB.ref(`documents/${projectID}/users/`).once('value').then(snap=>snap.hasChild(uid)).catch(err=>err)
        const updates = {};
        updates[`users/${uid}/projects/${projectID}/shared`]=null;
        if(inUsers)
        {
            updates[`documents/${projectID}/users/${uid}/`] = "rw";
        }
        var addMsg = firebaseFunction.httpsCallable('createNewProject')
        addMsg(updates).then(result =>console.log("Updates Done", result,updates)).catch(err => console.log(err))
        
    }
    return(
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
                            uidFromRoom && !props.isOwner? 
                            Object.entries(uidFromRoom).map(([key,val])=>{
                                console.log("User Shared",key,val)
                                return(
                                    <div key={key} >
                                        <img src={val?.photoURL} className="menu-bar-user-profile-picture" />
                                        <b>{val?.email}</b>-
                                        {
                                            val?.name === props.currentUser.displayName ?
                                            <span>(Owner)</span>
                                            :
                                            <>
                                                <span>{val?.name}</span>
                                                &nbsp; 
                                                <span>{val?.permission}</span>
                                                <DropdownButton title={val?.permission} size="sm">
                                                    <Dropdown.Item onClick={changePermission(key,"r")}>Read Only</Dropdown.Item>
                                                    <Dropdown.Item onClick={changePermission(key,"rw")}>Read And Write</Dropdown.Item>
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
const retrieveUIDFromRoom = async(id) => 
{
    const uidFromRoom = await firebaseDB.ref("documents/"+id+"/room/").once('value')
    .then(snap=>snap.val()).catch(err=>console.log("retrieveUIDFromRoom Error",err));
    if(uidFromRoom)
    {
        const uidKeys =[]; 
        Object.entries(uidFromRoom).map(([key,val])=>{uidKeys.push(val)});
        console.log("UID KEYS",uidKeys);
        return uidKeys;
    }
    else return false;
} 

export default SharedList;