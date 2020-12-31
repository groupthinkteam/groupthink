import React, { useEffect, useRef } from "react"
import { gsap } from "gsap/all"
import "../../styles/CustomEditor.scss"

function CustomEditor(props) {

    useEffect(() => {
        gsap.to("#toolbar" + props.id, { display: "block", top: "-35px", opacity: 1, duration: 0.2 });
    }, [props.id])

    let textareaRef = useRef(null);
    return (
        <div className="editor-wrapper" onBlur={props.onLeave}>
            <div className={"toolbar"} id={"toolbar" + props.id}>
                <button onClick={() => { textareaRef.current.select() }}>bold</button>
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