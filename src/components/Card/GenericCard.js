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
    const [isDragging, setDragging] = useState(false);
    const [showPopper, setShowPopper] = useState(false);
    const [contextMenu, setContextMenu] = useState(null);
    const [showLoader, setShowLoader] = useState(false);
    const closeContextMenu = () => {
        setShowPopper(false);
        setContextMenu(null);
    }
    // if size changes, animate it
    useEffect(() => { gsap.set("#".concat(props.id), me.size) }, [me, props.id])

    // update position
    useEffect(
        () => {
            if (isDragging) return () => { };
            else gsap.to("#".concat(props.id), { opacity: 1, ...me.position, duration: 0.2 })
        }
        , [props.id, me.position, isDragging])

    // init draggable
    useEffect(
        () => {
            // warning: can't use arrow functions here since that messes up the "this" binding
            function dragStop() {
                gsap.to("#".concat(props.id), {
                    boxShadow: "none",
                    duration: 0.5
                })
                setDragging(false);
                store.savePosition(props.id, { x: this.x, y: this.y });
            }
            function dragStart() {
                gsap.to("#".concat(props.id), {
                    boxShadow: "0 11px 15px -7px rgba(51, 61, 78, 0.2), 0 9px 46px 8px rgba(51, 61, 78, 0.12), 0 24px 38px 3px rgba(51, 61, 78, 0.14)",
                    duration: 0.5
                })
                setDragging(true);
            }
            let y = Draggable.create(
                "#".concat(props.id),
                {
                    autoScroll: 1,
                    allowContextMenu: true,
                    trigger: "#".concat(props.id),
                    // dragClickables: store.currentActive !== props.id,
                    dragClickables: false,
                    onClick: () => { cardRef.current.focus(); closeContextMenu(); },
                    onDragStart: dragStart,
                    onDrag: function drag() {
                        store.changePosition(props.id, { x: this.x, y: this.y })
                    },
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
                    store.currentContext = props.id;
                    var cardContainerElement = document.querySelector('.card-container');
                    setShowPopper(false);
                    var x = Math.floor(event.clientX / store.zoom + cardContainerElement.scrollLeft / store.zoom - me.position.x);
                    var y = Math.floor(event.clientY / store.zoom + cardContainerElement.scrollTop / store.zoom - me.position.y - 40);
                    if (store.zoom === 1) {
                        setContextMenu({ x: x, y: y })
                    }
                    else
                        setContextMenu({
                            x: store.zoom >= 1 ? x - 3 : x + 7 - store.zoom,
                            y: store.zoom >= 1 ? y + 20 : y - 30 - store.zoom,
                            offsetX: store.zoom >= 1 ? 0 : x * store.zoom, //left
                            offsetY: store.zoom >= 1 ? y : y * store.zoom //top
                        })
                }}
                onBlur={(e) => {
                    console.log("ONBLUR")
                    if (store.currentActive === props.id) {
                        store.currentActive = null;
                    }
                    e.stopPropagation();
                    store.removeUserEditing(props.id, 'editing')
                }}
                onFocus={e => {
                    store.currentActive = props.id;
                    store.addUserEditing(props.id, 'editing')
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
                    zIndex: 1
                }}
            >
                {showLoader
                    ? <div className="action-loader">
                        <div className="loader-text">
                            ▶️ Running Action...
                    </div>
                    </div>
                    : null}
                <button className="kebab" onClick={() => {
                    store.currentContext = props.id;
                    setContextMenu(null); setShowPopper(!showPopper);
                }}>
                    <img alt='Menu' width="5px" src={require('../../assets/kebab.svg')} />
                </button>
                {
                    editingUser &&
                    <div className="generic-card-active-user-list">
                        <img className='generic-card-text-profile-pic' alt={editingUser.name} src={editingUser.photoURL} />
                        {editingUser.name} is editing...
                    </div>
                }
                <div id={(props.id).concat('blank-filler')} className="blank-filler" ref={blankRef}
                    style={
                        contextMenu && store.currentContext === props.id ?
                            { zIndex: 1, position: "absolute", top: contextMenu.y, left: contextMenu.x, height: 10, width: 10, backgroundColor: "black" }
                            : { zIndex: 1, position: "absolute" }
                    }
                />
                {(contextMenu || showPopper) && store.currentContext === props.id ?
                    <MenuCard
                        buttonref={showPopper ? cardRef.current : blankRef.current}
                        position="right-start"
                        offset={[0, store.zoom * (-281.25) + 285]}
                        tooltipclass="tooltips"
                        arrowclass="arrow"
                        showpopper={true}//{store.currentActive === props.id}
                        pos={contextMenu}
                    //zIndex={1}
                    >
                        <div>
                            <MenuListType id={props.id} content={{ ...me.content }} typeAPI={store} setShowLoader={(bool) => setShowLoader(bool)} />
                            <ReplaceFileList type={me.type} id={props.id} typeAPI={store} />
                            <a href="/dashboard" style={{ color: "black" }}>edit</a>
                            <hr />
                            <p style={{ color: 'green', cursor: 'pointer' }} onClick={() => {
                                store.addCard({ x: me.position.x + 50, y: me.position.y + me.size.height + 50 }, { width: 275, height: 45 }, props.id, 'blank');
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