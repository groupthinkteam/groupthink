import React, { useState } from 'react';
import { observer } from "mobx-react-lite";
import { useStore } from "../../store/hook";
import Button from '../Button/Button';
import { Modal } from 'react-bootstrap';

const ShareLink = observer(props => {
    const store = useStore();
    const [link, setLink] = useState(false)
    const [linkType, setLinkType] = useState();
    const [permission, setPermission] = useState();
    const [show, setShow] = useState(false);
    const [url, setURL] = useState();
    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false);
    }
    const ChangeRadio = (e) => {
        setPermission(e.target.value)
    }
    const LinkType = (e) => {
        setLinkType(e.target.value)
    }
    const openLink = () => {
        if (linkType !== undefined && permission !== undefined) {
            setLink(true)
            const newKey = store.addKeyToShare(permission)
            setURL(String(window.location)+"/shared/"+newKey+"/"+permission);
        }
        else
            setLink(false)
    }
    return (
        <>
            <Button className={props.buttonClassName} handleClick={handleShow}>Share</Button>
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
                                {/* <LinkSharing url={url} title={title} size="2.5rem" /> */}
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
});
export default ShareLink;