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
            <div className="header">
                <img src={require("../../../../assets/card-icons/audio.svg")} alt="audio" />
                <span className="name">
                    {props.content.metadata.name}
                </span>
            </div>
            <AudioPlayer
                src={props.content.url}
                showDownloadProgress="false"
                preload="metadata"
                style={{ width: "100%" }}
                showSkipControls={false}
                showJumpControls={false}
                loop={false}
                // customIcons={
                //     {
                //         play: <img src={require("../../../../assets/card-icons/audio.svg")}/>
                //     }
                // }
            />
        </div>

    )
}
export default React.memo(AudioCard);
