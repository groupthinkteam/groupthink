import React from "react"
import Button from "../../components/Button/Button"
import InlineTextEdit from "../../components/InlineTextEdit/InlineTextEdit"
import { gsap } from "gsap/all"

import "../../styles/ProjectCard.scss"
import "../../styles/custom.scss"

function Card(props) {
    const createdAt = props.card?.createdAt;
    const DateNow = Date.now();
    //console.log("DATES \n", new Date(createdAt).toTimeString(), new Date((DateNow-createdAt)).toUTCString() )
    if (props.addNew) {
        return (
            <div className="project-card">
                <Button className="custom_btn" handleClick={props.onAddNew}>
                    Create New Project
                </Button>
            </div>
        )
    }
    else {
        return (
            <div id={props.id} className="project-card">
                
                {
                    props.card.shared ? <div>Shared By :- {props.card.shared.name} <br /> Shared Type : {props.card.shared.type}</div>
                        : null
                }
                <img
                    onClick={() => props.onOpen(props.id)}
                    src={props.card.thumbnailURL}
                    alt="project thumbnail" />

                {
                    props.card.shared === undefined ?
                        <>
                            <InlineTextEdit
                                className="project-card-item"
                                text={props.card.name}
                                onChange={(event) => props.onChange(props.id, event.target.value)}
                                onSave={() => props.onSave(props.id)}
                            />
                            <Button
                                className="project-card-item custom_btn highlight"
                                style={{ marginBottom: "5px" }}
                                handleClick={() => props.onDelete(props.id)}>
                                Delete
                        </Button>
                        <p>Last Modified At : {new Date(createdAt).toDateString()}</p>
                        <p>Last Modified On : {new Date(createdAt).toTimeString()} </p>
                        </>
                        : 
                        <>
                        Project Name: {props.card.name}
                        <p>Last Modified At : {new Date(createdAt).toDateString()}</p>
                        <p>Last Modified On : {new Date(createdAt).toTimeString()} </p>
                        </>
                }

            </div>
        )
    }
}
export default React.memo(Card)