import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStore } from '../../../../store/hook';

const TextCardList = (props) => {
    const store = useStore();
    return (
        <div>
            <button>Reparent</button>
            <hr/>
        </div>
    )
}
export default observer(TextCardList);