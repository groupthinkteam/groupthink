import React, { useState, useEffect } from 'react'
import { observer } from "mobx-react-lite"
import { useStore } from "../../store/hook"
import Popup from "../PopupMenu/PopupMenu"
import "../../styles/ChooseTemplate/ChooseTemplate.scss"

const ChooseTemplate = (props) => {
    let store = useStore();
    let [isExpanded, setIsExpanded] = useState(false);

    return (
        <div>
            <button className="addnew" onClick={() => setIsExpanded(true)}>
                + Create
              </button>
            {isExpanded ?

                <Popup handleClose={() => { setIsExpanded(false) }}>
                    <div className="actions-container">
                        <div className="title">
                            Templates 
                        </div>
                        <div className="subtitle">
                            Choose a template or start a blank project.
                        </div>
                        <div className="grid">
                                {Object.entries(store.templatesList).map(
                                    ([id, template]) => {
                                        return (
                                            <TemplateItem key={id} template={template}
                                                onClick={() => {
                                                    store.useTemplate(id, projectid => props.openProject(projectid))
                                                    setIsExpanded(false)
                                                }} />
                                        )
                                    }
                                )}
                        </div>
                    </div>
                </Popup>

                : null}
        </div>
    )
}

function TemplateItem({ template, onClick }) {
    return (
        <div className="action-item" onClick={onClick}>
            <div className="icon"></div>
            <div className="content">
                <div className="title">
                    {template.title}
                </div>
                <div className="description">
                    {template.description}
                </div>
            </div>
        </div>
    )
}

export default ChooseTemplate;