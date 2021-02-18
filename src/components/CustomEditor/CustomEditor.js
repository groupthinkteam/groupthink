import React, { useEffect, useRef } from "react"
import { gsap } from "gsap/all"
import "../../styles/CustomEditor.scss"
import { observer } from "mobx-react-lite";
import { useStore } from "../../store/hook";
import ContentEditable from "react-contenteditable";

function CustomEditor(props) {

    // useEffect(() => {
    //     gsap.to("#toolbar" + props.id, { display: "block", top: "-35px", opacity: 1, duration: 0.2 });
    // }, [props.id])
    const store = useStore();
    const contentEditable = useRef(null);
    let textareaRef = useRef(null);

    useEffect(() => {
        if (props.initialRender) {
            // var length = textareaRef.current.innerHTML?.length;
            contentEditable.current?.focus()
        }
        const selection = window.getSelection();
        if (selection.isCollapsed) {
            contentEditable.current.selectionStart = selection.anchorOffset
            contentEditable.current.selectionEnd = selection.anchorOffset;
        } else {
            contentEditable.current.selectionStart = Math.min(selection.anchorOffset, selection.focusOffset)
            contentEditable.current.selectionEnd = Math.max(selection.anchorOffset, selection.focusOffset);
        }
        store.textareaRef = contentEditable;
        console.log("TEXTAREA ", window.getSelection(), { start: contentEditable.current.selectionStart, end: contentEditable.current.selectionEnd });
    })

    return (
        <div className="editor-wrapper"  >
            <button onclick={()=>contentEditable.current.contentDocument.execCommand('bold',false,null)}>Bold</button>
            <ContentEditable
                innerRef={contentEditable}
                ref={textareaRef}
                html={props.text}
                style={props.style}
                className="custom-editor"
                id={props.id}
                data-placeholder={props.placeholder || "Type something here..."}
                onChange={props.onChange}
                onBlur={props.onSave}
                onFocus={props.onFocus}
                
            />
        </div>
    )
}

export default observer(CustomEditor);