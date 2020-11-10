import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../../store/hook';

const TextCardList = (props) => {
    const store = useStore();
    const cardId = props.id;
    const convLinks = () => {
        store.convertLinksToCitation(cardId);
    }
    return (
        <div>
            <button onClick={() => convLinks()}>Get Citations</button>
            <hr/>
        </div>
    )
}
export default observer(TextCardList);