import React from "react"
import Button from "../../components/Button/Button"
import InlineTextEdit from "../../components/InlineTextEdit/InlineTextEdit"

import { useStore } from "../../store/hook"
import { observer } from "mobx-react-lite"

import "../../styles/ProjectCard.scss"
import "../../styles/custom.scss"


const Card = observer(props =>{
    let store = useStore();
    let me = store.projects[props.id]
    console.log("CARDS ",me, props.id)
    if (props.addNew) {
        return (
            <div className="project-card">
                <Button className="custom_btn" handleClick={()=>store.addNewProject()}>
                    Create New Project
                </Button>
            </div>
        )
    }
    else {
        return (
            <div id={props.id} className="project-card">
                <img
                    onClick={() => props.onOpen(props.id)}
                    src={me.thumbnailURL}
                    alt="project thumbnail" />
                <InlineTextEdit
                    className="project-card-item"
                    text={me.name}
                    onChange={(event) => me.title = event.target.value}
                    onSave={() => { return }} />
                <Button
                    className="project-card-item custom_btn highlight"
                    style={{ marginBottom: "5px" }}
                    handleClick={() => store.deleteProject(props.id)}>
                    Delete
                </Button>
            </div>
        )
    }
})
export default Card