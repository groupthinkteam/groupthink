import React, { useState } from 'react';
import TimeAgo from "react-timeago"
import SearchElements from '../../../constants/searchTemplate';
import '../../../styles/Tasks/GenericTask.scss'
import InlineTextEdit from '../../InlineTextEdit/InlineTextEdit'
const GenericTask = ({ id, detail, store ,key }) => {
    const creatorPic = store.users[detail.creator].photoURL;
    const creatorName = store.users[detail.creator].name;
    const [showDropDown, setShowDropDown] = useState(false);
    const [results, setResults] = useState({ matches: [], suggest: [], text: "" });
    const onChange = (event) => {
        console.log("EVENT ", event.target.value.search('@'), event.key, event.target.value === 'Enter');
        const input = event.target.value;
        store.updateTask(id, null, { text: input });
    }
    const taggedPerson = (userID) => {
        const taggedPersonInfo = store.users[userID];
        setShowDropDown(false);
        const updates = {};
        if (userID === detail.creator) {
            updates['text'] = detail.content.text + 'me';
        }
        else {
            updates['text'] = detail.content.text + taggedPersonInfo.name.split(" ")[0]
        }
        store.updateTask(id, userID, updates);
        setResults({ matches: [], suggest: [], text: "" });
    }
    const onKeyDown = (event) => {
        console.log("Key Pressed", event.key, event.keyCode);
        switch (event.keyCode) {
            case 50://@
                setShowDropDown(true);
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
    return (
        <div className="generic-task" tabIndex={0} key={key}>
            <img className="creator-pic" src={creatorPic} alt="creator pic" />
            {creatorName.split(" ")[0]}
            <TimeAgo date={detail.createdAt} />
            <button onClick={() => { store.removeTask(id) }}>Remove Task</button>
            <InlineTextEdit
                onChange={e => onChange(e)}
                // onSave={onSave}
                text={detail.content.text}
                onKeyDown={(e) => { onKeyDown(e) }}
                placeholder="Tag People "
                margin="2px 0px 0px 0px"
            />
            {
                showDropDown ?
                    <div className="dropdown-content">
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
    )
}
export default GenericTask