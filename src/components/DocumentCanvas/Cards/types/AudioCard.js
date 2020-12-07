import React from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/src/styles.scss';
import "../../../../styles/Cards/AudioCard.scss";

/**
 * This File Shows the Input of Audio File .
 * @param {*} props 
 */
const AudioCard = (props) => {
    return (
        <div className="audio-card">
            {props.content.metadata.name}
            <AudioPlayer
                src={props.content.url}
                showDownloadProgress="false"
                preload="metadata"
                style={{ width: "100%" }}
            />
        </div>

    )
}
export default React.memo(AudioCard);
