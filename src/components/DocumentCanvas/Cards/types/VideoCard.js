import React from 'react';
import ReactPlayer from 'react-player/lazy';
/**
 * This Uploads The Video File in Storage And also can Stream the File.
 * @param {*} props - Property of File .
 * @property `typeAPI` , `content` , `id`
 */
const VideosCard = (props) =>{
    return (
        <div>
            
            { props.content.text === undefined ?
                Object.entries(props.content).map((fileKey,val)=>{
                    //console.log(fileKey[0] , fileKey[1]?.url )//
                    return (
                        <div key={fileKey[0]} >
                        File Name : {fileKey[0].split(">")[0]}
                        <ReactPlayer
                            controls={true}
                            url={fileKey[1]?.url}
                            //ref={reactPlayerRef}
                            width={props.size.width}
                            height={props.size.height}
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
