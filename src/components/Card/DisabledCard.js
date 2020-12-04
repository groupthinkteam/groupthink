import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStore } from '../../store/hook';
import cardChooser from '../DocumentCanvas/Cards/cardChooser';

const DisabledCard = (props) =>{
    const store = useStore();
    const me = store.cards[props.id];
    const CardType = cardChooser(me.type);

    return(
        <div
        id={props.id.concat('disabled')}
        onClick={props.handleClick}
        style={{
            boxShadow: "0 11px 15px -7px rgba(51, 61, 78, 0.2), 0 9px 46px 8px rgba(51, 61, 78, 0.12), 0 24px 38px 3px rgba(51, 61, 78, 0.14)",
            duration: 0.5,
            width: me.size.width,
            height: me.size.height,
            borderTopLeftRadius: me.editingUser ? "0px" : "6px",
            
        }}
        >
            <CardType typeAPI={store} content={{ ...me.content }} size={{ ...me.size }} position={me.position} id={props.id}/>
        </div>
    )
}
export default observer( DisabledCard) 