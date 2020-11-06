import React, { useEffect, useRef, useState } from "react";
import { gsap, Draggable } from "gsap/all";

import cardChooser from "../DocumentCanvas/Cards/cardChooser";

import "../../styles/Cards/GenericCard.scss";
import { useStore } from "../../store/hook";
import { observer } from "mobx-react-lite";
import CardMenu from '../PopperMenu/PopperMenu';
// register gsap plugin so it doesn't get discarded during tree shake
gsap.registerPlugin(Draggable);

// wrapper for CardType that abstracts away some functionality common to all CardTypes
const GenericCard = props => {
    let store = useStore();
    let me = store.cards[props.id];
    const CardType = cardChooser(me.type);
    const cardRef = useRef(null);
    const [showpopper, setShowPopper] = useState(false);
    const [rightClick, setRightClick] = useState({ isClicked: false, x: 0, y: 0 });

    // if size changes, animate it
    useEffect(() => { gsap.set("#".concat(props.id), me.size) }, [me, props.id])

    // update position
    useEffect(
        () => { gsap.set("#".concat(props.id), { opacity: 1, ...me.position, boxShadow: "0px 0px 0px 0px white" }) }
        , [props.id, me.position])
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
                    trigger: "#".concat(props.id),
                    // dragClickables: store.currentActive !== props.id,
                    dragClickables: false,
                    onClick: (e) => { setRightClick({ isClicked: e.button === 2, x: e.pageX, y: e.pageY }); cardRef.current.focus(); },
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
            if (cardRef.current  && !cardRef.current.contains(event.target) ) {
                setShowPopper(false);
                setRightClick({isClicked:false,x:0,y:0})
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
                onBlur={e => {
                    if (store.currentActive === props.id) {
                        store.currentActive = null;
                    }
                    e.stopPropagation();
                    store.removeUserEditing(props.id)
                }}
                onFocus={e => {
                    store.currentActive = props.id;
                    store.addUserEditing(props.id);
                    e.stopPropagation();
                }}
                onKeyDown={(e) => {
                    console.log("pressed ", e.key);
                    if (e.key === "Delete") {
                        store.removeCard(props.id, "recursive")
                    }
                }}
                tabindex="-1"
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
                <div style={{ position: "absolute", padding: '10px', right: '20px' }} onClick={() => setShowPopper(!showpopper)}>
                    <div className="barmenu"></div>
                    <div className="barmenu"></div>
                    <div className="barmenu"></div>
                </div>
                <CardMenu buttonref={cardRef}
                    position="right-start"
                    offset={[0, 4]}
                    tooltipclass="tooltips"
                    arrowclass="arrow"
                    showpopper={showpopper || rightClick.isClicked}
                >
                    <div> 
                        {/* //style={rightClick.isClicked ? { left: rightClick.x + "px", top: rightClick.y + "px" } : null}> */}
                        <p onClick={() => {
                            store.addCard({ x: me.position.x + 220, y: me.position.y + 220 }, { width: 310, height: 200 }, props.id, 'blank')
                           }}
                        >
                            Add Child
                        </p>

                        <a href="true" target="blank" style={{ color: "black" }}>change image</a>
                        <br />
                        <a href="/dashboard" style={{ color: "black" }}>edit</a>

                        <hr />
                        <p onClick={() => {
                            store.removeCard(props.id, "recursive");
                        }} style={{ color: "red" }}>
                            delete
                        </p>
                        <hr />
                        <button onClick={() => console.log("clicked Black and white")}>
                            Convert to B/W
                        </button>
                    </div>

                </CardMenu>
                <CardType position={me.position}  typeAPI={store} content={{ ...me.content }} size={{ ...me.size }} id={props.id} />
            </div>
        </>
    )
}


export default observer(GenericCard);