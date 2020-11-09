import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStore } from '../../../../store/hook';

const FileCardList = (props) => {
    const store = useStore();
    return (
        <div>
            <button >Replace Audio</button>
            <hr/>
        </div>
    )
}
export default observer(FileCardList);