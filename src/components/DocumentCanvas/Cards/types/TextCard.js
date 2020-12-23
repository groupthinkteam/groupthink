import { observer } from "mobx-react-lite";
import React, { useRef, useEffect, useState } from "react";
import { useStore } from "../../../../store/hook";
import ReactMarkdown from "react-markdown"

import CustomEditor from "../../../CustomEditor/CustomEditor";

import "../../../../styles/Cards/TextCard.scss"

function TextCard(props) {
    const customEditorRef = useRef(null);
    const textNodeRef = useRef(null);
    let store = useStore()
    const me = store.cards[props.id];
    const textLength = me.content.text.length;

    let [editing, setEditing] = useState(false);

    //  useEffect(() => {
    //     function handleClickOutside(e) {
    //         const store = store;
    //         if (textNodeRef.current) {
    //             if (e.target.contains(textNodeRef.current)) {
    //                 //trueclicked outside

    //                 if (!textLength) {
    //                     const store = store;
    //                     store.resize(props.id, { width: me.size.width, height: 40 })
    //                     store.saveContent(props.id, { title: me.content.title || null, text: me.content.text, shrinked: true })
    //                 }
    //                 if (store.currentActive === props.id) {
    //                     store.currentActive = null;
    //                 }
    //                 e.stopPropagation();
    //                 store.removeUserEditing(props.id, 'editing')
    //             }
    //         }
    //         console.log("CHECK ", e.target === InlineTextEditRef.current, e.target.contains(textNodeRef.current), textNodeRef.current.contains(e.target), textNodeRef.current, e.target)
    //     }
    //     document.addEventListener("mousedown", handleClickOutside);
    //     return () => {
    //         document.removeEventListener("mousedown", handleClickOutside);
    //     };
    // }, [props.id, store, me.size.width, me.content.title, me.content.text, textLength]);

    const onSave = (e) => {
        e.stopPropagation();
        store.saveContent(props.id, { text: me.content.text })
    }
    const onChangeTitle = (event) => {
        store.changeContent(props.id, { text: event.target.value });
        event.stopPropagation();
    }
    const onBlurTextNode = (e) => {
        setEditing(false)
        e.stopPropagation();
    }

    return (
        <div ref={textNodeRef}
            className="text-card"
            id={"text-node".concat(props.id)}
            onBlur={onBlurTextNode}>
            {editing ?
                <CustomEditor
                    ref={customEditorRef}
                    id={`custom-editor-${props.id}`}
                    onChange={(e) => onChangeTitle(e, 'text')}
                    onSave={(e) => onSave(e, 'text')}
                    text={me.content.text}
                    placeholder="Enter your Text"
                />
                :
                <div className="md-container-wrapper" onDoubleClick={() => { setEditing(true) }}>
                    <ReactMarkdown children={me.content.text} allowDangerousHtml className="md-container"/>
                </div>
            }
        </div>
    )
}
export default observer(TextCard);