import React, { useEffect, useRef } from 'react';
import InlineTextEdit from '../../InlineTextEdit/InlineTextEdit';

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
        id
    } = props;
    const ContentEnableRef = useRef(null);
    const InlineTextRef = useRef(null);
    function getCaretPosition(element) {
        var caretOffset = 0;
        var doc = element.ownerDocument || element.document;
        var win = doc.defaultView || doc.parentWindow;
        var sel;
        if (typeof win.getSelection != "undefined") {
            sel = win.getSelection();
            if (sel.rangeCount > 0) {
                var range = win.getSelection().getRangeAt(0);
                var preCaretRange = range.cloneRange();
                preCaretRange.selectNodeContents(element);
                preCaretRange.setEnd(range.endContainer, range.endOffset);
                caretOffset = preCaretRange.toString().length;
            }
        } else if ((sel = doc.selection) && sel.type != "Control") {
            var textRange = sel.createRange();
            var preCaretTextRange = doc.body.createTextRange();
            preCaretTextRange.moveToElementText(element);
            preCaretTextRange.setEndPoint("EndToEnd", textRange);
            caretOffset = preCaretTextRange.text.length;
        }
        return caretOffset;
    }
    const onChange = (event, inputID, strategy) => {
        const input = event.target?.value;
        const updates = {};
        updates[`content/${inputID}/text`] = strategy ? ContentEnableRef.current.innerHTML : input
        store.updateTask(id, null, updates);
    }
    const onLocalSave = () => {
        store.tasks[id]["content"][taskItemID]["text"] = ContentEnableRef.current.innerHTML;
        console.log("LOCVAL SAVE ", store.tasks[id]["content"][taskItemID], ContentEnableRef.current.innerText.length)
    }
    const addSubTask = () => {
        const updates = {};
        const lastItem = Object.keys(detail.content)[taskItemLength - 1]
        const newItem = parseInt(lastItem.charAt(lastItem.length - 1)) + 1;
        updates[`content/task${newItem}/text`] = ''
        updates[`content/task${newItem}/status`] = detail.dueDate ? 'pending' : 'initialized';
        updates['height'] = detail.height + 30
        store.updateTask(id, null, updates);
    }
    const removeSubTask = (taskItemID) => {
        const updates = {};
        updates[`content/${taskItemID}`] = null;
        updates['height'] = detail.height - 30
        store.updateTask(id, null, updates);
    }

    const updateStatus = (taskItemID) => {
        const updates = {};
        updates[`content/${taskItemID}/status`] = 'completed';
        store.updateTask(id, null, updates);
    }
    return (
        <div key={taskItemID} className="task-provide">
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
            <div>
                {/* <InlineTextEdit
                    onChange={e => onChange(e, taskItemID)}
                    // onSave={onSave}
                    text={taskItemDetail.text}
                    onKeyDown={(e) => { onKeyDown(e, taskItemID) }}
                    placeholder="Tag People "
                    margin="2px 10px 5px 10px"
                    ref={InlineTextRef}
                    allowFullScreen={true}
                    style={{
                        width: '90%',
                        textDecoration: taskItemDetail.status === 'completed' ? 'line-through' : '',
                        color: taskItemDetail.status === 'completed' ? '#A29FA5' : '',
                        fontWeight: 600,
                        fontSize: '14px',
                        lineHeight: "24px",
                    }}
                /> */}

                <div
                    id="editable"
                    ref={ContentEnableRef}
                    onInput={() => onLocalSave()}
                    contentEditable="true"
                    placeholder="Tag People "
                    onFocus={()=>{}}
                    onKeyDown={(e) => { onKeyDown(e, taskItemID) }}
                    onBlur={(e) => { onChange(e, taskItemID, 's'); e.stopPropagation() }}
                    dangerouslySetInnerHTML={{ __html: taskItemDetail.text }}
                    style={{
                        outline: 'none',
                        margin: "2px 10px 5px 10px",
                        width: '90%',
                        textDecoration: taskItemDetail.status === 'completed' ? 'line-through' : '',
                        color: taskItemDetail.status === 'completed' ? '#A29FA5' : '',
                        fontWeight: 600,
                        fontSize: '14px',
                        lineHeight: "24px",
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
                                                    select={{
                                                        // start: getCaretPosition(ContentEnableRef.current),//InlineTextRef.current.selectionStart,
                                                        // end: getCaretPosition(ContentEnableRef.current),// InlineTextRef.current.selectionEnd
                                                    }}
                                                    taggedPerson={taggedPerson} userDetail={userDetail} userID={userID}
                                                />
                                            )
                                    })
                            }
                        </div>
                        : null
                }
            </div>
        </div>
    )
}
const TagList = ({ userID, userDetail, store, taggedPerson, select }) => {
    return (
        <div key={userID} onClick={() => { taggedPerson(userID, select) }}>
            <img className="creator-pic" src={userDetail.photoURL} alt={`${userDetail.name} Pic`} />
            {userDetail.name}
            {
                userID === store.userID ? '( Me )' : null
            }
        </div>
    )
}
function pasteHtmlAtCaret(html) {
    var sel, range;
    if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();

            // Range.createContextualFragment() would be useful here but is
            // non-standard and not supported in all browsers (IE9, for one)
            var el = document.createElement("div");
            el.innerHTML = html;
            var frag = document.createDocumentFragment(), node, lastNode;
            while ((node = el.firstChild)) {
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);

            // Preserve the selection
            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    } else if (document.selection && document.selection.type != "Control") {
        // IE < 9
        document.selection.createRange().pasteHTML(html);
    }
}
export default TaskItem