import { observer } from "mobx-react-lite"
import React from "react"
import { useStore } from "../../store/hook"
import "./ContextMenu.scss";

function ContextMenu({ id, loaderCallback, closeContextMenu }) {
    let store = useStore()
    const me = store.cards[id]
    const imageHeight = me.content?.displayHeight + 60;
    const imageWidth = me.content?.displayWidth + 25
    let cardSpecificOptions = {
        "text": [
        ],
        "audio": [
            {
                label: "Replace File",
                onClick: () => { store.convertCardToBlank(id); closeContextMenu(); }
            }
        ],
        "blank": [],
        "file": [
            {
                label: "Replace File",
                onClick: () => { store.convertCardToBlank(id); closeContextMenu(); }
            }
        ],
        "image": [
            {
                label: "Default Size",
                onClick: () => {
                    store.resize(id, { height: me.content.displayHeight + 60, width: me.content.displayWidth + 14 })
                }
            },
            {
                label: "Resize to Small",
                onClick: () => {
                    store.resize(id, { height: imageHeight * 0.75, width: imageWidth * 0.75 })
                }
            },
            {
                label: "Resize to Large",
                onClick: () => {
                    store.resize(id, { height: imageHeight * 3, width: imageWidth * 3 })
                }
            },
            {
                label: "Resize to Medium",
                onClick: () => {
                    store.resize(id, { height: imageHeight * 1.5, width: imageWidth * 1.5 })
                }
            },
            {
                label: "Replace File",
                onClick: () => { store.convertCardToBlank(id); closeContextMenu(); }
            }
        ],
        "link": [
            {
                label: "Edit Link",
                onClick: () => { store.convertCardToBlank(id, me.type); closeContextMenu(); }
            }
        ],
        "VideoLink": [
            {
                label: "Edit Link",
                onClick: () => { store.convertCardToBlank(id, me.type); closeContextMenu(); }
            },
        ],
        "VideoFile": [
            {
                label: "Replace File",
                onClick: () => { store.convertCardToBlank(id); closeContextMenu(); }
            }
        ]
    }

    let commonOptions = [
        {
            label: "Add child",
            onClick: () => {
                store.addCard(
                    { x: me.position.x + 50, y: me.position.y + me.size.height + 50 },
                    { width: 275, height: 45 },
                    id, 'blank'
                );
                closeContextMenu();
            }
        },
        {
            label: 'Delete',
            onClick: () => {
                store.removeCard(id, "recursive", me["parent"]);
                closeContextMenu();
            }
        }
    ]

    return (
        <div className="context-menu">
            {
                commonOptions.map(
                    ({ label, onClick }, index) =>
                        <ContextMenuItem key={index} label={label} onClickHandler={() => { onClick(); closeContextMenu() }} />)
            }
            {
                cardSpecificOptions[me.type]
                    .map(
                        ({ label, onClick }, index) =>
                            <ContextMenuItem key={index} label={label} me={me} onClickHandler={() => { onClick(); closeContextMenu() }} />)
            }
        </div>
    )
}

function ContextMenuItem({ label, onClickHandler, me }) {
    if (label === 'Default Size' && me.size.height === me.content.displayHeight + 60)
        return null
    else
        return <p style={{ cursor: 'pointer' }} onClick={onClickHandler}>{label}</p>;
}

export default observer(ContextMenu)