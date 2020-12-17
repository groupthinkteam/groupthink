import React, { useState } from "react"
import { observer } from "mobx-react-lite";
import { useStore } from "../../store/hook";
import TreeList from "./TreeList";

import "../../styles/TreeUI/TreeUI.scss";

// // This only needs to be done once; probably during your application's bootstrapping process.
// import 'react-sortable-tree/style.css';
// import SortableTree from 'react-sortable-tree';

function TreeUI(props) {
    let store = useStore();
    let [expanded, setExpanded] = useState(false);

    if (!expanded) {
        return (
            <div className="tree-trigger" onClick={() => setExpanded(true)}>
                Aerial View
                <img className="tree-arrow"
                    src={require("../../assets/treeui/arrow-blue.svg")}
                    alt="open tree UI"
                />
            </div>
        );
    }

    return (
        <div className="treeui">
            <div className="heading">
                Aerial View
                <img className="tree-arrow"
                    src={require("../../assets/treeui/arrow-blue.svg")}
                    alt="close tree UI"
                    onClick={() => setExpanded(false)}
                />
            </div>
            <TreeList cardID="root" />
        </div>
    );
}

export default observer(TreeUI)