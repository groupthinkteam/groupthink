import React, { useRef } from 'react';
import ReactPlayer from 'react-player/lazy';

import "../../../../styles/Cards/OnlineVideoCard.scss"
import ShrinkedCard from './ShrinkedCard';

const OnlineVideoCard = (props) => {

    let playerRef = useRef()
    const store = props.typeAPI;
    if (store.cards[props.id]?.cardShrinked)
        return (
            <ShrinkedCard url={props.content.metadata.url} title={props.content.metadata.title}/>
        )
    else
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
                <a href={props.content.metadata.url}>
                    <span className="video-card-title">
                        {props.content.metadata.title}
                    </span>
                </a>
            </div>
        )
}
export default React.memo(OnlineVideoCard);