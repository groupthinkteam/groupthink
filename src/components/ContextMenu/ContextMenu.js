import { observer } from "mobx-react-lite"
import React from "react"
import { useStore } from "../../store/hook"
import { resizeDimension } from "../DocumentCanvas/Cards/cardTypeUtils";
import "./ContextMenu.scss";

function ContextMenu({ id, loaderCallback, closeContextMenu }) {
    let store = useStore()
    const me = store.cards[id]
    const imageHeight = me.content?.height;
    const imageWidth = me.content?.width
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
                    //aspect 400
                    
                    store.resize(id, { height: me.content.displayHeight+60 , width: me.content.displayWidth+25  })
                }
            },
            {
                label: "Resize to Small",
                onClick: () => {
                    //aspect 400*0.5
                    const [displayHeight, displayWidth] = resizeDimension(imageHeight, imageWidth,200);
                    store.resize(id, { height: displayHeight+60, width: displayWidth+25 })
                }
            },
            {
                label: "Resize to Large",
                onClick: () => {
                    //aspect 400*3
                    const [displayHeight, displayWidth] = resizeDimension(imageHeight, imageWidth,1200);
                    store.resize(id, { height: displayHeight+60, width: displayWidth+25 })
                }
            },
            {
                label: "Resize to Medium",
                onClick: () => {
                    //aspect 400*1.5
                    const [displayHeight, displayWidth] = resizeDimension(imageHeight, imageWidth,600);
                    store.resize(id, { height: displayHeight+60, width: displayWidth+25 })
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
                store.removeCard(id, "reparent", me["parent"]);
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