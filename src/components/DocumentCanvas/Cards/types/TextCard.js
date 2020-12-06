import React, { useRef, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../../store/hook";

import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css'

function TextCard(props) {
    const store = useStore();
    const quillRef = useRef(null);
    const me = store.cards[props.id];
    const pointerAtLast = () => {
        if (quillRef.current) {
            var quillEditor = quillRef.current.getEditor();
            console.log("EDITOR ", quillEditor.getText().length - 1, quillEditor.getSelection())
            const selectionIndex = quillEditor.getSelection()?.index;
            quillEditor.setSelection(selectionIndex ? selectionIndex : quillEditor.getText().length - 1, 0);
        }
    }
    useEffect(() => {
        if (store.currentActive === props.id && quillRef.current) {
            quillRef.current.focus();
        }
    }, [props.id, store.currentActive]);

    let modules = {
        toolbar: ['bold', 'italic', 'underline', 'strike']
    }

    return (
        <div className="text-node" style={{ overflowX: "hidden", overflowY: "auto", width: "100%", height: "100%" }}>
            <ReactQuill ref={quillRef}
                theme="snow"
                value={me.content.text}
                modules={modules}
                onFocus={pointerAtLast}
                onChange={(value) => { props.typeAPI.saveContent(props.id, { text: value || "" }) }} />
        </div>
    )
}
export default observer(TextCard);