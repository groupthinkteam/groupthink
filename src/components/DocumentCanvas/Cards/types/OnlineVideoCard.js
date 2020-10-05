import React from 'react';
import ReactPlayer from 'react-player/lazy'
import InlineTextEdit from "../../../InlineTextEdit/InlineTextEdit"
/**
 * This is an Offline Link Card Shows Videos And Audio Player .
 * @param {*} props - Property of File .
 * @property `typeAPI` , `content` , `id`
 */
const OnlineVideoCard = (props) => {
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
                    />
                </div>
                : null
            }
        </>
    )
}
export default React.memo(OnlineVideoCard);