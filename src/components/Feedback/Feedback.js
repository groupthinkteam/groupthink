import React, { useState } from "react"
import PopupMenu from "../PopupMenu/PopupMenu";
import "../../styles/Feedback/Feedback.scss"
import { observer } from "mobx-react-lite"
import { useStore } from "../../store/hook"
import Bowser from "bowser";
import { nanoid } from 'nanoid'
function Feedback(props) {
    let store = useStore()
    const [isOpen, setIsOpen] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const togglePopup = () => {
        setIsOpen(!isOpen);
    }
    const webHook = "https://discord.com/api/webhooks/783674948077879318/k" +
        "R6ipYETLsriXjdnpDCGcztvuo1m01YNh_FPG4-Jw8ReZl_hG68sMoAJf" +
        "woB_3ro82-U";
    const makeFeedback = (e) => {
        setFeedback(e)
    }
    const browser = Bowser.getParser(window.navigator.userAgent).getBrowser();
    console.log(browser.version);

    const sendFeedback = () => {
        fetch(
            webHook,
            {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    embeds: [
                        {
                            title: 'Feedback #' + nanoid(),
                            color: 14177041,
                            author: {
                                name: store.currentUser.displayName,
                                icon_url: store.currentUser.photoURL,
                            },
                            fields: [
                                {
                                    name: 'Email',
                                    value: store.currentUser.email,
                                },
                                {
                                    name: 'Browser',
                                    value: browser.name + " " + browser.version,
                                },
                            ],
                            description: feedback,
                        }
                    ],
                }),

            }
        )
            .then(response => response.json())
            .catch(error => error);
    }


    return (
        <div className="feedback">
            <button data-delay-show='100' data-effect="solid" data-tip="Feedback" className="fb-button" onClick={() => { togglePopup(); }}>
                Feedback
            </button>
            {isOpen &&
                <PopupMenu handleClose={togglePopup}>
                    <div className="container">
                        <h2>Feedback</h2>
                        <textarea className="textbox" type="text" onChange={(e) => { makeFeedback(e.target.value); }}></textarea>
                        <br />
                        <button onClick={() => { sendFeedback(); togglePopup() }}>
                            Submit
                        </button>
                    </div>
                </PopupMenu>}
        </div>
    )

}

export default observer(Feedback)