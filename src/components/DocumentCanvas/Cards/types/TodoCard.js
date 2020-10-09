import React from "react"
import InlineTextEdit from "../../../InlineTextEdit/InlineTextEdit"
import Button from "../../../Button/Button"

function TodoCard(props) {

    const onItemChanged = (itemID, section, newValue) => {
        props.typeAPI.changeContent(props.id, {
            ...props.content,
            items: {
                ...props.content.items,
                [itemID]: {
                    ...props.content.items[itemID],
                    [section]: newValue,
                }
            }
        })
    }

    const onItemSaved = (itemID, section, newValue) => {
        props.typeAPI.saveContent(props.id, {
            ...props.content,
            items: {
                ...props.content.items,
                [itemID]: {
                    ...props.content.items[itemID],
                    [section]: newValue,
                }
            }
        })
    }

    const onDelete = (itemID) => {
        props.typeAPI.saveContent(props.id,
            {
                ...props.content,
                items: {
                    ...props.content.items,
                    [itemID]: null
                }
            })
    }

    return (
        <div className="todo-card" style={{ overflowX: "hidden", overflowY: "auto", width: "100%", height: "100%" }}>
            <div className="heading">
                <InlineTextEdit
                    placeholder="TODO title"
                    text={props.content.title}
                    onChange={(e) => props.typeAPI.changeContent(props.id, { ...props.content, title: e.target.value })}
                    onSave={(e) => props.typeAPI.saveContent(props.id, { ...props.content, title: e.target.value })}
                    margin="7px 0px 0px 0px"
                    bold
                    sticky
                    disabled={props.isLocked}
                />
                <hr style={{ marginTop: "0px", marginBottom: "7px" }} />
            </div>
            <Button 
            className="custom_btn"
            isLocked={props.isLocked}
            handleClick={() => {
                props.typeAPI.saveContent(props.id, {
                    ...props.content, lastOrder: props.content.lastOrder + 1, items: {
                        ...props.content.items, ["todoitem" + (props.content.lastOrder + 1)]: {
                            checked: false,
                            text: "",
                            order: (props.content.lastOrder + 1)
                        }
                    }
                })
            }}>+ add new</Button>
            <div className="todo-item-list" style={{ overflowX: "hidden", overflowY: "auto" }}>
                {// render all the todos
                    props.content.items ?
                        Object.entries(props.content.items)
                            .filter(([id, value]) => id !== "root")
                            .sort(([id1, value1], [id2, value2]) => value2.order - value1.order)
                            .map(([id, value]) =>
                                <TodoItem
                                    key={id}
                                    itemID={id}
                                    text={value.text}
                                    checked={value.checked}
                                    order={value.order}
                                    onCheckToggle={(newChecked) => onItemSaved(id, "checked", newChecked)}
                                    onTextChange={(newText) => onItemChanged(id, "text", newText)}
                                    onTextSave={(newText) => onItemSaved(id, "text", newText)}
                                    onDelete={() => onDelete(id)}
                                    isLocked={props.isLocked}
                                />
                            )
                        : null
                }
            </div>
        </div>
    )
}

let TodoItem = React.memo((props) => {
    const placeholders = ["great", "nice", "awesome", "crazy", "special"];
    return (
        <div className="todo-item" id={props.itemID}>
            <label className="checkbox">
                <input type="checkbox"
                    checked={props.checked}
                    onChange={(e) => props.onCheckToggle(e.target.checked)}
                />
                <span></span>
            </label>
            <InlineTextEdit
                placeholder={"do something " + placeholders[props.order % placeholders.length]}
                text={props.text}
                widthOffset={60}
                onChange={(e) => props.onTextChange(e.target.value)}
                onSave={(e) => props.onTextSave(e.target.value)}
                margin="0px 0px 0px 10px"
                strikethrough={props.checked}
                color={props.checked ? "grey" : "black"}
                disabled={props.isLocked}
            />
            <Button handleClick={props.onDelete} isLocked={props.isLocked}>x</Button>
        </div>
    )
})


export default React.memo(TodoCard)