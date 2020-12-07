import React, { useRef, useEffect } from "react";

import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css'

function TextCard(props) {
    const quillRef = useRef(null);
    const me = props.typeAPI.cards[props.id];
    const pointerAtLast = () => {
        if (quillRef.current) {
            var quillEditor = quillRef.current.getEditor();
            const selectionIndex = quillEditor.getSelection()?.index;
            const totalTextLength = quillEditor.getText().length - 1;
            console.log(selectionIndex ? "Selection Index" : "LENGTh", selectionIndex)
            quillEditor.setSelection(selectionIndex ? selectionIndex : totalTextLength, 0);
        }
    }
    const pasteAtLast = (text) => {
        var quillEditor = quillRef.current.getEditor();
        const selectionIndex = quillEditor.getSelection().index;
        setTimeout(() => {
            quillEditor.setSelection(selectionIndex + text.length, 0);
        }, 1)
    }

    useEffect(() => {
        if (props.typeAPI.currentActive === props.id && quillRef.current) {
            quillRef.current.focus();
            if (me.content.lastEditedby !== props.typeAPI.userID) {
                var quillEditor = quillRef.current.getEditor();
                quillEditor.enable(false)
            }
        }
    }, [props.id, props.typeAPI.currentActive, me.content.lastEditedby, props.typeAPI.userID]);

    let modules = {
        toolbar: ['bold', 'italic', 'underline', 'strike']
    }

    const onChangeQuill = (value) => {
        if (me.content.lastEditedby === props.typeAPI.userID) {
            props.typeAPI.saveContent(props.id, { text: value || "", lastEditedby: props.typeAPI.userID })
        }
    }
    return (
        <div className="text-node" onPaste={(e) => { pasteAtLast(e.clipboardData.getData('Text')) }} style={{ overflowX: "hidden", overflowY: "auto", width: "100%", height: "100%" }}>
            <ReactQuill ref={quillRef}
                theme="snow"
                value={me.content.text}
                modules={modules}
                onFocus={pointerAtLast}
                onChange={(value) => onChangeQuill(value)} />
        </div>
    )
}
export default TextCard;