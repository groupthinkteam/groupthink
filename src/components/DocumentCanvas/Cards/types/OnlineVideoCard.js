import React, { useRef } from 'react';
import ReactPlayer from 'react-player/lazy';

import "../../../../styles/Cards/OnlineVideoCard.scss"

const OnlineVideoCard = (props) => {

    let playerRef = useRef()

    return (
        <div className="video-card">
            <div className="video-card-player">
                <ReactPlayer
                    url={props.content.url}
                    width={`${props.content.displayWidth}px`}
                    height={`${props.content.displayHeight}px`}
                    controls={true}
                    light={true}
                    onBlur={() => playerRef.current.showPreview()}
                    ref={playerRef}
                />
            </div>
            <a style={{ color: 'red' }} href={props.content.metadata.url}>
                <span className="video-card-title">{props.content.metadata.title}</span>
            </a>
        </div>
    )
}
export default React.memo(OnlineVideoCard);