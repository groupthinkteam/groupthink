import React from "react"
//import Button from "../../components/Button/Button"
import InlineTextEdit from "../../components/InlineTextEdit/InlineTextEdit"

import "../../styles/ProjectCard.scss"
import { Card as BootCard ,Button as BootButton } from "react-bootstrap"

export default function Card(props) {
    if (props.addNew) {
        return (
            <div className="project-card">
                <BootButton onClick={props.onAddNew} variant='outline-dark'>
                    Add New Card
                </BootButton>
            </div>
        )
    }
    else return (
        <div className="project-card">
            
            <BootCard style={{width:'200px',height:'300px'}}>
                <BootCard.Img onClick={() => props.onOpen(props.id,props.card.thumbnailURL)}
                src={props.card.thumbnailURL}
                alt="project thumbnail"
                 />
                <InlineTextEdit
                    className="project-card-item"
                    text={props.card.name}
                    onSave={(text) => props.onSave(props.id, text)}
                />
                <BootButton
                   variant="outline-danger"
                   className="project-card-item"
                   onClick={() => props.onDelete(props.id)}
                >
                    Delete
                </BootButton>
                
            </BootCard>
        </div>
    )
}
/**
 * <img
                onClick={() => props.onOpen(props.id,props.card.thumbnailURL)}
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
 */