import React, { useEffect, useRef, useState } from "react";
import { gsap, Draggable } from "gsap/all";

import { useStore } from "../../store/hook";
import { observer } from "mobx-react-lite";

import cardChooser from "../DocumentCanvas/Cards/cardChooser";
import '../../styles/PopperMenu.scss';
import "../../styles/Cards/GenericCard.scss";
import CardMenu from "../PopperMenu/PopperMenu";

// register gsap plugin so it doesn't get discarded during tree shake
gsap.registerPlugin(Draggable);

// wrapper for CardType that abstracts away some functionality common to all CardTypes
const GenericCard = props => {
    let store = useStore();
    let me = store.cards[props.id];
    const CardType = cardChooser(me.type);
    const cardRef = useRef(null);
    let blankRef = useRef(null);

    let [contextMenu, setContextMenu] = useState(null);

    // if size changes, animate it
    useEffect(() => { gsap.set("#".concat(props.id), me.size) }, [me, props.id])

    // update position
    useEffect(
        () => { gsap.set("#".concat(props.id), { opacity: 1, ...me.position, boxShadow: "0px 0px 0px 0px white" }) }
        , [props.id, me.position])
    // init draggable
    useEffect(
        () => {
            // warning: can't use arrow functions here since that messes up the "this" binding
            function drag() {
                me.position = { x: this.x, y: this.y }
            }
            function dragStop() {
                gsap.to("#".concat(props.id), {
                    boxShadow: "none",
                    duration: 0.5
                })
                store.savePosition(props.id, { x: this.x, y: this.y });
            }
            function dragStart() {
                gsap.to("#".concat(props.id), {
                    boxShadow: "0 11px 15px -7px rgba(51, 61, 78, 0.2), 0 9px 46px 8px rgba(51, 61, 78, 0.12), 0 24px 38px 3px rgba(51, 61, 78, 0.14)",
                    duration: 0.5
                })
            }
            let y = Draggable.create(
                "#".concat(props.id),
                {
                    autoScroll: 1,
                    allowContextMenu: true,
                    trigger: "#".concat(props.id),
                    // dragClickables: store.currentActive !== props.id,
                    dragClickables: false,
                    onClick: (e) => { cardRef.current.focus(); },
                    onDragStart: dragStart,
                    onDrag: drag,
                    onDragEnd: dragStop,
                    cursor: "grab",
                    activeCursor: "grabbing"
                })
            return () => y[0].kill();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [me.type, store.currentActive]
    );

    console.log("blankref", blankRef)
    console.log("contextmenu", contextMenu)
    let editingUser = me.editing && !me.editing[store.userID] ? store.users[Object.keys(me.editing)[0]] : null;

    return (
        <>
            <div id={props.id}
                className="generic-card"
                ref={cardRef}
                onContextMenu={(event) => {
                    event.preventDefault();
                    if (event.currentTarget.offsetParent && event.currentTarget.offsetParent.className === "container-filler") {
                        let x = event.clientX + event.currentTarget.offsetParent.scrollLeft - me.position.x;
                        let y = event.clientY + event.currentTarget.offsetParent.scrollTop - 60 - me.position.y;
                        setContextMenu({ x: x, y: y })
                    }
                }}
                onBlur={e => {
                    if (store.currentActive === props.id) {
                        store.currentActive = null;
                    }
                    e.stopPropagation();
                    store.removeUserEditing(props.id)
                }}
                onFocus={e => {
                    store.currentActive = props.id;
                    store.addUserEditing(props.id)
                    e.stopPropagation();
                }}
                onKeyDown={(e) => {
                    console.log("pressed ", e.key);
                    if (e.key === "Delete") {
                        store.removeCard(props.id, "recursive")
                    }
                }}
                style={{
                    position: "absolute",
                    opacity: 0,
                    width: me.size.width,
                    height: me.size.height,
                    borderTopLeftRadius: me.editingUser ? "0px" : "6px",
                    tabIndex: -1,
                }}>
                {
                    editingUser &&
                    <div className="generic-card-active-user-list">
                        <img className='generic-card-text-profile-pic' alt={editingUser.name} src={editingUser.photoURL} />
                        {editingUser.name} is editing...
                    </div>
                }
                <CardType typeAPI={store} content={{ ...me.content }} size={{ ...me.size }} position={me.position} id={props.id} />
                <div className="blank-filler" ref={blankRef}
                    style={contextMenu ? { position: "absolute", top: contextMenu.y, left: contextMenu.x, height: 10, width: 10, backgroundColor: "black" } : { position: "absolute" }} />
                {contextMenu && blankRef.current ?
                    <CardMenu
                        buttonref={blankRef.current}
                        position="right-start"
                        offset={[0, 0]}
                        tooltipclass="tooltips"
                        arrowclass="arrow"
                        showpopper={true}
                        onBlur={(e) => { console.log("called blur", e); setContextMenu(null) }}
                        pos={contextMenu}
                    >
                        Hello
                    </CardMenu>
                    : null
                }
            </div>
        </>
    )
}

export default observer(GenericCard);