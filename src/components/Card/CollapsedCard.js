import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useStore } from '../../store/hook';
import { gsap, Draggable } from "gsap/all";
import "../../styles/Cards/GenericCard.scss";
gsap.registerPlugin(Draggable);

const CollapsedCard = (props) =>{
    const store = useStore();
    const me = store.cards[props.id];
    let count = 1;
    const childArray = {};
    const countCollapseCard = (id) =>{
        const currentCard = store.cards[id];
        if(currentCard?.children)
        {
            count = count+Object.keys(currentCard.children).length
            Object.keys(currentCard.children).forEach(cardID=>{
                const collapsedCard = store.cards[cardID];
                //Cards Will be relative to the collapsed top parent (props.id)
                const x_DIff =collapsedCard.position.x - me.position.x;
                const y_Diff = collapsedCard.position.y - me.position.y;
                // This Records all Childs and SubChilds Counts And Position DIfference
                childArray[cardID]={x:x_DIff,y:y_Diff};
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
                //Save relative position w.r.t. parent
                Object.entries(childArray).forEach(([cardId,value])=>{
                    store.savePosition(cardId,{x:this.x+value.x, y:this.y+value.y});
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
                    onClick: () => { },
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
        }, []
    );

    return (
        <div id={props.id}  className="collapse-card generic-card" style={{
            position: "absolute",
            opacity: 0,
            width: '200px',
            height: '50px',
            borderTopLeftRadius: me.editingUser ? "0px" : "6px",
            tabIndex: -1,
            backgroundColor:'white'
        }}>
            {countCollapseCard(props.id)} Cards are Collapsed
        </div>
    )
}
export default observer(CollapsedCard);