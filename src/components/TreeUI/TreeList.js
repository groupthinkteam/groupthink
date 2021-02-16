import React, { useState } from "react"
import { observer } from "mobx-react-lite";
import { useStore } from "../../store/hook";
import TreeItem from "./TreeItem";

import "../../styles/TreeUI/TreeUI.scss";

function TreeList(props) {
    const store = useStore()
    let children = store.cards[props.cardID]?.children
    let [expanded, setExpanded] = useState(true);
    // need tree arrow state here
    console.log("CHILDREN",children)
    return (
        <div className="treelist">
            <div className="content">
                {/* add tree arrow here*/}
                <div className="arrow-placeholder">
                    {children ?
                        <img className={"tree-arrow" + (expanded ? " expanded" : " collapsed")}
                            src={require("../../assets/treeui/arrow.svg")}
                            alt="collapse button"
                            onClick={() => setExpanded(!expanded)} />
                        : null}
                </div>
                <TreeItem cardID={props.cardID} />
            </div>
            {children && expanded ?
                <div className="children">
                    {Object.keys(children).map((cardID) => <TreeList key={cardID} cardID={cardID} />)}
                </div>
                : null}
        </div>
    )
}

export default observer(TreeList)