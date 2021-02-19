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
            <div data-delay-show='750' data-effect="solid" data-tip="Select Actions" className="top-band">
                <svg className="actions-button-icon"
                    onClick={() => setIsExpanded(true)}
                    alt="actions"
                    width="24" height="24" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0)">
                        <path fillRule="evenodd" clipRule="evenodd" d="M16.8766 0.102006C17.0234 0.187114 17.137 0.319492 17.1988 0.477513C17.2607 0.635534 17.2671 0.809858 17.2171 0.972006L14.5156 9.75001H19.5001C19.6465 9.74995 19.7898 9.79278 19.9122 9.87323C20.0347 9.95368 20.1308 10.0682 20.1889 10.2027C20.247 10.3372 20.2644 10.4857 20.239 10.63C20.2136 10.7743 20.1465 10.9079 20.0461 11.0145L8.04606 23.7645C7.92994 23.888 7.77544 23.9685 7.60772 23.9929C7.43999 24.0173 7.26895 23.9842 7.12246 23.8989C6.97597 23.8137 6.86268 23.6813 6.80104 23.5234C6.73941 23.3656 6.73307 23.1915 6.78306 23.0295L9.48456 14.25H4.50006C4.35357 14.2501 4.21028 14.2072 4.08786 14.1268C3.96545 14.0463 3.86927 13.9318 3.8112 13.7973C3.75313 13.6628 3.73572 13.5143 3.76111 13.37C3.78649 13.2258 3.85357 13.0921 3.95405 12.9855L15.9541 0.235506C16.07 0.112205 16.2243 0.0317594 16.3918 0.00724931C16.5593 -0.0172608 16.7301 0.0156063 16.8766 0.100506V0.102006Z" fill="#FF7E1D" />
                    </g>
                    <defs>
                        <clipPath id="clip0">
                            <rect width="24" height="24" fill="white" />
                        </clipPath>
                    </defs>
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
            <ReactTooltip globalEventOff="click" eventOff="click" place="bottom" />
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
            <div className="icon">
                <img src={action.icon} alt="icon" />
            </div>
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