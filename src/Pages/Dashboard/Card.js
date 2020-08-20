import React from "react"
import Button from "../../components/Button/Button"
import InlineTextEdit from "../../components/InlineTextEdit/InlineTextEdit"

import "../../styles/ProjectCard.scss"

export default function Card(props) {
    if (props.addNew) {
        return (
            <div className="project-card">
                <Button handleClick={props.onAddNew}>
                    Add New Card
                </Button>
            </div>
        )
    }
    else return (
        <div className="project-card">
            <img
                onClick={() => props.onOpen(props.id)}
                src={props.card.thumbnailURL}
                alt="project thumbnail" />
            <InlineTextEdit
                className="project-card-item"
                text={props.card.name}
                onSave={(text) => props.onSave(props.id, text)} />
            <Button
                className="project-card-item"
                handleClick={() => props.onDelete(props.id)}>
                Delete
            </Button>
        </div>
    )
}