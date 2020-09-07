import React from "react";
import TextCard from "./types/TextCard";
import Button from "../../Button/Button";
import "../../../styles/Cards/GenericCard.scss";

// props
// --------
// id:
// type:
// content: 
// cardAPI:
// --------

export default function GenericCard(props) {

    let onContentChange = (content) => props.cardAPI.change(props.id, content);
    let onSave = (content) => props.cardAPI.save(props.id, content);

    return (
        <div className="card">
            <div className="card-handle card-title-bar">
                <Button handleClick={() => props.cardAPI.remove(props.id)}>
                    X
                </Button>
            </div>
            <TextCard
                content={props.content}
                onContentChange={(text) => onContentChange(text)}
                onSave={(text) => onSave(text)}
            />
        </div>
    )
}