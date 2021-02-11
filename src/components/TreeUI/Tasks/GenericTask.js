import React, { useState } from 'react';
import TimeAgo from "react-timeago";
import Calendar from 'react-calendar';
// import SearchElements from '../../../constants/searchTemplate';
import '../../../styles/Tasks/GenericTask.scss';
import InlineTextEdit from '../../InlineTextEdit/InlineTextEdit';
import 'react-calendar/dist/Calendar.css';

const GenericTask = ({ id, detail, store }) => {
    const creatorPic = store.users[detail.creator].photoURL;
    const creatorName = store.users[detail.creator].name;
    const taskItemLength = Object.keys(detail.content).length;
    const [showDropDown, setShowDropDown] = useState(false);
    const [results, setResults] = useState({ matches: [], suggest: [], text: "" });
    const [pickDate, setPickDate] = useState(false);
    const onChange = (event, inputID) => {
        // console.log("EVENT ", event.target.value.search('@'), event.key, event.target.value === 'Enter');
        const input = event.target.value;
        const updates = {};
        updates[`content/${inputID}/text`] = input
        store.updateTask(id, null, updates);
    }
    const taggedPerson = (userID) => {
        const taggedPersonInfo = store.users[userID];
        setShowDropDown(false);
        const updates = {};
        if (userID === detail.creator) {
            updates[`content/${showDropDown}/text`] = detail.content[showDropDown].text + 'me ';
        }
        else {
            updates[`content/${showDropDown}/text`] = detail.content[showDropDown].text + taggedPersonInfo.name.split(" ")[0] + " "
        }
        updates['tagged'] = detail.tagged ? [...detail.tagged, userID] : [userID]
        store.updateTask(id, userID, updates);
        setResults({ matches: [], suggest: [], text: "" });
    }
    const onKeyDown = (event, id) => {
        console.log("Key Pressed", event.key, event.keyCode);
        switch (event.keyCode) {
            case 50://@
                setShowDropDown(id);
                break;
            case 13://Enter
                setShowDropDown(false);
                break;
            case 8://BackSpace
                setShowDropDown(false);
                break;
            case 32://space
                setShowDropDown(false);
                // setResults({ matches: [], suggest: [], text: "" });
                break;
            default: break;
        }
        // if (showDropDown) {
        //     const searchObject = new SearchElements(['name']);
        //     const [result, suggestions] = searchObject.getTagResult(results.text + event.key, store.users);
        //     console.log("RESULT ", event.key, result , results.text + event.key);
        //     console.log("Suggestion", event.key, suggestions);
        //     setResults({ matches: result, suggest: suggestions, text: results.text + event.key });
        // }
    }
    const TagList = ({ userID, userDetail }) => {
        return (
            <div key={userID} onClick={() => { taggedPerson(userID) }}>
                <img className="creator-pic" src={userDetail.photoURL} alt={`${userDetail.name} Pic`} />
                {userDetail.name}
                {
                    userID === store.userID ? '( Me )' : null
                }
            </div>
        )
    }
    const addSubTask = () => {
        const updates = {};
        const lastItem = Object.keys(detail.content)[taskItemLength - 1]
        const newItem = parseInt(lastItem.charAt(lastItem.length - 1)) + 1;
        updates[`content/task${newItem}/text`] = ''
        updates[`content/task${newItem}/status`] = 'initialized';
        updates['height'] = detail.height + 26
        store.updateTask(id, null, updates);
    }
    const removeSubTask = (taskItemID) => {
        const updates = {};
        updates[`content/${taskItemID}`] = null;
        updates['height'] = detail.height - 26
        store.updateTask(id, null, updates);
    }
    const addDueDate = (date) => {
        const updates = {};
        Object.keys(detail.content)
            .forEach((taskItemID) => {
                updates[`content/${taskItemID}/status`] = 'pending';
            })
        updates['dueDate'] = date
        store.updateTask(id, null, updates);
        setPickDate(!pickDate);
    }
    const updateStatus = (taskItemID) => {
        const updates = {};
        if (detail.content[taskItemID].status === 'pending') {
            updates[`content/${taskItemID}/status`] = 'completed';
            store.updateTask(id, null, updates);
        }
        else
            alert("Add A Due Date To Task");
    }
    return (
        <div className="generic-task" tabIndex={0} key={id} style={{ height: detail.height }}>
            <div className="task-info-head">
                <div className="partition">
                    <img className="creator-pic" src={creatorPic} alt="creator pic" />
                    <span style={{ padding: "8px" }}>{creatorName.split(" ")[0]}</span>
                </div>
                <div className="partition">
                    {
                        !pickDate && detail.dueDate && (<div className="due-date">due <TimeAgo date={detail.dueDate}  /></div>)
                    }
                    {
                        !detail.dueDate &&
                        <span style={{ padding: "8px" }} onClick={() => setPickDate(!pickDate)}>
                            Add Due Date
                        </span>
                    }

                    <span onClick={() => { store.removeTask(id) }}>Remove </span>
                </div>

            </div>
            {
                pickDate ?
                    <Calendar
                        className="pick-calendar"
                        onChange={(date) => addDueDate(date.valueOf())}
                        value={new Date()}
                        view="month"
                        minDate={new Date()}
                    />
                    : null
            }
            <div >
                {
                    !pickDate && Object.entries(detail.content)
                        .map(([taskItemID, taskItemDetail], index) =>
                            <div className="task-provide">
                                {/* <div> */}
                                {
                                    taskItemDetail.status === 'completed' ?
                                        <img src={require("../../../assets/treeui/completed-file.svg")} alt="Pending task" />
                                        :
                                        <img onClick={() => updateStatus(taskItemID)} src={require("../../../assets/treeui/pending-task.svg")} alt="completed task" />
                                }
                                {
                                    taskItemLength - 1 === index ?
                                        <span style={{ padding: '5px 2px 3px 11px' }} key={taskItemID} onClick={addSubTask}>+</span>
                                        :
                                        <span style={{ padding: '5px 2px 3px 11px' }} key={taskItemID} onClick={() => removeSubTask(taskItemID)}>-</span>
                                }
                                {/* </div> */}
                                <div>
                                    <InlineTextEdit
                                        onChange={e => onChange(e, taskItemID)}
                                        // onSave={onSave}
                                        text={taskItemDetail.text}
                                        onKeyDown={(e) => { onKeyDown(e, taskItemID) }}
                                        placeholder="Tag People "
                                        margin="2px 10px 5px 10px"
                                        style={{
                                            width: '120%',
                                            textDecoration: taskItemDetail.status === 'completed' ? 'line-through' : '',
                                            color: taskItemDetail.status === 'completed' ? '#A29FA5' : '',
                                            fontWeight: 600,
                                            fontSize: '14px',
                                            lineHeight: "24px",
                                        }}
                                    />
                                    {
                                        showDropDown === taskItemID?
                                            <div className="dropdown-content" id={"dropdown-content-".concat(showDropDown)}>
                                                {
                                                    Object.entries(store.users)
                                                        .map(([userID, userDetail]) => {
                                                            if (results.matches.length) {
                                                                return results.matches
                                                                    .filter((result) => result.id === userID)
                                                                    .map((result) => <TagList userDetail={userDetail} userID={result} />)
                                                            }
                                                            else
                                                                return (<TagList userDetail={userDetail} userID={userID} />)
                                                        })
                                                }
                                            </div>
                                            : null
                                    }
                                </div>
                            </div>
                        )
                }
            </div>


        </div >
    )
}
export default GenericTask