import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStore } from '../../../../store/hook';

const ImageCardList = (props) => {
    const store = useStore();
    const metadata = props.content.metadata;
    const convImage = () => {
        props.setShowLoader(true);
        store.convertImageToBW(metadata.fullPath, metadata.contentType, metadata.customMetadata, (bool) => props.setShowLoader(false));
    }
    return (
        <div>
            <button onClick={() => convImage()}>Convert to B/W</button>
            <hr/>
        </div>
    )
}
export default observer(ImageCardList);