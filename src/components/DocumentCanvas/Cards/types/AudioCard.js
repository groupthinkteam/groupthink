import React from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/src/styles.scss';
/**
 * This File Shows the Input of Audio File .
 * @param {*} props 
 */
const AudioCard = (props) => {
    return (
        <div style={{fontFamily: "Overpass", fontSize: "12px"}}>
            {props.content.metadata.name}
            <AudioPlayer
                src={props.content.url}
                showDownloadProgress="false"
                preload="metadata"
                style={{ width: props.size.width, marginTop: '5px' }}
            />
        </div>

    )
}
export default React.memo(AudioCard);
