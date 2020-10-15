import React, { useEffect, useRef, useState } from "react";
import { gsap, Draggable } from "gsap/all";

import cardChooser from "./cardChooser";

import "../../../styles/Cards/GenericCard.scss";

/**
 * TODO :-
 * Check Multiple Uploaded File Renders in single card
 * Files Card Having Different Name ...Correction Needed
 */

// register gsap plugin so it doesn't get discarded during tree shake
gsap.registerPlugin(Draggable);

// wrapper for CardType that abstracts away some functionality common to all CardTypes
function GenericCard(props) {

    const [isActive, setActive] = useState(false)
    const [isDragging, setDragging] = useState(false)
    const CardType = cardChooser(props.card?.type, props.isLocked);
    const cardRef = useRef(null);
    const [isSearched, setIsSearched] = useState(false);
    const [highlightText, setHighlightText] = useState();
    
    const activeUsers = () => {
        props.genericAPI.isActiveUserInfo()
    }
    const removeActiveUsers = () => props.genericAPI.removeActiveUser();
    // if size changes, animate it
    useEffect(() => {
        if (props.result?.length > 0)
            Object.entries(props.result).map(([key, value]) => {
                const term = value.terms[0];
                // console.log('ENtries', key, value, value.match[term][0])
                if (value.id === props.id) {
                    setIsSearched(true);
                    switch (value.match[term][0]) {
                        case 'title':
                            setHighlightText({ title: term });
                            break;
                        case 'content.url':
                            break;
                        case 'fileName':
                            setHighlightText({ fileName: term });
                            break;
                        default:
                            setHighlightText({ text: term });
                            break;
                    }
                }
            })
        else
            setIsSearched(false)
    }, [props])
    useEffect(
        () => {
            gsap.set("#".concat(props.id), { ...props.card.size })
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.card.size.height, props.card.size.width]
    )
    useEffect(
        () => { gsap.set("#".concat(props.id), { opacity: 1, ...props.card.position, boxShadow: "0px 0px 0px 0px white" }) }
        , [props.id, props.card.position])
    useEffect(
        () => {
            // warning: can't use arrow functions here since that messes up the "this" binding
            function drag() {
                console.log("now that was a drag");
                // this.update();
            }
            function dragStop() {
                setDragging(false);
                gsap.to("#".concat(props.id), {
                    boxShadow: "none",
                    duration: 0.5
                })
                props.genericAPI.savePosition(props.id, { x: this.x, y: this.y });
            }
            function dragStart() {
                setDragging(true);
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
                    dragClickables: !isActive,
                    onClick: () => { cardRef.current.focus(); setActive(true); activeUsers(); },
                    onDragStart: dragStart,
                    onDrag: drag,
                    onDragEnd: dragStop,
                    cursor: "grab",
                    activeCursor: "grabbing"
                })
            return () => y[0].kill()
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [isActive]
    )
    // console.log("USER INFO",isActive)
    return (
        <>
            <div id={props.id} tabIndex={0}
                className={(isActive ? "generic-card active-card" : "generic-card")
                    + (isDragging ? " dragging-card" : "")
                    + (isSearched ? " searched-card" : '')
                }
                ref={cardRef}
                onFocus={() => setActive(true)}
                onBlur={() => { console.log("called blur"); setActive(false); removeActiveUsers(); }}
                onKeyDown={(e) => {
                    console.log("pressed ", e.key);
                    if (e.key === "Delete") {
                        props.genericAPI.removeCard(props.id, "recursive")
                    }
                }}
                style={{
                    position: "absolute",
                    opacity: 0
                }}>
                {
                    props.userListDetail && isActive ?
                        Object.entries(props.userListDetail).filter(([key, val]) => val.isEditingUser).map(([key, val]) =>
                            <img alt="user" src={val.photoURL} className="generic-card-text-profile-pic" />)
                        : null
                }
                <div style={{ width: "100%", height: props.card.size.height, position: "absolute", top: 0, boxShadow: "0 1px 2px 0 rgba(51,61,78,0.25)" }}>
                    <CardType typeAPI={props.typeAPI} content={props.card.content} highlightText={highlightText} size={props.card.size} id={props.id} isLocked={props.isLocked} />
                </div>
            </div>
        </>
    )
}

export default React.memo(GenericCard);