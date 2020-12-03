import { observer } from "mobx-react-lite"
import React, { useState } from "react"
import { useStore } from "../../store/hook"
import Popup from "../PopupMenu/PopupMenu"

import "../../styles/Actions/ActionsMenu.scss"

function ActionsMenu(props) {
    let store = useStore()
    let [expanded, setExpanded] = useState(false);

    return (
        <div>
            <svg onClick={() => setExpanded(true)} className="actions-button-icon" width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.5" y="0.5" width="36" height="36" rx="7.5" stroke="#413D45" />
                <g clip-path="url(#clip0)">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M23.1736 7.09777C23.3143 7.17934 23.4232 7.3062 23.4824 7.45763C23.5417 7.60907 23.5479 7.77613 23.4999 7.93152L20.911 16.3438H25.6878C25.8282 16.3437 25.9655 16.3848 26.0828 16.4619C26.2001 16.539 26.2923 16.6487 26.3479 16.7776C26.4036 16.9065 26.4203 17.0488 26.3959 17.1871C26.3716 17.3253 26.3073 17.4534 26.211 17.5556L14.711 29.7743C14.5998 29.8927 14.4517 29.9698 14.291 29.9932C14.1302 30.0166 13.9663 29.9849 13.8259 29.9032C13.6855 29.8215 13.577 29.6946 13.5179 29.5433C13.4588 29.392 13.4528 29.2252 13.5007 29.07L16.0896 20.6563H11.3128C11.1724 20.6563 11.0351 20.6153 10.9178 20.5382C10.8005 20.4611 10.7083 20.3513 10.6526 20.2224C10.597 20.0936 10.5803 19.9512 10.6046 19.813C10.629 19.6747 10.6932 19.5466 10.7895 19.4445L22.2895 7.22571C22.4007 7.10755 22.5485 7.03045 22.709 7.00697C22.8695 6.98348 23.0333 7.01497 23.1736 7.09634V7.09777Z" fill="#FF7E1D" />
                </g>
                <defs>
                    <clipPath id="clip0">
                        <rect width="23" height="23" fill="white" transform="translate(7 7)" />
                    </clipPath>
                </defs>
            </svg>
            {expanded ?
                <Popup handleClose={() => { setExpanded(false) }}>
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
                            {store.actionsList.map(
                                (action) => (
                                    <div className="action-item">
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
                            )}
                        </div>
                    </div>
                </Popup>
                : null}
        </div>
    )
}

export default observer(ActionsMenu)