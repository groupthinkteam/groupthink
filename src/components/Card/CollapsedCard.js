import { observer } from 'mobx-react-lite';
import React, { useEffect,useRef } from 'react';
import { useStore } from '../../store/hook';
import { gsap, Draggable } from "gsap/all";

gsap.registerPlugin(Draggable);

const CollapsedCard = (props) =>{
    const store = useStore();
    const me = store.cards[props.id];
    const cardRef = useRef(null);
    let count = 0;
    const countCollapseCard = (id) =>{
        const currentCard = store.cards[id];
        if(currentCard?.children)
        {
            count = count+Object.keys(currentCard.children).length
            Object.keys(currentCard.children).forEach(cardID=>{
                countCollapseCard(cardID)
            });
            return count;
        }
        else
        {
            return count
        }
        
    }
    useEffect(()=>{ gsap.set("#".concat(props.id), { opacity: 1, ...me.position, boxShadow: "0px 0px 0px 0px white" }) }
    , [props.id, me.position])
    // if size changes, animate it
    useEffect(() => { gsap.set("#".concat(props.id),{width: me.size.width,
    height: '50px'}) }, [me, props.id])

    useEffect(
        () => {
            // warning: can't use arrow functions here since that messes up the "this" binding
            
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
                    onClick: () => { cardRef.current.focus(); },
                    onDragStart: dragStart,
                    onDrag: function drag() {
                        
                        store.changePosition(props.id,{x: this.x, y: this.y })
                    },
                    onDragEnd: dragStop,
                    cursor: "grab",
                    activeCursor: "grabbing"
                })
            return () => y[0].kill();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [me.type, store.currentActive]
    );

    return (
        <div id={props.id} ref={cardRef} style={{
            position: "absolute",
            opacity: 0,
            width: '200px',
            height: '50px',
            borderTopLeftRadius: me.editingUser ? "0px" : "6px",
            tabIndex: -1,
            backgroundColor:'white'
        }}>
            {countCollapseCard(props.id)+1} Cards are Collapsed
        </div>
    )
}
export default observer(CollapsedCard);