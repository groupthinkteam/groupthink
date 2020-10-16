import React from 'react';
import ReactPlayer from 'react-player/lazy'
import InlineTextEdit from "../../../InlineTextEdit/InlineTextEdit"
/**
 * This is an Offline Link Card Shows Videos And Audio Player .
 * @param {*} props - Property of File .
 * @property `typeAPI` , `content` , `id`
 */

const OnlineVideoCard = (props) => {
    var video_id = props.content.url.split('v=')[1];
    var ampersandPosition = video_id.indexOf('&');
    if(ampersandPosition != -1) {
    video_id = video_id.substring(0, ampersandPosition);
    }
    console.log("YTID ", video_id)
    return (
        <>
            {
                props.content?.url ?
                <div >
                    <ReactPlayer
                        url={props.content.url}
                        width=""
                        height="250px"  
                        controls={true}
                        light={true}
                        pip={true}
                        stopOnUnmount={false}
                        ref={e=>{
                            if(!e) return;
                            console.log(e)
                        }}
                    />
                </div>
                : null
            }
        </>
    )
}
export default React.memo(OnlineVideoCard);