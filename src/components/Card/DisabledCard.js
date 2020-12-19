import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStore } from '../../store/hook';
import cardChooser from '../DocumentCanvas/Cards/cardChooser';
import '../../styles/Cards/DisabledCard.scss'
const DisabledCard = (props) => {
    const store = useStore();
    const me = store.cards[props.id];
    const CardType = cardChooser(me.type);

    // resize card to fit inside 200px x 200px block
    let maxDimension = Math.max(me.size.height, me.size.width);
    let cardSize = 240;
    let scalingRatio = cardSize / maxDimension;

    return (
        <div
            id={props.id.concat('disabled')}
            onClick={props.handleClick}
            className="disabledcard"
            style={{
                width: me.size.width,
                height: me.size.height,
                transform: `scale(${scalingRatio})`,
            }}
        >
            <CardType typeAPI={store} content={{ ...me.content }} size={{ ...me.size }} position={me.position} id={props.id} />
        </div>
    )
}
export default observer(DisabledCard) 