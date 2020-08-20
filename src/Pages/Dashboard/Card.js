import React from "react"

export default function Card(props) {
    console.log("card")
    return (
        <div style={{ border: '2px solid black' }}>
            <h1>{props.card}</h1>
        </div>
    )
}