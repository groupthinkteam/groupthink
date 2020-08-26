import React, { useState } from "react"

import "../../styles/InlineTextEdit.scss"

export default function InlineTextEdit(props) {
    let [text, setText] = useState(props.text)
    return (
        <input
            className="inline-input"
            style={{ width: text.length + 'ch' }}
            placeholder="Enter Project Name"
            value={text}
            onChange={(event) => setText(event.target.value)}
            onBlur={() => props.onSave(text)}
        />
    )
}