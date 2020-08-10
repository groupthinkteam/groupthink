import React from "react"


import "./ProjectCard.scss"

export default function ProjectCard(props) {
    if (props.type === "add") {
        return (
            <div className="project-card">
                <div className="project-card-title">
                    {props.title}
                </div>
            </div>)
    }
    else {
        return (
            <div className="project-card">
                <div className="project-card-title">
                    {props.title}
                </div>
            </div>
        )
    }
}