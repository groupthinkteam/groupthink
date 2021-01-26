import React, { useEffect, useRef } from "react"
import { gsap } from "gsap/all"
import "../../styles/CustomEditor.scss"
import { observer } from "mobx-react-lite";
import { useStore } from "../../store/hook";

function CustomEditor(props) {

    // useEffect(() => {
    //     gsap.to("#toolbar" + props.id, { display: "block", top: "-35px", opacity: 1, duration: 0.2 });
    // }, [props.id])
    const store = useStore()
    let textareaRef = useRef(null);

    useEffect(() => {
        if (props.initialRender) {
            let length = textareaRef.current.value.length
            textareaRef.current.selectionStart = length
            textareaRef.current.selectionEnd = length
        }
        store.textareaRef = textareaRef
    })
    
    return (
        <div className="editor-wrapper" onBlur={props.onLeave}>
            <textarea
                ref={textareaRef}
                style={props.style}
                className="custom-editor"
                id={props.id}
                placeholder={props.placeholder || "Type something here..."}
                value={props.text}
                onClick={props.onClick}
                onChange={props.onChange}
                onBlur={props.onSave}
                disabled={props.disabled}
                spellCheck="false"
                onFocus={props.onFocus}
                href={props.href}
                target={props.target}
                autoFocus
            />
        </div>
    )
}

export default observer( CustomEditor);