import React from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../../store/hook";

import { Editor } from 'react-draft-wysiwyg';
import { EditorState,ContentState, convertToRaw, convertFromHTML } from 'draft-js';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
function TextCard(props) {
    const store = useStore();
    const me = store.cards[props.id];
    
    
    const blocksFromHTML = convertFromHTML(me.content.text);
    const state = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap,
    );
    
    const setEditorChange = (editor) =>{
        const text = convertToRaw(editor.getCurrentContent()).blocks[0].text;
        props.typeAPI.saveContent(props.id, { text: text || "" }) 
    }
    
    return (
        <div className="text-node" style={{ overflowX: "auto", overflowY: "auto", width: "100%", height: "100%" }}>
            <Editor
                editorState={EditorState.createWithContent(state)}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={(e) => { setEditorChange(e);  }}
            />
        </div>
    )
}
export default observer(TextCard);


//padding:'43px 39px 40px',
    //console.log(document.querySelector('.ql-tooltip')?.classList.contains('ql-hidden'), toolbar)