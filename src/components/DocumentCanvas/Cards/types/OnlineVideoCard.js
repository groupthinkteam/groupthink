import React, { useRef } from 'react';
import ReactPlayer from 'react-player/lazy';
/**
 * This is an Offline Link Card Shows Videos And Audio Player .
 * @param {*} props - Property of File .
 * @property `typeAPI` , `content` , `id`
 */
const OnlineVideoCard = (props) => {

    let playerRef = useRef()

    return (
        <div>
            <ReactPlayer
                url={props.content.url}
                width={`${props.size.width}px`}
                height={`${props.size.height}px`}
                controls={true}
                light={true}
                onBlur={()=>playerRef.current.showPreview()}
                ref={playerRef}
            />
            <a style={{ color: 'red' }} href={props.content.metadata.url}>
                {props.content.metadata.title}
            </a>
        </div>
    )
}
export default React.memo(OnlineVideoCard);