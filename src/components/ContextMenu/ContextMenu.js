import { observer } from "mobx-react-lite"
import React, { useState } from "react"
import { useStore } from "../../store/hook"
import "./ContextMenu.scss"

function ContextMenu({ id, loaderCallback }) {
    let store = useStore()
    let me = store.cards
    let cardSpecificOptions = {
        "text": [
            {
                label: "Generate Citation",
                onClick: function cite() { }
            }
        ],
        "audio": [],
        "blank": [],
        "file": [
            {
                label: "Replace File",
                onClick: function replace() { }
            }
        ],
        "image": [
            {
                label: "Apply B/W Filter",
                onClick: function bwfilter() { }
            }
        ],
        "link": [
            {
                label: "Edit Link",
                onClick: function edit() { }
            }
        ],
        "onlinevideo": [
            {
                label: "Edit Link",
                onClick: function edit() { }
            }
        ],
        "video": [
            {
                label: "Replace Video",
                onClick: function replace() { }
            }
        ]
    }

    let commonOptions = [
        {
            label: "Add child",
            onClick: function addChild() { }
        },
    ]

    return (
        <div className="context-menu">
            {
                commonOptions.map(
                    ({ label, onClick }, index) =>
                        <ContextMenuItem key={index} label={label} onClickHandler={onClick} />)
            }
            <hr className="separator" />
            {
                cardSpecificOptions[store.cards[id].type].map(
                    ({ label, onClick }, index) =>
                        <ContextMenuItem key={index} label={label} onClickHandler={onClick} />)
            }
        </div>
    )
}

function ContextMenuItem({ label, onClickHandler }) {
    return (
        <div className="item">
            {label}
        </div>
    );
}

export default observer(ContextMenu)