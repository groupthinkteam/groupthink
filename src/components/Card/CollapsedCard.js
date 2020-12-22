import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef } from 'react';
import { useStore } from '../../store/hook';
import { gsap, Draggable } from "gsap/all";
import "../../styles/Cards/CollapseCard.scss";
gsap.registerPlugin(Draggable);

const CollapsedCard = (props) => {
    const store = useStore();
    const me = store.cards[props.id];
    let count = 1;
    const childArray = {};
    const arrayTypeCount = {};
    const collapseCardRef = useRef(null);
    const countCollapseCard = (id) => {
        const currentCard = store.cards[id];
        const check = 1;
        if (arrayTypeCount[currentCard.type]) {
            arrayTypeCount[currentCard.type] = arrayTypeCount[currentCard.type] + 1
        }
        else arrayTypeCount[currentCard.type] = check

        if (currentCard?.children) {
            count = count + Object.keys(currentCard.children).length
            Object.keys(currentCard.children).forEach(cardID => {
                const collapsedCard = store.cards[cardID];
                //Cards Will be relative to the collapsed top parent (props.id)
                const x_DIff = collapsedCard.position.x - me.position.x;
                const y_Diff = collapsedCard.position.y - me.position.y;
                // This Records all Childs and SubChilds Counts And Position DIfference
                childArray[cardID] = { x: x_DIff, y: y_Diff };
                countCollapseCard(cardID)
            });
            return [arrayTypeCount, count];
        }
        else {
            return [arrayTypeCount, count];
        }

    }
    const changeCurrentActive = () => {
        if (store.currentActive === props.id) {
            store.currentActive = null;
        }
    }
    useEffect(() => { gsap.set("#".concat(props.id), { opacity: 1, ...me.position, boxShadow: "0px 0px 0px 0px white" }) }
        , [props.id, me.position])
    // if size changes, animate it
    // useEffect(() => { gsap.set("#".concat(props.id), { width: 275, height: 45 }) }, [me, props.id])

    useEffect(
        () => {
            // warning: can't use arrow functions here since that messes up the "this" binding

            function dragStop() {
                gsap.to("#".concat(props.id), {
                    boxShadow: "none",
                    duration: 0.5
                })
                store.savePosition(props.id, { x: this.x, y: this.y });
                //Save relative position w.r.t. parent
                Object.entries(childArray).forEach(([cardId, value]) => {
                    store.savePosition(cardId, { x: this.x + value.x, y: this.y + value.y });
                    store.collapseCard(cardId);
                })
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
                    onClick: () => { collapseCardRef.current.focus(); },
                    onDragStart: dragStart,
                    onDrag: function drag() {
                        gsap.to("#".concat(props.id), {
                            boxShadow: "0 11px 15px -7px rgba(51, 61, 78, 0.2), 0 9px 46px 8px rgba(51, 61, 78, 0.12), 0 24px 38px 3px rgba(51, 61, 78, 0.14)",
                            duration: 0.5
                        })
                        store.changePosition(props.id, { x: this.x, y: this.y })
                    },
                    onDragEnd: dragStop,
                    cursor: "grab",
                    activeCursor: "grabbing"
                })
            return () => y[0].kill();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []
    );
    useEffect(() => {
        function handleClickOutside(event) {
            if (collapseCardRef.current && !collapseCardRef.current.contains(event.target)) {
                store.clickTargetGeneric = '';
                if (store.currentActive === props.id) {
                    store.currentActive = null;
                }
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [collapseCardRef, store.clickTargetGeneric, props.id, store.currentActive]);

    function typeToImage(type) {
        function sanitizeType() {
            switch (type) {
                case "blank":
                    return "text"
                case "text":
                    return "text"
                case "VideoLink":
                    return "video"
                case "video":
                    return "video"
                case "VideoFile":
                    return "video"
                case "image":
                    return "image"
                case "audio":
                    return "audio"
                case "link":
                    return "link"
                case "file":
                    return "file"
                default:
                    return "text"
            }
        }
        return (
            <img className="type-icon" src={require("../../assets/card-icons/" + sanitizeType() + ".svg")} alt={type} />
        )
    }

    return (
        <div id={props.id}
            ref={collapseCardRef}
            className="collapsed-card "
            tabIndex={0}
            onLoad={changeCurrentActive}
            onBlur={(e) => {
                changeCurrentActive();
                e.stopPropagation();
                store.removeUserEditing(props.id, 'editing')
            }}
            onFocus={e => {
                store.currentActive = props.id;
                store.addUserEditing(props.id, 'editing')
                e.stopPropagation();
            }}
            style={{
                position: "absolute",
                opacity: 0,
                // width: 275,
                // height: 45,
                borderTopLeftRadius: me.editingUser ? "0px" : "6px",
                tabIndex: -1,
                textAlign: 'center',
                backgroundColor: 'white'
            }}>
            <div className="collapsed-cards-list">
                {
                    countCollapseCard(props.id)
                        .filter((item) => typeof item === 'object')
                        .map((item) => {
                            return Object.entries(item).map(([type, count]) =>
                                <div className="card-count-indicator">
                                    {count}
                                    {typeToImage(type)}
                                </div>
                            )
                        })
                }
            </div>
        </div>
    )
}
export default observer(CollapsedCard);