import React from "react"
import TextareaAutosize from  "react-textarea-autosize"
import "../../styles/InlineTextEdit.scss"

function InlineTextEdit(props) {
    return (
        <TextareaAutosize
            className="inline-input"
            placeholder="Type something here..."
            value={props.text}
            onChange={props.onChange}
            onBlur={props.onSave}
        />
    )
}

export default React.memo(InlineTextEdit)