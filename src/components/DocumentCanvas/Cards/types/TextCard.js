import React, { useRef, useEffect } from "react";
import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css'
import 'react-quill/dist/quill.bubble.css'
import InlineTextEdit from "../../../InlineTextEdit/InlineTextEdit";
import { gsap, Draggable } from "gsap/all";
gsap.registerPlugin(Draggable);
function TextCard(props) {
    const quillRef = useRef(null);
    const textNodeRef = useRef(null);
    const InlineTextEditRef = useRef(null);
    const me = props.typeAPI.cards[props.id];
    const textLength = props.content.text.replace(/<[^>]+>/g, ' ').replace(/^\s+|\s+$/g, '').split(/\s+/)[0];
    const pointerAtLast = () => {
        if (quillRef.current) {
            console.log(quillRef.current.getEditor())
            var quillEditor = quillRef.current.getEditor();
            const selectionIndex = quillEditor.getSelection()?.index;
            const totalTextLength = quillEditor.getText().length - 1;
            console.log(selectionIndex ? "Selection Index" : "LENGTh", selectionIndex)
            quillEditor.setSelection(selectionIndex ? selectionIndex : totalTextLength, 0);
        }
    }
    const pasteAtLast = (text) => {
        var quillEditor = quillRef.current.getEditor();
        console.log(quillEditor.selection)
        const selectionIndex = quillEditor.getSelection()?.index;
        setTimeout(() => {
            if (selectionIndex)
                quillEditor.setSelection(selectionIndex + text.length, 0);
        }, 1)
    }
    useEffect(() => {

        if (props.typeAPI.currentActive === props.id) {
            const clickedTarget = props.typeAPI.clickTargetGeneric;
            // console.log("cLICKED THROUGH STORE",clickedTarget? clickedTarget.tagName.toLowerCase():'no');
            if (me.content.initialRender)
                quillRef.current.focus();
            if (me.editing && !me.editing[props.typeAPI.userID]) {
                var quillEditor = quillRef.current.getEditor();
                quillEditor.enable(false)
            }
            if (clickedTarget) {
                if (clickedTarget.tagName.toLowerCase() === 'textarea')
                    InlineTextEditRef.current.focus();
                else if (textNodeRef.current.contains(clickedTarget))
                    quillRef.current.focus()
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

    let modules = {
        toolbar: ['bold', 'italic', 'underline', 'strike']
    }

    const onChangeQuill = (value) => {
        if (me.editing && me.editing[props.typeAPI.userID]) {
            props.typeAPI.saveContent(props.id, { text: value || "", title: props.content.title || null })
        }
    }
    const onSave = (e) => {
        e.stopPropagation();
        props.typeAPI.saveContent(props.id, { title: props.content.title || null, text: props.content.text })
    }
    const onChangeTitle = (event) => {
        props.typeAPI.changeContent(props.id, { title: event.target.value, text: props.content.text });
        event.stopPropagation();
    }
    const onBlurTextNode = (e) => {
        e.stopPropagation();
    }
    const onFocusTitle = (event) => {
        if (!textLength&&me.editing && me.editing[props.typeAPI.userID]) {
            const store = props.typeAPI;
            store.resize(props.id, { width: me.size.width, height: 200 });
            store.saveContent(props.id, { title: props.content.title || null, text: props.content.text, shrinked: null })
        }
    }
    return (
        <>

            <div ref={textNodeRef} className="text-node" id="text-node" onBlur={onBlurTextNode} onPaste={(e) => { pasteAtLast(e.clipboardData.getData('Text')) }} style={{ overflowX: "hidden", overflowY: "auto", width: "100%", height: "100%" }}>
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
                        <ReactQuill ref={quillRef}
                            theme="bubble"
                            value={me.content.text}
                            modules={modules}
                            onFocus={pointerAtLast}
                            placeholder="ADD A Body"
                            onChange={(value) => onChangeQuill(value)}
                        />
                        : null
                }


            </div>
        </>
    )
}
export default TextCard;