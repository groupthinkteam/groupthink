import React from "react";
import { useParams } from "react-router-dom"

export default function Document(props) {
    const { projectID } = useParams();
    console.log(projectID)
    return (
        <p>
            I was given this project ID: {projectID}.
        </p>
    )
}