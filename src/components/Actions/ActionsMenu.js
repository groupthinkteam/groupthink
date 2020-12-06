import { observer } from "mobx-react-lite"
import React, { useState } from "react"
import { useStore } from "../../store/hook"
import Popup from "../PopupMenu/PopupMenu"

import "../../styles/Actions/ActionsMenu.scss"

function ActionsMenu(props) {
    let store = useStore()
    let [isExpanded, setIsExpanded] = useState(false);

    return (
        <div>
            <div className="top-band">
                <img className="actions-button-icon"
                    onClick={() => setIsExpanded(true)}
                    src={require("../../assets/actions/bolt.svg")}
                    alt="actions"
                />
                {store.selectedAction ?
                    <div className="action-name">
                        {store.actionsList[store.selectedAction].title}
                        <img className="close-action"
                            onClick={() => { store.isSelectingCard = false; store.selectedAction = null }} 
                            src={require("../../assets/actions/close.svg")}
                            alt="close actions"
                            />

                    </div>
                    : null
                }
            </div>
            {
                isExpanded ?
                    <Popup handleClose={() => { setIsExpanded(false) }}>
                        <div className="actions-container">
                            <div className="title">
                                Actions
                        </div>
                            <div className="subtitle">
                                Actions make your life easier by automating many common tasks.
                        </div>
                            <div className="section-heading">
                                Popular Actions
                        </div>
                            <div className="grid">
                                {Object.entries(store.actionsList).map(
                                    ([id, action]) => {
                                        console.log(id, action)
                                        return (
                                            <ActionItem key={id} action={action}
                                                onClick={() => {
                                                    store.selectedAction = id;
                                                    store.isSelectingCard = true;
                                                    console.log(store.selectedAction)
                                                    setIsExpanded(false)
                                                }} />
                                        )
                                    }
                                )}
                            </div>
                        </div>
                    </Popup>
                    : null
            }
        </div >
    )
}

function ActionItem({ action, onClick }) {
    return (
        <div className="action-item" onClick={onClick}>
            <div className="icon"></div>
            <div className="content">
                <div className="title">
                    {action.title}
                </div>
                <div className="description">
                    {action.description}
                </div>
            </div>
        </div>
    )
}


export default observer(ActionsMenu)

// store.runAction(
//     action.id,
//     { url: "https://www.nytimes.com/2020/08/06/opinion/coronavirus-us-recession.html?action=click&module=Opinion&pgtype=Homepage" },
//     (response) => { console.log("response from summarize", response) }
// )