import React, { useState } from 'react';
import TimeAgo from "react-timeago";
import Calendar from 'react-calendar';
import TaskItem from './TaskItem';

import '../../../styles/Tasks/GenericTask.scss';
import 'react-calendar/dist/Calendar.css';

const GenericTask = ({ id, detail, store }) => {
    const creatorPic = store.users[detail.creator].photoURL;
    const creatorName = store.users[detail.creator].name;
    const taskItemLength = Object.keys(detail.content).length;
    const [showDropDown, setShowDropDown] = useState(false);
    const [pickDate, setPickDate] = useState(false);
    const taggedPerson = (userID, contentEditableRef) => {
        const taggedPersonInfo = store.users[userID];
        setShowDropDown(false);
        const updates = {};
        const oldText = store.tasks[id]["content"][showDropDown]["text"]
        const lastOccurance = oldText.lastIndexOf('@') - 1;
        const occurance = oldText.match(new RegExp("@", "g") || []).length;
        if (userID === detail.creator) {
            let updatedText = oldText.substring(0, lastOccurance) + '<span class="codespacer">&nbsp;</span><span style="color: #48BB35;">@me</span><span class="codespacer">&nbsp;</span>';
            if (occurance > 1) {
                updatedText = updatedText + oldText.substring(lastOccurance + 2, oldText.length);
            }
            updates[`content/${showDropDown}/text`] = updatedText;
        }
        else {
            let updatedText = oldText.substring(0, lastOccurance) + '<span class="codespacer">&nbsp;</span><span style="color: #32AAFF;">@' + taggedPersonInfo.name.split(" ")[0] + '</span><span class="codespacer">&nbsp;</span>';
            if (occurance > 1) {
                updatedText = updatedText + oldText.substring(lastOccurance + 2, oldText.length);
            }
            updates[`content/${showDropDown}/text`] = updatedText;
        }
        if (detail.tagged) {
            if (!detail.tagged.includes(userID))
                updates['tagged'] = [...detail.tagged, userID];
        }
        else {
            updates['tagged'] = [userID];
        }
        store.updateTask(id, userID, updates);
        contentEditableRef.current.focus();
    }
    const onKeyDown = (event, ID) => {
        console.log("Key Pressed", event.key, event.keyCode);
        switch (event.keyCode) {
            case 50://@
                setShowDropDown(ID);
                break;
            case 13://Enter
                setShowDropDown(false);
                break;
            case 8://BackSpace
                setShowDropDown(false);
                break;
            case 32://space
                setShowDropDown(false);
                break;
            default: break;
        }
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
    return (
        <div className={"generic-task" + (store.taskEditing === id ? " active-task":"") }
            tabIndex={0} key={id}
            style={{ height: detail.height }}
            id={"generic-task".concat(id)}
        >
            <div className="task-info-head">
                <div className="partition">
                    <img className="creator-pic" src={creatorPic} alt="creator pic" />
                    <span className="creator-name">{creatorName.split(" ")[0]}</span>
                </div>
                <div className="partition">
                    {
                        !pickDate && detail.dueDate && (<div className="due-date">due <TimeAgo date={detail.dueDate} /></div>)
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
                            <TaskItem
                                taskItemDetail={taskItemDetail}
                                taskItemID={taskItemID}
                                index={index}
                                taskItemLength={taskItemLength}
                                onKeyDown={onKeyDown}
                                showDropDown={showDropDown}
                                store={store}
                                taggedPerson={taggedPerson}
                                detail={detail}
                                id={id}
                                key={taskItemID}
                                closeDropDown={() => setShowDropDown(false)}
                            />
                        )
                }
            </div>
        </div >
    )
}

export default GenericTask