import React from "react"
import { observer } from "mobx-react-lite";
import { useStore } from "../../store/hook";
import TreeList from "./TreeList";

import "../../styles/TreeUI/TreeUI.scss";

// // This only needs to be done once; probably during your application's bootstrapping process.
// import 'react-sortable-tree/style.css';
// import SortableTree from 'react-sortable-tree';

function TreeUI(props) {
    let store = useStore()
    return (
        <div className="treeui">
            <div className="heading">
                Aerial View
            </div>
            <TreeList cardID="root" />
        </div>
    );
}

export default observer(TreeUI)