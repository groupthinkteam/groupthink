import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStore } from '../../../../store/hook';

const AudioCardList = (props) => {
    const store = useStore();
    return (
        <div>
            <button >Replace Audio</button>
            <hr/>
        </div>
    )
}
export default observer(AudioCardList);