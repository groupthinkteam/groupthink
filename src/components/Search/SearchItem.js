import { observer } from "mobx-react-lite"
import React from "react"

function SearchItem(props) {
    return (
        <div id={"searchitem" + props.id} className="search-result-item" onClick={props.onClick}>
            <div className="matched-keywords">{props.match}</div>
            <hr className="search-result-separator"/>
        </div>
    )
}

export default observer(SearchItem)