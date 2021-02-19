import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStore } from '../../../store/hook';
import GenericTask from './GenericTask';
const TaskList = (props) => {
    const store = useStore();
    console.log("TASKS ",store.tasks)
    return (
        <div className="treelist">
            <div>
                {
                    Object.entries(store.tasks).length ?
                        Object.entries(store.tasks)
                            .map(([taskID, taskDetail]) =>
                                <GenericTask key={taskID} store={store} id={taskID} detail={taskDetail} />
                            ) 
                    : 'No Tasks Created'
                }
            </div>
        </div>
    )
}
export default observer(TaskList);