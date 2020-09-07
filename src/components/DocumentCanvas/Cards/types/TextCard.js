import React from "react";
import InlineTextEdit from "../../../InlineTextEdit/InlineTextEdit"

export default function TextCard(props) {
    return (
        <div className="text-node">
            <InlineTextEdit
                onChange={(event) => props.onContentChange({ text: event.target.value })}
                onSave={() => props.onSave({ text: props.content.text })}
                text={props.content.text}
                lwidth={"100px"}
            />
        </div>
    )
}