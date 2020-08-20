import React from "react"
import Button from "../../components/Button/Button"
import InlineTextEdit from "../../components/InlineTextEdit/InlineTextEdit"

import "../../styles/ProjectCard.scss"

export default function Card(props) {
    return (
        <div className="project-card">
            <InlineTextEdit
                className="project-card-item"
                text={props.card}
                onSave={(text) => props.onSave(props.id, text)}
            />
            <Button
                className="project-card-item"
                handleClick={() => props.onDelete(props.id)}
            >
                Delete
            </Button>
        </div>
    )
}