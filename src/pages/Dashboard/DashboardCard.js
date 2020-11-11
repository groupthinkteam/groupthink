import React from "react"
import Button from "../../components/Button/Button"
import InlineTextEdit from "../../components/InlineTextEdit/InlineTextEdit"

import { useStore } from "../../store/hook"
import { observer } from "mobx-react-lite"

import "../../styles/DashboardCard.scss"
import "../../styles/custom.scss"
import { useHistory, useLocation } from "react-router-dom"


const DashboardCard = props => {
    let { projects, deleteProject, setProjectID } = useStore();
    let me = projects[props.id]
    const history = useHistory();
    const location = useLocation();

    const onOpen = () => {
        setProjectID(props.id);
        history.push("/project/" + props.id, { from: location })
    }
    
    if (!me.metadata) return null;
    return (
        <div id={props.id} className={"dashboard-card"}>
            <div className="card-title" onClick={onOpen}>
                {me.metadata.name}
            </div>
            <Button
                className="custom_btn"
                handleClick={onOpen}>
                Open
            </Button>
            {/* <InlineTextEdit
                    text={me.name}
                    onChange={(event) => sync("projects", props.id + ".name", event.target.value)}
                    onSave={(event) => renameProject(props.id, event.target.value)} /> */}
            <Button
                className="custom_btn"
                handleClick={() => deleteProject(props.id)}>
                Delete
            </Button>
        </div>
    )
}

export default observer(DashboardCard)