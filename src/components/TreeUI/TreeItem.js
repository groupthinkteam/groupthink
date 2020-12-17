import React from "react"
import { observer } from "mobx-react-lite";
import { useStore } from "../../store/hook";

import "../../styles/TreeUI/TreeUI.scss";

function TreeItem(props) {
    let store = useStore()
    if (props.cardID === "dummy") return null;
    return (
        <div className="treeitem">
            <div className="content">{props.cardID}</div>
        </div>
    )
}

export default observer(TreeItem)