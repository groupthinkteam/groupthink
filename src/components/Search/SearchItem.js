import React from "react"

export default function SearchItem(props) {
    console.log("matched", props.id)
    return (
        <div id={props.id} className="search-result-item" onClick={props.onClick}>
            <div className="matched-keywords">{props.match}</div>
            <hr className="search-result-separator"/>
        </div>
    )
}