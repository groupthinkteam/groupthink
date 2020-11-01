import React from "react"

export default function SearchItem(props) {
    return (
        <div id={props.id}>
            <span className="container"
                style={{ columns: 2, cursor: 'pointer' }}
                onClick={props.onClick}>
                ID:{props.id}
            </span>
            <span>
                Field : {props.field}
            </span>
            <hr />
        </div>
    )
}