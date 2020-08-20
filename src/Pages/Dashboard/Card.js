import React from "react"
import Button from "../../components/Button/Button"

export default function Card(props) {
    console.log("card")
    return (
        <div style={{ border: '2px solid black' }}>
            <h1>{props.card}</h1>
            <Button handleClick={() => props.onDelete(props.id)}>
                Delete
            </Button>
        </div>
    )
}