import React, { useRef, useEffect } from "react";
import InlineTextEdit from "../../../InlineTextEdit/InlineTextEdit";

import CustomEditor from "../../../CustomEditor/CustomEditor";

function TextCard(props) {
    const customEditorRef = useRef(null);
    const textNodeRef = useRef(null);
    const InlineTextEditRef = useRef(null);
    const me = props.typeAPI.cards[props.id];
    const textLength = props.content.text.length;
    const titleLength = props.content?.title ? props.content?.title.length : 0;
    useEffect(() => {

        if (props.typeAPI.currentActive === props.id) {
            const clickedTarget = props.typeAPI.clickTargetGeneric;
            if (me.content.initialRender)
                customEditorRef.current.focus();
            if (me.editing && !me.editing[props.typeAPI.userID]) {
                // var quillEditor = customEditorRef.current.getEditor();
                // quillEditor.enable(false)
            }
            if (clickedTarget) {
                if (clickedTarget.classList[0] === 'inline-input' || clickedTarget.target === InlineTextEditRef.current)
                    InlineTextEditRef.current.focus();
                else if (textNodeRef.current.contains(clickedTarget) || clickedTarget.target === customEditorRef.current)
                    customEditorRef.current.focus()
            }

        }
    }, [props, textLength, me.content.shrinked, props.content.title, props.id, props.typeAPI.currentActive, me.editing, props.typeAPI.userID, me.content.initialRender]);
    useEffect(() => {
        function handleClickOutside(e) {
            const store = props.typeAPI;
            if (textNodeRef.current) {
                if (e.target.contains(textNodeRef.current)) {
                    //trueclicked outside

                    if (!textLength) {
                        const store = props.typeAPI;
                        store.resize(props.id, { width: me.size.width, height: 40 })
                        store.saveContent(props.id, { title: props.content.title || null, text: props.content.text, shrinked: true })
                    }
                    if (store.currentActive === props.id) {
                        store.currentActive = null;
                    }
                    e.stopPropagation();
                    store.removeUserEditing(props.id, 'editing')
                }
            }
            console.log("CHECK ", e.target === InlineTextEditRef.current, e.target.contains(textNodeRef.current), textNodeRef.current.contains(e.target), textNodeRef.current, e.target)
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [props.id, props.typeAPI, me.size.width, props.content.title, props.content.text, textLength]);

    const onSave = (e, strategy) => {
        if (!strategy) {
            const store = props.typeAPI;
            if (!textLength) {
                const store = props.typeAPI;
                store.resize(props.id, { width: me.size.width, height: 40 })
                store.saveContent(props.id, { title: props.content.title || null, text: props.content.text, shrinked: true })
            }
            if (store.currentActive === props.id) {
                store.currentActive = null;
            }
            store.removeUserEditing(props.id, 'editing')
        }
        e.stopPropagation();
        props.typeAPI.saveContent(props.id, { title: props.content.title || null, text: props.content.text })
    }
    const onChangeTitle = (event, startegy) => {
        props.typeAPI.changeContent(props.id, { title: startegy ? props.content.title || null : event.target.value, text: startegy ? event.target.value : props.content.text });
        event.stopPropagation();
    }
    const onBlurTextNode = (e) => {
        e.stopPropagation();
    }
    const onFocusTitle = (event) => {
        //MOve Ponter At Last of Text
        if (customEditorRef.current) {
            customEditorRef.current.selectionStart = textLength;
            customEditorRef.current.selectionEnd = textLength;
        }
        if (InlineTextEditRef.current) {
            InlineTextEditRef.current.selectionStart = titleLength;
            InlineTextEditRef.current.selectionEnd = titleLength;
        }
        if (!textLength && me.editing && me.editing[props.typeAPI.userID]) {
            const store = props.typeAPI;
            store.resize(props.id, { width: me.size.width, height: 200 });
            store.saveContent(props.id, { title: props.content.title || null, text: props.content.text, shrinked: null })
        }
    }
    return (
        <>

            <div ref={textNodeRef} className="text-node" id={"text-node".concat(props.id)} onBlur={onBlurTextNode} style={{ overflowX: "hidden", overflowY: "auto", width: "100%", height: "100%" }}>
                {
                    (props.typeAPI.currentActive === props.id || props.content.title) || me.content.shrinked ?
                        <InlineTextEdit
                            ref={InlineTextEditRef}
                            id={`text-${props.id}`}
                            onChange={(e) => onChangeTitle(e)}
                            onSave={(e) => onSave(e)}
                            onFocus={(e) => onFocusTitle(e)}
                            text={props.content.title}
                            placeholder="ADD Title"
                            style={{ color: 'blue', fontSize: '20px', padding: '0px 10px', textAlign: !textLength ? 'center' : '' }}
                        />
                        : null
                }
                {
                    (props.typeAPI.currentActive === props.id || textLength) && !me.content.shrinked ?
                        <CustomEditor
                            ref={customEditorRef}
                            id={`custom-editor-${props.id}`}
                            onChange={(e) => onChangeTitle(e, 'text')}
                            onSave={(e) => onSave(e, 'text')}
                            onFocus={(e) => onFocusTitle(e)}
                            text={props.content.text}
                            placeholder="Enter your Text"
                            style={{ color: 'balck', fontSize: '12px', padding: '0px 10px', height: '100%' }}

                        />
                        : null
                }


            </div>
        </>
    )
}
export default TextCard;