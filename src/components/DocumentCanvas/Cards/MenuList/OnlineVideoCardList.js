import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStore } from '../../../../store/hook';

const OnlineVideoCardList = (props) => {
    const store = useStore();
    return (
        <div>
            <button >Change Link</button>
            <hr/>
        </div>
    )
}
export default observer(OnlineVideoCardList);