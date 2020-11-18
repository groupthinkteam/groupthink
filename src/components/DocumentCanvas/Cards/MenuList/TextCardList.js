import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../../store/hook';

const TextCardList = (props) => {
    const store = useStore();
    const cardId = props.id;
    const convLinks = (citationStyle) => {
        props.setShowLoader(true)
        // TODO if bool is false, the operation failed, show error
        store.convertLinksToCitation(cardId, citationStyle, (bool) => props.setShowLoader(false))
    }
    return (
        <div>
            <button onClick={() => convLinks("apa")}>
                APA Citations</button>
            <hr/>
            <button onClick={() => convLinks("harvard1")}>Harvard Citations</button>
            <hr/>
            <button onClick={() => convLinks("vancouver")}>Vancouver</button>
            <hr/>
        </div>
    )
}
export default observer(TextCardList);