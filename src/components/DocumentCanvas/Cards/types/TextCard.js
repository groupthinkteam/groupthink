import React, { useRef, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../../store/hook";
import { HtmlEditor,Floater, MenuBar } from '@aeaton/react-prosemirror'
import { options, menu } from '@aeaton/react-prosemirror-config-default'

import 'react-quill/dist/quill.bubble.css'
function TextCard(props) {
    const store = useStore();
    const quillRef = useRef(null);
    const me = store.cards[props.id];

    return (
        <div className="text-node" style={{ overflowX: "hidden", overflowY: "auto", width: "100%", height: "100%" }}>
            <HtmlEditor
                options={options}
                value={me.content.text}
                onChange={(value) => { props.typeAPI.saveContent(props.id, { text: value || "" }) }}
                render={({ editor, view }) => (
                    <div ref={quillRef}>
                        <Floater view={view}>
                            <MenuBar menu={{ marks: menu.marks }} view={view} />
                        </Floater>
                        {editor}
                    </div>
                )}
            />
        </div>
    )
}
export default observer(TextCard);