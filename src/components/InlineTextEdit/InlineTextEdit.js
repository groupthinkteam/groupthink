import React from "react"
import TextareaAutosize from  "react-textarea-autosize"
import "../../styles/InlineTextEdit.scss"

export default function InlineTextEdit(props) {
    return (
        <TextareaAutosize
            className="inline-input"
            placeholder="Add a caption..."
            value={props.text}
            onChange={props.onChange}
            onBlur={props.onSave}
        />
    )
}