import React from 'react';
import ReactPlayer from 'react-player/lazy';
/**
 * This Uploads The Video File in Storage And also can Stream the File.
 * @param {*} props - Property of File .
 * @property `typeAPI` , `content` , `id`
 */
const VideosCard = (props) =>{
    const changeSize = (height, width) => {
        props.typeAPI.resize(props.id, { width: width, height: height })
    }
    return (
        <div>
            
            { props.content.text === undefined ?
                Object.entries(props.content).map((fileKey,val)=>{
                    //console.log(fileKey[0] , fileKey[1]?.url )//
                    const maxDimension = Math.max(val.height, val.width);
                    const multiplier = maxDimension > 500 ? 500 / maxDimension : 1;
                    return (
                        <div key={fileKey[0]} onLoad={e => changeSize(Math.floor(val.height * multiplier) + 5, Math.floor(val.width * multiplier) + 5)} >
                        File Name : {fileKey[0].split(">")[0]}
                        <ReactPlayer
                            controls={true}
                            url={fileKey[1]?.url}
                            height={`${Math.floor(val.height * multiplier)}px`}
                            width={`${Math.floor(val.width * multiplier)}px`}
                        />
                        </div>
                    )
                })
                : null
            }
        </div>

    )
    
}
export default React.memo(VideosCard);
