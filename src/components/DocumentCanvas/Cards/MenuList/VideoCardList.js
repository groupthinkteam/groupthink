import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStore } from '../../../../store/hook';

const VideoCardList = (props) => {
    const store = useStore();
    return (
        <div>
            <button >Replace Video</button>
            <hr/>
        </div>
    )
}
export default observer(VideoCardList);