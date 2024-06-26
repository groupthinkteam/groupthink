import React from "react"
import TextareaAutosize from "react-textarea-autosize"
import "../../styles/InlineTextEdit.scss"

function InlineTextEdit(props, ref) {

    let prevStyle = {
        margin: props.margin || "5px 5px 5px 5px",
        fontWeight: props.bold ? "bold" : "normal",
        width: props.widthOffset ? 'calc(100% - ' + props.widthOffset + 'px)' : "95%",
        height: "auto",
        fontSize: "12px",
        fontFamily: props.fontFamily || "Open Sans, Varela Round, sans-serif",
        textDecorationLine: props.strikethrough ? "line-through" : "none",
        color: props.color || "black",
        cursor: "initial",
        borderColor: props.borderColor,
        overflow: "visible"
    }
    if (props.style) {
        Object.entries(props.style).map(([key, value]) => prevStyle = { ...prevStyle, [key]: value })
    }
    return (

        <TextareaAutosize
            style={prevStyle}
            className={props.className || "inline-input"}
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
            ref={ref}
            onKeyDown={props.onKeyDown}
            // contentEditable="true"
            // dangerouslySetInnerHTML={{__html: props.text}}
            allowFullScreen={props.allowFullScreen}
        />
    )
}
const ForwardRef = React.forwardRef(InlineTextEdit);
export default React.memo(ForwardRef);