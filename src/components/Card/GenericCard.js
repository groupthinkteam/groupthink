import React, { useEffect, useRef, useState } from "react";
import { gsap, Draggable } from "gsap/all";

import { useStore } from "../../store/hook";
import { observer } from "mobx-react-lite";

import cardChooser from "../DocumentCanvas/Cards/cardChooser";
import '../../styles/PopperMenu.scss';
import "../../styles/Cards/GenericCard.scss";
import MenuCard from "../DocumentCanvas/Cards/types/MenuCard";
import ContextMenu from "../ContextMenu/ContextMenu";
import cardSizeConstant from "../../constants/CardSizeConstant";

// register gsap plugin so it doesn't get discarded during tree shake
gsap.registerPlugin(Draggable);

// wrapper for CardType that abstracts away some functionality common to all CardTypes
const GenericCard = props => {
    const store = useStore();
    const me = store.cards[props.id];
    const CardType = cardChooser(me.type);
    const cardRef = useRef(null);
    const blankRef = useRef(null);
    const [isDragging, setDragging] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [contextMenu, setContextMenu] = useState(false);

    const closeContextMenu = () => {
        store.currentContext = null;
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
            var $bottom = document.createElement("div");
            const cardDOM = document.getElementById(props.id).style;

            function calculateSize() {
                var height = Math.max(parseInt(cardDOM.height), parseInt(cardSizeConstant[me.type].minHeight))
                height = Math.min(parseInt(cardSizeConstant[me.type].maxHeight), height);
                var width = Math.max(parseInt(cardDOM.width), parseInt(cardSizeConstant[me.type].minWidth))
                width = Math.min(parseInt(cardSizeConstant[me.type].maxWidth), width);
                return { width: width, height: height }
            }
            function getMatrix(element) {
                const values = element.transform.split(/\w+\(|\);?/);
                const transform = values[1].split(',');
                return {
                    x: parseInt(transform[0]),
                    y: parseInt(transform[1])
                };
            }
            function onResizeDragEnd() {
                store.resize(props.id, calculateSize());
                const cardDomSize = getMatrix(cardDOM);
                store.savePosition(props.id, cardDomSize)
            }
            var rightLastX = 0;
            var bottomLastY = 0;
            var bottomDraggable = new Draggable($bottom, {
                trigger: `${"#bottom-right-generic".concat(props.id)}`,
                cursor: "nwse-resize",
                activeCursor: "nwse-resize",
                autoScroll: 1,
                onDrag: updateBottom,
                onDragStart: closeContextMenu,
                onDragEnd: onResizeDragEnd,
                onPress: function () {
                    rightLastX = this.x;
                    bottomLastY = this.y;
                    y[0].disable();
                },
                onRelease: function () {
                    y[0].enable();
                }
            });

            function updateBottom() {
                var diffY = this.y - bottomLastY;
                var diffX = this.x - rightLastX;
                gsap.set("#".concat(props.id), { height: "+=" + diffY, width: "+=" + diffX });
                bottomLastY = this.y;
                rightLastX = this.x;
                store.changeSize(props.id, calculateSize());
            }
            var childArray = {};
            // warning: can't use arrow functions here since that messes up the "this" binding
            function dragStop() {
                setDragging(false);
                function findClosestAxisPoint(val) {
                    let gridSize = 10;
                    return Math.round(val / gridSize) * gridSize;
                }
                let newPosition = {
                    x: findClosestAxisPoint(this.x),
                    y: findClosestAxisPoint(this.y)
                }
                gsap.to("#".concat(props.id), {
                    boxShadow: "none",
                    duration: 0.5,
                    // ...newPosition
                })
                //container size
                store.saveContainerSize();
                store.savePosition(props.id, newPosition);
                //Selected card Drag
                if (store.selectedCards.length && Object.entries(childArray).length) {
                    Object.entries(childArray).forEach(([cardId, value]) => {
                        store.savePosition(cardId, { x: this.x + value.x, y: this.y + value.y });
                    })
                }
            }
            function dragStart() {
                gsap.to("#".concat(props.id), {
                    boxShadow: "0 11px 15px -7px rgba(51, 61, 78, 0.2), 0 9px 46px 8px rgba(51, 61, 78, 0.12), 0 24px 38px 3px rgba(51, 61, 78, 0.14)",
                    duration: 0.5
                });
                if (store.selectedCards.length && store.selectedCards.includes(props.id)) {
                    // console.log("SELECTED CARD DRAG START ", store.selectedCards,childArray)
                    childArray = {};
                    store.selectedCards.forEach(cardID => {
                        const draggedCard = store.cards[cardID];
                        const x_DIff = draggedCard.position.x - me.position.x;
                        const y_Diff = draggedCard.position.y - me.position.y;
                        childArray[cardID] = { x: x_DIff, y: y_Diff };
                    });
                }
                setDragging(true);
            }
            let y = Draggable.create(
                "#".concat(props.id),
                {
                    autoScroll: 1,
                    allowContextMenu: true,
                    trigger: "#".concat(props.id),
                    dragClickables: store.currentActive !== props.id,
                    // dragClickables: true, //me.type === 'text',//false,
                    onClick: (e) => {
                        childArray = {};
                        if (e.shiftKey) {
                            console.log("SELECTED CARD ", store.selectedCards)
                            if (store.selectedCards.includes(props.id)) {
                                const indexOf = store.selectedCards.indexOf(props.id);
                                store.selectedCards.splice(indexOf, 1);
                            }
                            else
                                store.selectedCards.push(props.id);
                        }
                        else if (store.currentActive !== props.id) {
                            store.currentActive = props.id;
                            //Color Coding
                            store.cardGrouped = [];
                            store.groupCardsParent(props.id)
                            store.groupCardsChildren(props.id)
                            store.addUserEditing(props.id, 'editing');
                            store.selectedCards = [];
                        }
                        else {
                            store.selectedCards = [];
                        };
                        e.stopPropagation();
                    },
                    onDragStart: dragStart,
                    onDrag: function drag() {
                        if (this.x > parseInt(store.container.width)) {
                            store.changeContainerSizeLocal({ width: `${this.x}px`, height: store.container.height })
                        }
                        else if (this.y > parseInt(store.container.height)) {
                            store.changeContainerSizeLocal({ height: `${this.y}px`, width: store.container.width })
                        }
                        else {
                            store.changeContainerSizeLocal({ width: `10000px`, height: '10000px' })
                        }
                        //Selected Card Drag
                        if (store.selectedCards.length && Object.entries(childArray).length) {
                            Object.entries(childArray).forEach(([cardId, value]) => {
                                store.changePosition(cardId, { x: this.x + value.x, y: this.y + value.y });
                            })
                        }
                        store.changePosition(props.id, { x: this.x, y: this.y });
                        y[0].update(true)
                    },
                    onDragEnd: dragStop,
                    cursor: "grab",
                    activeCursor: "grabbing",

                })
            if (store.isSelectingCard) {
                y[0].disable();
            }
            return () => {
                y[0].kill();
                bottomDraggable.kill();
                $bottom.remove();
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [me.type, store.currentActive, store.isSelectingCard]
    );

    const editingUser = me.editing ? store.users[Object.keys(me.editing)[0]] : null;
    let showIncompatibleOverlay = (store.isSelectingCard && !store.actionsList[store.selectedAction]["types"].includes(me.type))
    let showCompatibleOverlay = (store.isSelectingCard && store.actionsList[store.selectedAction]["types"].includes(me.type))

    return (
        <>
            <div id={props.id}
                className={"generic-card" +
                    (showCompatibleOverlay ? " compat-cursor" : "") +
                    (store.cardGrouped.includes(props.id) ? " grouped-card " : "") +
                    (store.currentActive === props.id ? " active-card" : "")
                }
                ref={cardRef}
                onContextMenu={(event) => {
                    event.preventDefault();
                    store.currentContext = props.id;
                    store.currentActive = props.id;
                    var cardContainerElement = document.querySelector('.card-container');
                    var x = Math.floor(event.clientX / store.zoom + cardContainerElement.scrollLeft / store.zoom - me.position.x);
                    var y = Math.floor(event.clientY / store.zoom + cardContainerElement.scrollTop / store.zoom - me.position.y - 50);
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
                onKeyDown={(e) => {
                    if (e.key === "Delete" && me.type !== "text") {
                        store.removeCard(props.id, "reparent", me.parent)
                    }
                }}
                style={{
                    position: "absolute",
                    opacity: 0,
                    width: me.size.width,
                    height: me.size.height,
                    minHeight: cardSizeConstant[me.type].minHeight,
                    minWidth: cardSizeConstant[me.type].minWidth,
                    maxHeight: cardSizeConstant[me.type].maxHeight,
                    maxWidth: cardSizeConstant[me.type].maxWidth,
                    borderTopLeftRadius: me.editingUser ? "0px" : "6px",
                    tabIndex: -1,
                    zIndex: 1
                }}
            >
                {
                    me.type === 'text' ?
                        <div className="bottom-right-generic" id={"bottom-right-generic".concat(props.id)} />
                        : null
                }
                {
                    store.selectedCards.includes(props.id) ?
                        <div className="action-loader">
                            <div className="loader-text">
                                This Card is Selected
                            </div>
                        </div>
                        : null
                }
                {
                    me.type === 'text' && me.editing && !me.editing[store.userID] ?
                        <div className="action-loader">
                            <div className="loader-text">
                                {editingUser.name} is Editing this
                            </div>
                        </div>
                        : null
                }
                {showLoader ?
                    <div className="action-loader">
                        <div className="loader-text">
                            ▶️ Running Action...
                        </div>
                    </div>
                    : null}
                {
                    showIncompatibleOverlay ?
                        <div className="action-loader">
                            <div className="loader-text">
                                Not compatible with {store.actionsList[store.selectedAction]["title"]}
                            </div>
                        </div>
                        : null
                }
                {
                    showCompatibleOverlay ?
                        <div className="compatible-overlay" onClick={() => {
                            setShowLoader(true);
                            // exit Action Mode
                            function onActionCompleted(result) {
                                setShowLoader(false);
                                store.isSelectingCard = false;
                                store.selectedAction = null;
                            }
                            store.runAction(store.selectedAction, props.id, onActionCompleted)
                        }} />
                        : null
                }
                {/* <button className="kebab"
                    onClick={() => {
                        store.currentContext = props.id;
                        setContextMenu(null);
                    }}

                >
                    <img alt='Menu' width="5px" src={require('../../assets/kebab.svg')} />
                </button> */}
                {
                    // editingUser &&
                    // <div className="generic-card-active-user-list">
                    //     <img className='generic-card-text-profile-pic' alt={editingUser.name} src={editingUser.photoURL} />
                    //     {editingUser.name} is editing...
                    // </div>
                }
                <div id={(props.id).concat('blank-filler')} className="blank-filler" ref={blankRef}
                    style={
                        contextMenu && store.currentContext === props.id ?
                            { zIndex: 1, position: "absolute", top: contextMenu.y, left: contextMenu.x }
                            : { zIndex: 1, position: "absolute" }
                    }
                />
                {store.currentContext === props.id ?
                    <MenuCard
                        buttonref={!contextMenu ? cardRef.current : blankRef.current}
                        position="right-start"
                        offset={[0, (1 - store.zoom) * me.size.width + 16]}
                        tooltipclass="tooltips"
                        arrowclass="arrow"
                        showpopper={true}//{store.currentActive === props.id}
                        pos={contextMenu}
                        zIndex={1}
                    >
                        <ContextMenu id={props.id} loaderCallback={(bool) => setShowLoader(bool)} closeContextMenu={closeContextMenu} />
                    </MenuCard>
                    : null
                }
                <CardType typeAPI={store} content={{ ...me.content }} size={{ ...me.size }} position={me.position} id={props.id} />
            </div>
        </>
    )
}

export default observer(GenericCard);

