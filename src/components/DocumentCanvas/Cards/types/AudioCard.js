import React from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/src/styles.scss';
/**
 * This File Shows the Input of Audio File .
 * @param {*} props 
 */
const AudioCard = (props) => {
    return (
        <div>
            { props.content.text === undefined ?
                Object.entries(props.content).map(([fileKey,val])=>{
                    //console.log(fileKey , fileKey[1]?.url )//
                    return (
                        <div key={fileKey}>
                        File Name : {fileKey.split(">")[0]}
                        <AudioPlayer
                            src={val.url}
                            showDownloadProgress="false"
                            preload="metadata"
                            style={{width:props.size.width , marginTop:'5px'}}
                        />
                        </div>
                    )
                })
                : null
            }
        </div>

    )
}
export default React.memo(AudioCard);
