import React from "react"
import TextareaAutosize from "react-textarea-autosize"
import "../../styles/CustomEditor.scss"

function CustomEditor(props) {
    return (
        <textarea
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
    )
}

export default React.memo(CustomEditor);