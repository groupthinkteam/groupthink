import React from "react"
import Button from "../../components/Button/Button"
import InlineTextEdit from "../../components/InlineTextEdit/InlineTextEdit"

import "../../styles/ProjectCard.scss"
import "../../styles/custom.scss"

function Card(props) {
    if (props.addNew) {
        return (
            <div className="project-card text_card">
                <Button className="custom_btn" handleClick={props.onAddNew}>
                    Create New Project
                </Button>
            </div>
        )
    }
    else {
        return (
            <div className="project-card img_card">
                {
                    props.card.shared ? <div>Shared By :- {props.card.shared.name} <br/> Shared Type : {props.card.shared.type}</div> 
                    :<div>Owner</div>
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
                            style={{marginBottom: "5px"}}
                            handleClick={() => props.onDelete(props.id)}>
                            Delete
                        </Button>
                    </>
                    :<>Project Name: {props.card.name}</>
                }
                
            </div>
        )
    }
}
export default React.memo(Card)