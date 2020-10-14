import React from "react"
import TextareaAutosize from "react-textarea-autosize"
import "../../styles/InlineTextEdit.scss"

function InlineTextEdit(props) {
    return (
        
        <TextareaAutosize
            style={{ 
                margin: props.margin || "5px 5px 5px 5px", 
                fontWeight: props.bold ? "bold" : "normal", 
                width: props.widthOffset ? 'calc(100% - ' + props.widthOffset + 'px)' : "95%",
                height: "auto",
                fontFamily: props.fontFamily || "Varela Round, sans-serif",
                textDecorationLine: props.strikethrough ? "line-through" : "none",
                color: props.color || "black",
                cursor:"initial",
                borderColor:props.borderColor
            }}
            className="inline-input"
            placeholder={props.placeholder || "Type something here..."}
            value={props.text}
            onChange={props.onChange}
            onBlur={props.onSave}
            disabled={props.disabled}
            spellCheck="false"
            onFocus={props.onFocus}
            autoFocus={props.forceFocus}
        />
    )
}

export default React.memo(InlineTextEdit)