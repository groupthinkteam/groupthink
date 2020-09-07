import React from "react"
import TextareaAutosize from  "react-textarea-autosize"
import "../../styles/InlineTextEdit.scss"

export default function InlineTextEdit(props) {
    return (
        <TextareaAutosize
            className="inline-input"
            style={{width: props.lwidth || 160, resize: "none"}}
            placeholder="Enter Project Name"
            value={props.text}
            onChange={props.onChange}
            onBlur={props.onSave}
        />
    )
}