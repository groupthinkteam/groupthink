import React, { useState } from "react"
import { observer } from "mobx-react-lite";
import { useStore } from "../../store/hook";
import TreeList from "./TreeList";

import "../../styles/TreeUI/TreeUI.scss";
import TaskList from "./Tasks/TaskList";

// // This only needs to be done once; probably during your application's bootstrapping process.
// import 'react-sortable-tree/style.css';
// import SortableTree from 'react-sortable-tree';

function TreeUI(props) {
    const store = useStore();
    let [expanded, setExpanded] = useState(false);
    const [showTasks, setShowTasks] = useState(false);

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
                <span
                    onClick={() => { setShowTasks(false) }}
                    style={{ color: `${showTasks ? '#DFDCDC' : ''}` }}
                >Aerial View</span>
                <span
                    onClick={() => { setShowTasks(true) }}
                    style={{ color: `${!showTasks ? '#DFDCDC' : ''}` }}
                >Tasks</span>
                <div>

                    {
                        showTasks ?
                            <img style={{padding:'0px 15px'}} onClick={() => { store.generateTask() }}
                                src={require("../../assets/treeui/add-task.svg")}
                                alt="create task"
                            /> : null
                    }
                    <img className="tree-arrow"
                        src={require("../../assets/treeui/arrow-blue.svg")}
                        alt="close tree UI"
                        onClick={() => setExpanded(false)}
                    />
                </div>

            </div>
            <div className="horizontal-line" />
            {
                showTasks ? <TaskList />
                    : <TreeList cardID="root" />
            }
        </div>
    );
}

export default observer(TreeUI)