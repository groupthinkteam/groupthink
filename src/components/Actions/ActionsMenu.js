import { observer } from "mobx-react-lite"
import React, { useState } from "react"
import { useStore } from "../../store/hook"
import Popup from "../PopupMenu/PopupMenu"
import ReactTooltip from 'react-tooltip'
import "../../styles/Actions/ActionsMenu.scss"

function ActionsMenu(props) {
    let store = useStore()
    let [isExpanded, setIsExpanded] = useState(false);

    return (
        <div>
            <div data-effect="solid" data-tip="Select Actions" className="top-band">
                <svg className="actions-button-icon"
                    onClick={() => setIsExpanded(true)}
                    alt="actions"
                    width="18" height="24" viewBox="0 0 18 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M13.8766 0.102006C14.0234 0.187114 14.137 0.319492 14.1988 0.477513C14.2607 0.635534 14.2671 0.809858 14.2171 0.972006L11.5156 9.75001H16.5001C16.6465 9.74995 16.7898 9.79278 16.9122 9.87323C17.0347 9.95368 17.1308 10.0682 17.1889 10.2027C17.247 10.3372 17.2644 10.4857 17.239 10.63C17.2136 10.7743 17.1465 10.9079 17.0461 11.0145L5.04606 23.7645C4.92994 23.888 4.77544 23.9685 4.60772 23.9929C4.43999 24.0173 4.26895 23.9842 4.12246 23.8989C3.97597 23.8137 3.86268 23.6813 3.80104 23.5234C3.73941 23.3656 3.73307 23.1915 3.78306 23.0295L6.48456 14.25H1.50006C1.35357 14.2501 1.21028 14.2072 1.08786 14.1268C0.965449 14.0463 0.869271 13.9318 0.811203 13.7973C0.753135 13.6628 0.735719 13.5143 0.761105 13.37C0.786491 13.2258 0.853568 13.0921 0.954055 12.9855L12.9541 0.235506C13.07 0.112205 13.2243 0.0317594 13.3918 0.00724931C13.5593 -0.0172608 13.7301 0.0156063 13.8766 0.100506V0.102006Z" fill="#FF7E1D" />
                </svg>
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
            <ReactTooltip place="bottom" />
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