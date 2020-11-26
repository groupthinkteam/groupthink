import { observer } from "mobx-react-lite"
import React from "react"
import { useStore } from "../../store/hook"
import "./ContextMenu.scss"
import ReplaceFileList from "../DocumentCanvas/Cards/MenuList/ReplaceFileList"

function ContextMenu({ id, loaderCallback, closeContextMenu, enableEditLink }) {
    let store = useStore()
    let me = store.cards[id]
    const convLinks = (citationStyle) => {
        loaderCallback(true)
        // TODO if bool is false, the operation failed, show error
        store.convertLinksToCitation(id, citationStyle, (bool) => loaderCallback(false));
        closeContextMenu();
    }

    let cardSpecificOptions = {
        "text": [
            {
                label: "Generate Citation / APA Citation",
                onClick: () => convLinks("apa")
            },
            {
                label: "Vancouver Style",
                onClick: () => convLinks("vancouver")
            },
            {
                label: "Harvard Style",
                onClick: () => convLinks("harvard1")
            }
        ],
        "audio": [
            {
                label: "Replace File",
                onClick: ()=>{store.converCardToBlank(id); closeContextMenu();} 
            }
        ],
        "blank": [],
        "file": [
            {
                label: "Replace File",
                onClick: () => {store.converCardToBlank(id); closeContextMenu();}
            }
        ],
        "image": [
            {
                label: "Apply B/W Filter",
                onClick: () => {
                    loaderCallback(true);
                    store.convertImageToBW(
                        me.content.metadata.fullPath,
                        me.content.metadata.contentType,
                        me.content.metadata.customMetadata,
                        (bool) => loaderCallback(false)
                    );
                }
            },
            {
                label: "Replace File",
                onClick: () => {store.converCardToBlank(id); closeContextMenu();}
            }
        ],
        "link": [
            {
                label: "Edit Link",
                onClick: function edit() { }
            }
        ],
        "VideoLink": [
            {
                label: "Edit Link",
                onClick: () => {}
            }
        ],
        "VideoFile": [
            {
                label: "Replace File",
                onClick: () =>{ store.converCardToBlank(id); closeContextMenu(); }
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
                        <ContextMenuItem key={index} label={label} onClickHandler={onClick} />)
            }
            <hr className="separator" />
            {
                cardSpecificOptions[me.type].map(
                    ({ label, onClick }, index) =>
                        <ContextMenuItem key={index} label={label} onClickHandler={onClick} />)
            }
        </div>
    )
}

function ContextMenuItem({ label, onClickHandler }) {
    return <p style={{ cursor: 'pointer' }} onClick={onClickHandler}>{label}</p>;
}

export default observer(ContextMenu)