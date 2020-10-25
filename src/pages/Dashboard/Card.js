import React from "react"
import Button from "../../components/Button/Button"
import InlineTextEdit from "../../components/InlineTextEdit/InlineTextEdit"

import { useStore} from "../../store/hook"
import { observer } from "mobx-react-lite"

import "../../styles/ProjectCard.scss"
import "../../styles/custom.scss"
import { useHistory } from "react-router-dom"


const Card = observer(props => {
    let {projects , addNewProject , sync , renameProject , deleteProject,setProjectID} = useStore();
    let me = projects[props.id]
    const history = useHistory();

    const onOpen = () => {
        setProjectID(props.id);
        history.push("/project/" + props.id)
    }

    if (props.addNew) {
        return (
            <div className="project-card">
                <Button className="custom_btn" handleClick={() => addNewProject()}>
                    Create New Project
                </Button>
            </div>
        )
    }
    else {
        return (
            <div id={props.id} className="project-card">
                <img
                    onClick={onOpen}
                    src={me.thumbnailURL}
                    alt="project thumbnail" />
                <InlineTextEdit
                    className="project-card-item"
                    text={me.name}
                    onChange={(event) => sync("projects", props.id + ".name", event.target.value)}
                    onSave={(event) => renameProject(props.id, event.target.value)} />
                <Button
                    className="project-card-item custom_btn highlight"
                    style={{ marginBottom: "5px" }}
                    handleClick={() => deleteProject(props.id)}>
                    Delete
                </Button>
            </div>
        )
    }
})
export default Card