import React from "react";
import InlineTextEdit from "../../../InlineTextEdit/InlineTextEdit"
import Highlight from 'react-highlighter';
/**
* This File Saves Text And Shows it from Database .   
* @param {*} props - Property of File .
* @property `typeAPI` , `content` , `id`*/
function TextCard(props) {
    console.log("Searchable Text ",props.content.searchable_text);
    const onSave = () => props.typeAPI.saveContent(props.id, { text: props.content.text })
    const onChange = (event) => props.typeAPI.changeContent(props.id, { text: event.target.value })
    return (
        <div className="text-node"  style={{ overflowX: "hidden", overflowY: "auto", width: "100%", height: "100%" }}>
            <InlineTextEdit
                onChange={(e) => onChange(e)}
                onSave={onSave}
                text={props.content.text}
                lwidth={"100px"}
                disabled={props.isLocked}
                search={props.highlightText?.text}
            />
            <Highlight search={props.highlightText?.text}>{props.content.text}</Highlight>
        </div>
    )
}
export default React.memo(TextCard);