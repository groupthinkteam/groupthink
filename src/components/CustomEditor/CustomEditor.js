import React, { useRef } from "react"
import "../../styles/CustomEditor.scss"

function CustomEditor(props) {
    let textareaRef = useRef(null);
    return (
        <div className="editor-wrapper" onBlur={props.onLeave}>
            <button onClick={() => { textareaRef.current.select() }}>bold</button>
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

export default React.memo(CustomEditor);