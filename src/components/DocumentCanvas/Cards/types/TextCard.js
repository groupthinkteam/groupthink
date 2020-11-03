import React from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../../store/hook";

import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css'

/**
* This File Saves Text And Shows it from Database .   
* @param {*} props - Property of File .
* @property `typeAPI` , `content` , `id`*/


function TextCard(props) {
    let store = useStore()
    let me = store.cards[props.id]

    return (
        <div className="text-node" style={{ overflowX: "hidden", overflowY: "auto", width: "100%", height: "100%" }}>
            <ReactQuill value={me.content.text} onChange={(value) => { props.typeAPI.saveContent(props.id, { text: value || "" }) }} />
        </div>
    )
}
export default observer(TextCard);