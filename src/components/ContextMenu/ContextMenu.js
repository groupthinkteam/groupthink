import { observer } from "mobx-react-lite"
import React, { useState } from "react"
import { useStore } from "../../store/hook"
import "./ContextMenu.scss"

function ContextMenu({ id, loaderCallback, closeCallback }) {
    let store = useStore()
    let parentCard = store.cards[id]
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
            onClick: function addChild() {
                store.addCard({ x: parentCard.position.x + 50, y: parentCard.position.y + parentCard.size.height + 50 }, { width: 275, height: 45 }, id, 'blank')
            }
        },
    ]

    return (
        <div className="context-menu">
            {
                commonOptions.map(
                    ({ label, onClick }, index) =>
                        <ContextMenuItem key={index} label={label} onClickHandler={() => { onClick(); closeCallback() }} />)
            }
            <hr className="separator" />
            {
                cardSpecificOptions[parentCard.type].map(
                    ({ label, onClick }, index) =>
                        <ContextMenuItem key={index} label={label} onClickHandler={() => { onClick(); closeCallback() }} />)
            }
        </div>
    )
}

function ContextMenuItem({ label, onClickHandler }) {
    return (
        <div className="item" onClick={onClickHandler}>
            {label}
        </div>
    );
}

export default observer(ContextMenu)