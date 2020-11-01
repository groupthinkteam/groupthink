import React from 'react';
import ReactPlayer from 'react-player/lazy';
/**
 * This Uploads The Video File in Storage And also can Stream the File.
 * @param {*} props - Property of File .
 * @property `typeAPI` , `content` , `id`
 */
const VideosCard = (props) => {
    return (
        <div>
            <ReactPlayer
                controls={true}
                url={props.content?.url}
                height={props.size.height}
                width={props.size.width}
                light
            />
        </div>
    )
}
export default React.memo(VideosCard);
