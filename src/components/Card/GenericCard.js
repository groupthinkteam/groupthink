import React, { useEffect, useRef, useState } from "react";
import { gsap, Draggable } from "gsap/all";

import { useStore } from "../../store/hook";
import { observer } from "mobx-react-lite";

import cardChooser from "../DocumentCanvas/Cards/cardChooser";
import '../../styles/PopperMenu.scss';
import "../../styles/Cards/GenericCard.scss";
import MenuCard from "../DocumentCanvas/Cards/MenuList/MenuCard";
import menuListChooser from "../DocumentCanvas/Cards/menuListChooser";
import ReplaceFileList from "../DocumentCanvas/Cards/MenuList/ReplaceFileList";

// register gsap plugin so it doesn't get discarded during tree shake
gsap.registerPlugin(Draggable);

// wrapper for CardType that abstracts away some functionality common to all CardTypes
const GenericCard = props => {
    let store = useStore();
    let me = store.cards[props.id];
    const CardType = cardChooser(me.type);
    const MenuListType = menuListChooser(me.type);
    const cardRef = useRef(null);
    const blankRef = useRef(null);
    const [showPopper, setShowPopper] = useState(false);
    const [contextMenu, setContextMenu] = useState(null);
    const closeContextMenu = () => {
        setShowPopper(false);
        setContextMenu(null);
    }
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
                    onClick: () => { cardRef.current.focus(); setContextMenu(null); setShowPopper(false); },
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
    useEffect(() => {
        function handleClickOutside(event) {
            if (cardRef.current && !cardRef.current.contains(event.target)) {
                closeContextMenu();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [cardRef]);

    let editingUser = me.editing && !me.editing[store.userID] ? store.users[Object.keys(me.editing)[0]] : null;

    return (
        <>
            <div id={props.id} tabIndex={0}
                className="generic-card"
                ref={cardRef}
                onContextMenu={(event) => {
                    event.preventDefault();
                    var cardContainerElement = document.querySelector('.card-container');
                    let x = event.clientX + cardContainerElement.scrollLeft - me.position.x;
                    let y = event.clientY + cardContainerElement.scrollTop - 60 - me.position.y;
                    setContextMenu({ x: Math.abs(x), y: Math.abs(y) })
                    setShowPopper(false);
                }}
                onBlur={(e) => {
                    console.log("ONBLUR")
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
                }}
            >
                <div style={{ zIndex: 1, position: "absolute", padding: '10px', right: '17px', width: '35px' }} onClick={() => { setContextMenu(null); setShowPopper(!showPopper); }}>
                    <img alt='Menu' width="35px" src={require('../../assets/kebabMenu.png')} />
                </div>
                {
                    editingUser &&
                    <div className="generic-card-active-user-list">
                        <img className='generic-card-text-profile-pic' alt={editingUser.name} src={editingUser.photoURL} />
                        {editingUser.name} is editing...
                    </div>
                }
                <div className="blank-filler" ref={blankRef}
                    style={
                        contextMenu ?
                            { position: "absolute", top: contextMenu.y, left: contextMenu.x }
                            : { position: "absolute" }
                    }
                />
                {contextMenu || showPopper ?
                    <MenuCard
                        buttonref={showPopper ? cardRef.current : blankRef.current}
                        position="right-start"
                        offset={[0, 4]}
                        tooltipclass="tooltips"
                        arrowclass="arrow"
                        showpopper={true}//{store.currentActive === props.id}
                        pos={contextMenu}
                        zIndex={1}
                    >
                        <div>
                            <MenuListType id={props.id} content={{ ...me.content }} typeAPI={store} />
                            <ReplaceFileList type={me.type} id={props.id} typeAPI={store} />
                            <a href="/dashboard" style={{ color: "black" }}>edit</a>
                            <hr />
                            <p style={{ color: 'green', cursor: 'pointer' }} onClick={() => {
                                store.addCard({ x: me.position.x + 220, y: me.position.y + 220 }, { width: 310, height: 200 }, props.id, 'blank');
                                closeContextMenu();
                            }}
                            >
                                Add Child
                            </p>
                            <hr />
                            <p style={{ cursor: 'pointer', color: "red" }} onClick={() => {
                                store.removeCard(props.id, "recursive", store.cards[props.id]["parent"]);
                                closeContextMenu();
                            }}>
                                Delete
                            </p>
                            <hr />
                        </div>
                    </MenuCard>
                    : null
                }
                <CardType typeAPI={store} content={{ ...me.content }} size={{ ...me.size }} position={me.position} id={props.id} />

            </div>
        </>
    )
}

export default observer(GenericCard);