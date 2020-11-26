import React, { useState, useRef, useEffect } from 'react';
import { observer } from "mobx-react-lite";
import { useStore } from "../../store/hook";
import Button from '../Button/Button';
import '../../styles/UserMenu.scss'
import PopperMenu from '../PopperMenu/PopperMenu';

const ShareLink = (props) => {
    const store = useStore();
    const [link, setLink] = useState(false)
    const [email, setEmail] = useState()
    const [linkType, setLinkType] = useState();
    const [permission, setPermission] = useState();
    const [show, setShow] = useState(false);
    const [url, setURL] = useState();
    const buttonRef = useRef(null);
    const contentRef = useRef(null);
    const sendInvite = () => {
            var data = {
                link: url,
                emailId: email
            }
            console.log("email data: ", data)
            store.sendInviteEmail(data);        
    }
    const ChangeRadio = (e) => {
        setPermission(e.target.value)
    }
    const LinkType = (e) => {
        setLinkType(e.target.value)
    }
    const Email = (e) => {
        setEmail(e.target.value)
    }
    const openLink = () => {
        if (linkType !== undefined && permission !== undefined) {
            setLink(true)
            const newKey = store.addKeyToShare(permission)
            return setURL([String(window.location.origin), "shared", store.projectID, newKey, permission].join("/"));
        }
        else
            return setLink(false)
    }
    useEffect(() => {
        function handleClickOutside(event) {
            if (buttonRef.current && contentRef.current && !buttonRef.current.contains(event.target) && !contentRef.current.contains(event.target)) {
                setShow(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [buttonRef]);
    return (
        <>
            <Button ref={buttonRef} className={props.buttonClassName} handleClick={() => setShow(!show)}>Share</Button>
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
                    <input type="text" name="emailId" onChange={e => Email(e)}></input>
                    <Button className="custom_btn" handleClick={sendInvite}>Send Invite</Button>
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
                </div>
            </PopperMenu>
        </>
    )
};
export default observer(ShareLink);