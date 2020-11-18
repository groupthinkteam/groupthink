import React, { useRef, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../../store/hook";

import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css'

/**
* This File Saves Text And Shows it from Database .   
* @param {*} props - Property of File .
* @property `typeAPI` , `content` , `id`*/


function TextCard(props) {
    const store = useStore();
    const quillRef = useRef(null);
    const me = store.cards[props.id];
    useEffect(()=>{
        if (store.currentActive === props.id && quillRef.current) {
            quillRef.current.focus();
            var quillEditor = quillRef.current.getEditor();
            quillEditor.setSelection(quillEditor.getSelection().index + me.content.text.length, 0);
        }
        
    },[props.id,store.currentActive,me.content.text]);
    return (
        <div className="text-node" style={{ overflowX: "hidden", overflowY: "auto", width: "100%", height: "100%" }}>
            <ReactQuill  ref={quillRef} theme="snow" value={me.content.text} onChange={(value) => { props.typeAPI.saveContent(props.id, { text: value || "" }) }} />
        </div>
    )
}
export default observer(TextCard);