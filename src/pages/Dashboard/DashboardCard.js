import React from "react"
import Button from "../../components/Button/Button"
import TimeAgo from "react-timeago"

import { useStore } from "../../store/hook"
import { observer } from "mobx-react-lite"

import "../../styles/DashboardCard.scss"
import "../../styles/custom.scss"


const DashboardCard = props => {
    let { projects, deleteProject } = useStore();
    let me = projects[props.id]    

    if (!me.metadata) return null;
    return (
        <div id={props.id} className="dashboard-card">
            <div className="card-row">
                <div className="title" onClick={props.onOpen}>
                    {me.metadata.name}
                </div>
            </div>
            <div className="card-row">
                <div className="card-description">
                    created <TimeAgo date={me.metadata.datecreated} />
                </div>
                <div>
                    {props.shared ? "shared" :null}
                </div>
                <Button
                    // className="custom_btn"
                    handleClick={() => deleteProject(props.id)}>
                    Delete
            </Button>
            </div>
        </div>
    )
}

export default observer(DashboardCard)