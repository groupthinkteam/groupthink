import React, { useEffect, useRef } from "react"
import { gsap } from "gsap/all"
import "../../styles/CustomEditor.scss"

function CustomEditor(props) {

    // useEffect(() => {
    //     gsap.to("#toolbar" + props.id, { display: "block", top: "-35px", opacity: 1, duration: 0.2 });
    // }, [props.id])

    let textareaRef = useRef(null);

    useEffect(() => {
        if (props.initialRender) {
            let length = textareaRef.current.value.length
            textareaRef.current.selectionStart = length
            textareaRef.current.selectionEnd = length
        }
    })
    const formatText = (event) => {
        let start = textareaRef.current.selectionStart;
        let end = textareaRef.current.selectionEnd;
        let newText;
        switch (event) {
            case 'bold':
                newText = props.text.substring(0, start) + "**" + props.text.substring(start, end) + "**" + props.text.substring(end, props.text.length);
                break;
            case 'head':
                newText = props.text.substring(0, start) + " # " + props.text.substring(start, props.text.length);
                break;
            case "italic":
                newText = props.text.substring(0, start) + "*" + props.text.substring(start, end) + "*" + props.text.substring(end, props.text.length);
                break;
                case "underline":
                newText = props.text.substring(0, start) + "<u>" + props.text.substring(start, end) + "</u>" + props.text.substring(end, props.text.length);
                break;
            default: break;
        }
        props.onChange({ target: { value: newText } });
        textareaRef.current.focus();
        textareaRef.current.selectionEnd = end - 2;
    }
    return (
        <div className="editor-wrapper" onBlur={props.onLeave}>
            <div className={"toolbar"} id={"toolbar" + props.id}>
                <button onClick={() => formatText('bold')}>bold</button>
                <button onClick={()=>formatText('italic')}>Italic</button>
                <button onClick={() => formatText('head')}>head1</button>
                <button onClick={() => formatText('underline')}>underline</button>
            </div>
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