import React, { useRef } from 'react';
import ContentEditable from 'react-contenteditable'
const TaskItem = (props) => {
    const {
        taskItemDetail,
        taskItemLength,
        taskItemID,
        index,
        onKeyDown,
        showDropDown,
        store,
        results,
        taggedPerson,
        detail,
        id,
        closeDropDown
    } = props;
    const contentEditableRef = useRef(null);
    const onChange = (e) => {
        const updates = {};
        updates[`content/${taskItemID}/text`] = store.tasks[id]["content"][taskItemID]["text"];
        store.updateTask(id, null, updates);
        store.taskEditing = null;
    }
    const onLocalSave = (event) => {
        store.tasks[id]["content"][taskItemID]["text"] = event.target.value;
        console.log("LOCVAL SAVE ", store.tasks[id]["content"][taskItemID].text.match(new RegExp("@", "g") || [])?.length)
    }
    const addSubTask = () => {
        const updates = {};
        const lastItem = Object.keys(detail.content)[taskItemLength - 1]
        const newItem = parseInt(lastItem.charAt(lastItem.length - 1)) + 1;
        updates[`content/task${newItem}/text`] = ''
        updates[`content/task${newItem}/status`] = detail.dueDate ? 'pending' : 'initialized';
        updates['height'] = detail.height + Math.min(contentEditableRef.current.parentElement.clientHeight, 60);
        store.updateTask(id, null, updates);
    }
    const removeSubTask = (taskItemID) => {
        const updates = {};
        updates[`content/${taskItemID}`] = null;
        updates['height'] = detail.height - contentEditableRef.current.parentElement.clientHeight;
        store.updateTask(id, null, updates);
    }

    const updateStatus = (taskItemID) => {
        const updates = {};
        updates[`content/${taskItemID}/status`] = 'completed';
        store.updateTask(id, null, updates);
    }

    return (
        <div className="task-provide" id={taskItemID}>
            {
                taskItemDetail.status === 'completed' ?
                    <img src={require("../../../assets/treeui/completed-file.svg")} alt="Pending task" />
                    :
                    <img onClick={() => updateStatus(taskItemID)} src={require("../../../assets/treeui/pending-task.svg")} alt="completed task" />
            }
            {
                taskItemLength - 1 === index ?
                    <span style={{ padding: '5px 0px 3px 9px' }} key={taskItemID} onClick={addSubTask}>+</span>
                    :
                    <span style={{ padding: '5px 2px 3px 11px' }} key={taskItemID} onClick={() => removeSubTask(taskItemID)}>-</span>
            }
            {/* <div> */}
            <ContentEditable
                innerRef={contentEditableRef}
                className="editable"
                data-placeholder="Add Task"
                html={taskItemDetail.text}
                onChange={onLocalSave}
                onBlur={onChange}
                onFocus={(e) => {
                    store.taskEditing = id;
                }}
                onKeyDown={(e) => { onKeyDown(e, taskItemID) }}
                style={{
                    outline: 'none',
                    margin: "8px 10px 5px 10px",
                    width: '90%',
                    textDecoration: taskItemDetail.status === 'completed' ? 'line-through' : '',
                    color: taskItemDetail.status === 'completed' ? '#A29FA5' : '',
                    fontWeight: 600,
                    fontSize: '14px',
                    lineHeight: "24px",
                    cursor: 'text'
                }}
            />
            {
                showDropDown === taskItemID ?
                    <div className="dropdown-content" id={"dropdown-content-".concat(showDropDown)}>
                        {
                            Object.entries(store.users)
                                .map(([userID, userDetail]) => {
                                    if (results.matches.length) {
                                        return results.matches
                                            .filter((result) => result.id === userID)
                                            .map((result) => <TagList store={store} userDetail={userDetail} userID={result} />)
                                    }
                                    else
                                        return (
                                            <TagList store={store}
                                                taggedPerson={taggedPerson}
                                                userDetail={userDetail}
                                                userID={userID}
                                                contentEditableRef={contentEditableRef}
                                            />
                                        )
                                })
                        }
                    </div>
                    : null
            }
            {/* </div> */}
        </div>
    )
}
const TagList = ({ userID, userDetail, store, taggedPerson, contentEditableRef }) => {
    return (
        <div key={userID} onClick={() => { taggedPerson(userID, contentEditableRef) }}>
            <img className="creator-pic" src={userDetail.photoURL} alt={`${userDetail.name} Pic`} />
            {userDetail.name}
            {
                userID === store.userID ? '( Me )' : null
            }
        </div>
    )
}

export default TaskItem