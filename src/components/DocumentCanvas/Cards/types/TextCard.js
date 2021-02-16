import { observer } from "mobx-react-lite";
import React, { useRef, useEffect, useState } from "react";
import { useStore } from "../../../../store/hook";
import ReactMarkdown from "react-markdown"
import CustomEditor from "../../../CustomEditor/CustomEditor";

import "../../../../styles/Cards/TextCard.scss"

function TextCard(props) {
    // const customEditorRef = useRef(null);
    const textNodeRef = useRef(null);
    let store = useStore()
    const me = store.cards[props.id];

    const onSave = (e) => {
        console.log("ON Save CHANGE ",{ text: me.content.text })
        e.stopPropagation();
        store.saveContent(props.id, { text: me.content.text })
    }
    const onChangeTitle = (event) => {
        console.log("ONTITLE CHANGE ",{ text: store.textareaRef.current.innerHTML})
        store.changeContent(props.id, { text: store.textareaRef.current.innerHTML});
        if (event.stopPropagation)
            event.stopPropagation();
    }

    if (me.content.initialRender) {
        store.editingCard = props.id;
    }

    return (
        <div ref={textNodeRef}
            className="text-card"
            id={"text-node".concat(props.id)}
        >
            {store.editingCard === props.id ?
                <>
                    
                    <CustomEditor
                        id={`custom-editor-${props.id}`}
                        onChange={(e) =>{ onChangeTitle(e, 'text')}}
                        onSave={(e) => { onSave(e, 'text') }}
                        text={me.content.text}
                        placeholder="type here..."
                        onFocus={e=>e.stopPropagation()}
                        initialRender={me.content.initialRender}
                    />
                </>
                :
                <div className="md-container-wrapper" onDoubleClick={() => { store.editingCard = props.id }}>

                    <ReactMarkdown children={me.content.text} allowDangerousHtml className="md-container" />
                </div>
            }
        </div>
    )
}
export default observer(TextCard);