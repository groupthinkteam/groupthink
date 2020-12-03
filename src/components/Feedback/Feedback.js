import React, { useState } from "react"
import PopupMenu from "../PopupMenu/PopupMenu"
import Button from '../Button/Button'
import "../../styles/Feedback/Feedback.scss"



function Feedback(props) {
    const [isOpen, setIsOpen] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const togglePopup = () => {
        setIsOpen(!isOpen);
    }
    const webHook = "https://discord.com/api/webhooks/783674948077879318/k" +
        "R6ipYETLsriXjdnpDCGcztvuo1m01YNh_FPG4-Jw8ReZl_hG68sMoAJf" +
        "woB_3ro82-U";
    const makeFeedback = (e) => {
        setFeedback({content: e})
    }

    const sendFeedback = () => {
        fetch(
            webHook,
            {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(feedback),
            }
        )
            .then(response => response.json())
            .catch(error => error);
    }


    return (
        <div>
            <div>
                <Button handleClick={() => { togglePopup(); }}>Feedback</Button>
            </div>
            {isOpen &&
                <PopupMenu handleClose={togglePopup}>
                    <div className="container">
                        <h1>Feedback</h1>
                        <textarea className="textbox" type="text" onChange={(e) => { makeFeedback(e.target.value); }}></textarea>
                        <br />
                        <button onClick={() => sendFeedback()}>Submit</button>
                    </div>
                </PopupMenu>}
        </div>
    )

}

export default Feedback